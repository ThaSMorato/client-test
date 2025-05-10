-- Insert admin user with bcrypt password as password and secret as SECRET
INSERT INTO "users" ("id", "email", "name", "role", "password", "created_at", "updated_at")
VALUES (
    gen_random_uuid(),
    'admin@aiqfome.com',
    'Admin',
    'ADMIN',
    '$2b$10$b2tZ3lqZ0BhzicjdKhAUXedeOTtQQsGk2LmQO.C9wpZ3/9owKa73W',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
