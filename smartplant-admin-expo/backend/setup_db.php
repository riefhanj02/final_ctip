<?php
require 'db_connect.php';

try {
    // Create iot_sensor_readings table
    $sql = "CREATE TABLE IF NOT EXISTS iot_sensor_readings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        temperature FLOAT,
        humidity FLOAT,
        gps_latitude FLOAT,
        gps_longitude FLOAT,
        gps_altitude FLOAT,
        gps_speed FLOAT,
        gps_satellites INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->exec($sql);
    echo "Table 'iot_sensor_readings' created successfully.<br>";

    // Create iot_motion_alerts table
    $sql = "CREATE TABLE IF NOT EXISTS iot_motion_alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        alert_type VARCHAR(50),
        gps_latitude FLOAT,
        gps_longitude FLOAT,
        gps_altitude FLOAT,
        gps_address VARCHAR(255),
        confidence_score FLOAT,
        is_read TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->exec($sql);
    echo "Table 'iot_motion_alerts' created successfully.<br>";

    // Create sightings table
    $sql = "CREATE TABLE IF NOT EXISTS sightings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        description VARCHAR(255) NOT NULL,
        species VARCHAR(100),
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        rarity ENUM('Common', 'Uncommon', 'Rare', 'Endangered') DEFAULT 'Common',
        image_url VARCHAR(500),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->exec($sql);
    echo "Table 'sightings' created successfully.<br>";

} catch(PDOException $e) {
    echo "Error creating tables: " . $e->getMessage();
}
?>
