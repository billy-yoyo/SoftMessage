
CREATE TABLE IF NOT EXISTS sm_message (
    message_id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    channel_id VARCHAR(255),
    body TEXT
)
