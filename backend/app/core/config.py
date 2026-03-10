import os

class Settings:
    PROJECT_NAME: str = "EduSense Cloud API"
    
    # Database
    DB_NAME: str = os.getenv("DB_NAME", "edusense_db")
    DB_USER: str = os.getenv("DB_USER", "eduser")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "eduser_pass")
    DB_HOST: str = "db"
    
    # Збираємо URL для бази даних
    DATABASE_URL: str = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
    
    # MQTT
    MQTT_USER: str = os.getenv("MQTT_USER", "mqtt_user")
    MQTT_PASSWORD: str = os.getenv("MQTT_PASSWORD", "mqtt_pass")
    MQTT_HOST: str = "mosquitto"
    MQTT_PORT: int = 1883

settings = Settings()
