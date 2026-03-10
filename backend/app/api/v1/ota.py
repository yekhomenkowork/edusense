import os
from fastapi import APIRouter, Header, Response, HTTPException
from fastapi.responses import FileResponse
import paho.mqtt.publish as publish
from app.schemas.schemas import OTACommand
from app.core.config import settings

router = APIRouter()

@router.get("/ota")
def ota_update(x_esp8266_version: str = Header(None)):
    latest_version = os.getenv("LATEST_FW_VERSION", "1.0.0")
    fw_path = "/app/firmware/update.bin"

    if not x_esp8266_version:
        return Response(status_code=400, content="Відсутній заголовок версії")
    if x_esp8266_version == latest_version:
        return Response(status_code=304)
    if os.path.exists(fw_path):
        return FileResponse(fw_path, media_type="application/octet-stream")
    return Response(status_code=404, content="Файл прошивки не знайдено")

@router.post("/admin/trigger_ota")
def trigger_ota(cmd: OTACommand):
    topic = f"edusense/{cmd.school_name}/{cmd.device_id}/cmd" if cmd.device_id else f"edusense/{cmd.school_name}/cmd"
    auth = {'username': settings.MQTT_USER, 'password': settings.MQTT_PASSWORD}
    try:
        publish.single(topic, payload="UPDATE_FW", hostname=settings.MQTT_HOST, port=settings.MQTT_PORT, auth=auth)
        return {"status": "ok", "message": f"Команду відправлено в топік: {topic}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Помилка MQTT: {str(e)}")
