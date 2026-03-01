CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    mqtt_user VARCHAR(100) UNIQUE NOT NULL,
    mqtt_pass VARCHAR(100) NOT NULL,
    
    -- Прапорці підписок (базова мається на увазі для всіх зареєстрованих)
    sub_monitoring BOOLEAN DEFAULT FALSE,
    sub_security BOOLEAN DEFAULT FALSE,
    sub_announcements BOOLEAN DEFAULT FALSE
);

-- (Опціонально) Можеш одразу додати скрипт автоматичного створення твоєї тестової гімназії, 
-- щоб при чистому розгортанні вона вже була в базі:
INSERT INTO schools (name, mqtt_user, mqtt_pass, sub_monitoring, sub_security)
VALUES ('Центральна Гімназія', 'gym_admin', 'super123', true, false)
ON CONFLICT (name) DO NOTHING;
