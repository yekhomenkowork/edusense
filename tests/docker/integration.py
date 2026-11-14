import json
import ssl
import subprocess
import sys
import time
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from uuid import uuid4

import pyotp
from paho.mqtt.client import CallbackAPIVersion, Client
from paho.mqtt.publish import single

fixture = Path("/fixture")
tls = ssl.create_default_context(cafile=str(fixture / "ca.crt"))


def request(path, data=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    body = json.dumps(data).encode() if data is not None else None
    try:
        with urlopen(Request("https://frontend:8443" + path, body, headers), context=tls, timeout=5) as response:
            return response.status, response.read()
    except HTTPError as error:
        return error.code, error.read()


def call(path, data=None, token=None):
    code, body = request(path, data, token)
    assert code in (200, 201), (code, path)
    return json.loads(body)


def certificate(identity):
    root = fixture / "devices" / identity
    key, cert, csr = [str(root.with_suffix("." + ext)) for ext in ("key", "crt", "csr")]
    subprocess.run([
        "openssl", "req", "-new", "-newkey", "rsa:2048", "-nodes", "-subj", "/CN=" + identity,
        "-keyout", key, "-out", csr,
    ], check=True, capture_output=True)
    subprocess.run([
        "openssl", "x509", "-req", "-days", "1", "-in", csr, "-CA", str(fixture / "ca.crt"),
        "-CAkey", str(fixture / "ca.key"), "-CAcreateserial", "-out", cert,
    ], check=True, capture_output=True)
    return {"ca_certs": str(fixture / "ca.crt"), "certfile": cert, "keyfile": key}


def publish(device, event, config):
    single(f"edusense/v1/devices/{device}/telemetry", json.dumps(event), qos=1,
           hostname="mosquitto", port=8883, tls=config)


def main():
    assert b"EduSense" in request("/")[1]
    assert request("/api/schools")[0] == 401
    if len(sys.argv) > 1 and sys.argv[1] == "persistence":
        path, session = (fixture / "integration-state").read_text().splitlines()
        rows = call(path, token=session)
        assert len(rows) == 1 and rows[0]["value"] == 21.5
        return
    password = (fixture / "secrets/admin-password").read_text().strip()
    otp = pyotp.TOTP((fixture / "secrets/admin-totp").read_text().strip()).now()
    admin = call("/api/auth/login", {"email": "admin@example.invalid", "password": password,
                                    "otp": otp})["access_token"]
    a = call("/api/schools", {"name": "A", "plan": "Expired"}, admin)["id"]
    b = call("/api/schools", {"name": "B"}, admin)["id"]
    email, password = "staff@example.invalid", uuid4().hex
    call(f"/api/schools/{a}/users", {"email": email, "name": "Staff", "role": "staff",
                                   "password": password}, admin)
    staff = call("/api/auth/login", {"email": email, "password": password})["access_token"]
    assert request(f"/api/schools/{b}", token=staff)[0] == 404
    actual = call(f"/api/schools/{a}/devices", {"name": "Device A"}, admin)["id"]
    other = call(f"/api/schools/{b}/devices", {"name": "Device B"}, admin)["id"]
    event = {"schema_version": 1, "message_id": str(uuid4()),
             "metrics": [{"name": "temperature", "value": 21.5, "unit": "Cel"}]}
    config = certificate(actual)
    probe = Client(CallbackAPIVersion.VERSION2)
    probe.tls_set(ca_certs=str(fixture / "ca.crt"))
    accepted = []
    probe.on_connect = lambda _client, _data, _flags, reason, _properties: accepted.append(not reason.is_failure)
    try:
        probe.connect("mosquitto", 8883, 5)
        for _ in range(5):
            if probe.loop(timeout=1) != 0 or accepted:
                break
    except ssl.SSLError:
        accepted.append(False)
    finally:
        probe.disconnect()
    assert accepted != [True], "MQTT accepted a client without a certificate"
    publish(other, event, config)
    publish(actual, event, config)
    publish(actual, event, config)
    path = f"/api/schools/{a}/devices/{actual}/telemetry"
    for _ in range(30):
        rows = call(path, token=staff)
        if rows:
            break
        time.sleep(1)
    assert len(rows) == 1 and rows[0]["value"] == 21.5
    assert call(f"/api/schools/{b}/devices/{other}/telemetry", token=admin) == []
    assert call(f"/api/schools/{a}/devices", token=staff)[0]["status"] == "online"
    (fixture / "integration-state").write_text(f"{path}\n{staff}")


if __name__ == "__main__":
    main()
