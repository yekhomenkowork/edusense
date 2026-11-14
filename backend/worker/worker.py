import logging
import os
import signal
import ssl
from datetime import UTC, datetime
from pathlib import Path

import paho.mqtt.client as mqtt
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.logging import configure_logging
from app.database import get_engine
from app.models.models import Device, Reading
from worker.protocol import State, decode

logger = logging.getLogger("edusense.worker")
ready = Path("/tmp/mqtt-ready")


def persist(db, topic, payload, retained):
    identity, data = decode(topic, payload)
    device = db.get(Device, identity, with_for_update=True)
    if device is None or not device.enabled or retained:
        return
    now = datetime.now(UTC)
    if isinstance(data, State):
        device.reported_state = data.status
    else:
        for metric in data.metrics:
            db.execute(insert(Reading).values(
                device_id=device.id, school_id=device.school_id, message_id=data.message_id,
                metric=metric.name, value=metric.value, unit=metric.unit, received_at=now,
            ).on_conflict_do_nothing())
        device.reported_state = "online"
    device.last_seen = now
    db.commit()


def on_message(client, _data, message):
    try:
        with Session(get_engine()) as db:
            persist(db, message.topic, message.payload, message.retain)
    except ValueError:
        logger.warning("invalid_mqtt_message")
    except SQLAlchemyError:
        logger.error("telemetry_database_error")
        ready.unlink(missing_ok=True)
        # The persistent broker session can redeliver the unacknowledged message.
        os._exit(1)
    if message.qos:
        client.ack(message.mid, message.qos)


def on_connect(client, _data, _flags, reason, _properties):
    if not reason.is_failure:
        client.subscribe([("edusense/v1/devices/+/telemetry", 1), ("edusense/v1/devices/+/state", 1)])


def on_subscribe(_client, _data, _mid, reasons, _properties):
    if len(reasons) == 2 and all(not reason.is_failure for reason in reasons):
        ready.touch()


def on_disconnect(_client, _data, _flags, _reason, _properties):
    ready.unlink(missing_ok=True)


def main():
    configure_logging()
    get_engine()
    ready.unlink(missing_ok=True)
    context = ssl.create_default_context(cafile="/run/worker-pki/ca.crt")
    context.load_cert_chain("/run/worker-pki/worker.crt", "/run/worker-pki/worker.key")
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="edusense-worker",
                         clean_session=False, manual_ack=True)
    client.tls_set_context(context)
    client.on_connect = on_connect
    client.on_subscribe = on_subscribe
    client.on_disconnect = on_disconnect
    client.on_message = on_message
    client.reconnect_delay_set(1, 30)
    signal.signal(signal.SIGTERM, lambda *_: client.disconnect())
    client.connect_async("mosquitto", 8883, 30)
    try:
        client.loop_forever(retry_first_connection=True)
    finally:
        ready.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
