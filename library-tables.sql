CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE books (
    title VARCHAR(255) NOT NULL,
    description TEXT,
    publication VARCHAR(255),
    author_name VARCHAR(255) NOT NULL,
    cover_image VARCHAR(255),
    PRIMARY KEY (title, author_name),  
    FOREIGN KEY (author_name) REFERENCES authors(name) ON DELETE CASCADE
);
CREATE TABLE authors (
    name VARCHAR(255) PRIMARY KEY,
    gender VARCHAR(50)
);

INSERT INTO books (title, description, publication, author_name, cover_image)
VALUES ('Harry Potter', 'A book about wizards', '1997-06-26', 'J.K. Rowling', 'path/to/cover.jpg');


INSERT INTO users (name, email, password, role, verified) 
VALUES ('Admin', 'admin@example.com', 'adminpassword', 'admin', TRUE)
ON CONFLICT (email) DO NOTHING;
