-- Create the database where in env file as COMPANY_DB
CREATE DATABASE IF NOT EXISTS company;

-- Use the database
USE your_database_name;

-- Create the Company table
CREATE TABLE IF NOT EXISTS Companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('user', 'admin') DEFAULT 'user',
    dbName VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


