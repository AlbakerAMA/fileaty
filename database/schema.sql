-- Fileaty Database Schema
-- Version: 1.0

-- Drop existing tables if they exist
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Files;
DROP TABLE IF EXISTS Users;

-- Create Users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Files table
CREATE TABLE Files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    originalName VARCHAR(255) NOT NULL,
    size INT NOT NULL,
    mimeType VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    uploaderId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaderId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create Comments table
CREATE TABLE Comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    fileId INT NOT NULL,
    userId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fileId) REFERENCES Files(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Insert sample data for testing
-- Sample admin user (password: admin123)
INSERT INTO Users (username, email, password, role) VALUES 
('admin', 'admin@example.com', '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO', 'admin'),
('user1', 'user1@example.com', '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO', 'user'),
('user2', 'user2@example.com', '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO', 'user');

-- Sample files
INSERT INTO Files (filename, originalName, size, mimeType, url, uploaderId) VALUES 
('1678901234567-sample1.pdf', 'sample1.pdf', 102400, 'application/pdf', 'https://fileaty-bucket.s3.amazonaws.com/1678901234567-sample1.pdf', 2),
('1678901234568-sample2.jpg', 'sample2.jpg', 204800, 'image/jpeg', 'https://fileaty-bucket.s3.amazonaws.com/1678901234568-sample2.jpg', 3);

-- Sample comments
INSERT INTO Comments (content, fileId, userId) VALUES 
('This is a great file!', 1, 3),
('Thanks for sharing this.', 1, 2),
('I have a question about this file.', 2, 2);

-- Create indexes for better performance
CREATE INDEX idx_files_uploaderId ON Files(uploaderId);
CREATE INDEX idx_comments_fileId ON Comments(fileId);
CREATE INDEX idx_comments_userId ON Comments(userId);