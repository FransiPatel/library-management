CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    author VARCHAR(255) NOT NULL,
    publication VARCHAR(255),
    cover_image VARCHAR(255)
);

CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')) NOT NULL
);

INSERT INTO users (name, email, password, role, verified) 
VALUES ('Admin', 'admin@example.com', 'adminpassword', 'admin', TRUE)
ON CONFLICT (email) DO NOTHING;

