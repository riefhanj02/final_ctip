CREATE DATABASE IF NOT EXISTS SmartPlant;
USE SmartPlant;

-- Disable foreign key checks to allow dropping tables in any order
SET FOREIGN_KEY_CHECKS = 0;

-- Drop all existing tables (including any that might have foreign keys)
DROP TABLE IF EXISTS plant_uploads;
DROP TABLE IF EXISTS uploads;
DROP TABLE IF EXISTS iot_sensor_readings;
DROP TABLE IF EXISTS iot_motion_alerts;
DROP TABLE IF EXISTS users;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ================== Users Table ==================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    real_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255) DEFAULT NULL,
    email_visible BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,         
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================== Uploads Table ==================
CREATE TABLE uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    confidence_score FLOAT,
    species_identified VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- ================== Plant Uploads Table (Admin View) ==================
-- This table stores the same data as uploads but may be used 
-- for admin dashboard queries or different access patterns
CREATE TABLE plant_uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    confidence_score FLOAT,
    species_identified VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- ================== IoT Sensor Readings Table ==================
CREATE TABLE iot_sensor_readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    gps_latitude DECIMAL(10, 6),
    gps_longitude DECIMAL(10, 6),
    gps_altitude DECIMAL(8, 2),
    gps_speed DECIMAL(6, 2),
    gps_satellites INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at)
);

-- ================== IoT Motion Alerts Table ==================
CREATE TABLE iot_motion_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alert_type VARCHAR(50) DEFAULT 'person_detected',
    gps_latitude DECIMAL(10, 6),
    gps_longitude DECIMAL(10, 6),
    gps_altitude DECIMAL(8, 2),
    gps_address TEXT,
    confidence_score DECIMAL(5, 2),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at),
    INDEX idx_is_read (is_read)
);

-- ================== Insert Default Users ==================
-- Password for 'admin': admin123
-- Password for 'user': user123
INSERT INTO users (username, email, real_name, phone_number, password_hash, profile_pic, email_visible, is_admin)
VALUES
('admin', 'admin@example.com', 'Administrator', '0123456789', '$2y$10$qEEYLXzSMb3TQMfy7Os33.cxparDqwcGP2Ten1bJ.9fwHzJq9bZN2', NULL, 1, 1),
('user',  'user@example.com',  'Normal User', '0100000000', '$2y$10$Sp38NmYLlass0vU8mT.U..NPdLCjf7CagkNeCGL.mWwreHu7pXCtW', NULL, 0, 0);

