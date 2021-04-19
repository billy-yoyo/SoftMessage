

CREATE TABLE IF NOT EXISTS sm_channel_users (
    channel_id INT REFERENCES sm_channel (channel_id) NOT NULL,
    user_id INT REFERENCES sm_user (user_id) NOT NULL,
    UNIQUE (channel_id, user_id)
)
