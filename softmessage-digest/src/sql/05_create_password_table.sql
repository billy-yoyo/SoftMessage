
CREATE TABLE IF NOT EXISTS sm_password (
    login_name VARCHAR(255) PRIMARY KEY,
    user_id INT REFERENCES sm_user (user_id) NOT NULL,
    password_hash TEXT
)
