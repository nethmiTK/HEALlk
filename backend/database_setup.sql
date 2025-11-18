-- HEALlk Database Setup Script

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS heallk_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE heallk_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_role ON users(role);

-- Insert sample admin user (password: admin123)
INSERT INTO users (full_name, email, password, role) VALUES 
('Admin User', 'admin@heallk.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewmY1DVg9.gqzeha', 'admin');

-- Display created tables
SHOW TABLES;

-- Display users table structure
DESCRIBE users;