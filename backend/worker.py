# backend/worker.py
import os
import time
import psycopg2
import paho.mqtt.client as mqtt

DB_CONFIG = {
    "dbname": os.getenv("DB_NAME", "edusense_db"),
    "user": os.getenv("DB_USER", "eduser"),
    "password": os.getenv("DB_PASSWORD", "eduser_pass"),
    "host": "db"
}

def save_sensor_data(school, device, topic, value):
    try:
        with psycopg2.connect(**DB_CONFIG) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO sensor_data (school_name, device_id, topic, value) VALUES (%s, %s, %s, %s)",
                    (school, device, topic, float(value))
                )
    except Exception as e:
        print(f"❌ DB Error: {e}")

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("✅ Standalone Worker успішно підключився до Mosquitto")
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
    client.username_pw_set(os.getenv("MQTT_USER"), os.getenv("MQTT_PASSWORD"))
    client.on_connect = on_connect
    client.on_message = on_message
    
    while True:
        try:
            client.connect("mosquitto", 1883, 60)
            client.loop_forever()
        except Exception as e:
            print(f"⚠️ Втрачено зв'язок з Mosquitto: {e}. Реконект через 5 сек...")
            time.sleep(5)
