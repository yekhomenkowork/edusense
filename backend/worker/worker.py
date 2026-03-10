import os
import time
import paho.mqtt.client as mqtt

# Імпортуємо наші нові налаштування та моделі з папки app
from app.core.config import settings
from app.db.database import SessionLocal
from app.models.models import SensorData

def save_sensor_data(school, device, topic, value):
    db = SessionLocal()
    try:
        # Створюємо новий запис через ORM SQLAlchemy
        new_data = SensorData(
            school_name=school,
            device_id=device,
            topic=topic,
            value=float(value)
        )
        db.add(new_data)
        db.commit()
    except Exception as e:
        print(f"❌ DB Error: {e}")
        db.rollback()
    finally:
        db.close()

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("✅ EduSense Worker успішно підключився до Mosquitto")
        client.subscribe("edusense/#")
    else:
        print(f"❌ Помилка підключення, код: {rc}")

def on_message(client, userdata, msg):
    try:
        parts = msg.topic.split('/')
        if len(parts) >= 4:
            val = msg.payload.decode()
            print(f"📩 Дані [{parts[1]} | {parts[2]}]: {parts[3]} = {val}")
            save_sensor_data(parts[1], parts[2], parts[3], val)
    except Exception as e:
        print(f"⚠️ Worker Error: {e}")

if __name__ == "__main__":
    print("⏳ Запуск MQTT Worker (очікування брокера 5 сек)...")
    time.sleep(5)
    
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.username_pw_set(settings.MQTT_USER, settings.MQTT_PASSWORD)
    client.on_connect = on_connect
    client.on_message = on_message
    
    while True:
        try:
            client.connect(settings.MQTT_HOST, settings.MQTT_PORT, 60)
            client.loop_forever()
        except Exception as e:
            print(f"⚠️ Втрачено зв'язок з Mosquitto: {e}. Реконект через 5 сек...")
            time.sleep(5)
