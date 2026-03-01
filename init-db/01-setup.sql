CREATE TABLE IF NOT EXISTS sensor_data (
    id SERIAL PRIMARY KEY,
    school_id VARCHAR(100),
    device_id VARCHAR(100),
    topic VARCHAR(255) NOT NULL,
    value FLOAT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sensor_time ON sensor_data(created_at);
