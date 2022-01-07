-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'class_status_enum') THEN
--         CREATE TYPE class_status_enum AS ENUM('d', 's', 'a', 'r', 'e', 'c');
--     END IF;
-- END
-- $$;

CREATE TABLE IF NOT EXISTS users (
    id          UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    username    VARCHAR(30)     NOT NULL UNIQUE,
    email       VARCHAR(256)    NOT NULL UNIQUE,
    password    VARCHAR(60)     NOT NULL,
    fname       VARCHAR(30)     NOT NULL,
    lname       VARCHAR(30)     NOT NULL
);
