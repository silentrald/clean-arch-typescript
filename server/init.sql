CREATE DATABASE sample_db;
CREATE ROLE sample_user WITH LOGIN PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE sample_db TO sample_user;

\c sample_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\q

-- psql -h localhost -p 5432 -U sample_user -W -d sample_db