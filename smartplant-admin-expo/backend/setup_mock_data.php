<?php
require 'db_connect.php';

header("Content-Type: application/json");

try {
    // 1. Insert Mock Sensor Readings
    $readings = [
        [25.5, 60.2, 1.553400, 110.359180, 15.5, 0.0, 8, date('Y-m-d H:i:s', strtotime('-1 hour'))],
        [26.3, 58.7, 1.553400, 110.359180, 15.5, 0.0, 9, date('Y-m-d H:i:s', strtotime('-45 minutes'))],
        [27.1, 57.3, 1.553400, 110.359180, 15.5, 0.0, 10, date('Y-m-d H:i:s', strtotime('-30 minutes'))],
        [24.8, 62.1, 1.553400, 110.359180, 15.5, 0.0, 8, date('Y-m-d H:i:s', strtotime('-15 minutes'))],
        [25.2, 61.5, 1.553400, 110.359180, 15.5, 0.0, 9, date('Y-m-d H:i:s')]
    ];

    $stmt = $conn->prepare("INSERT INTO iot_sensor_readings (temperature, humidity, gps_latitude, gps_longitude, gps_altitude, gps_speed, gps_satellites, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    foreach ($readings as $reading) {
        $stmt->execute($reading);
    }

    // 2. Insert Mock Motion Alerts
    $alerts = [
        ['person_detected', 1.553400, 110.359180, 15.5, 'Kuching, Sarawak', 0.89, 0, date('Y-m-d H:i:s', strtotime('-2 hours'))],
        ['person_detected', 1.553400, 110.359180, 15.5, 'Kuching, Sarawak', 0.92, 0, date('Y-m-d H:i:s', strtotime('-1 hour'))],
        ['animal_detected', 1.553500, 110.359280, 16.0, 'Kuching, Sarawak', 0.75, 1, date('Y-m-d H:i:s', strtotime('-3 hours'))] // Read alert
    ];

    $stmt = $conn->prepare("INSERT INTO iot_motion_alerts (alert_type, gps_latitude, gps_longitude, gps_altitude, gps_address, confidence_score, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

    foreach ($alerts as $alert) {
        $stmt->execute($alert);
    }

    echo json_encode([
        "message" => "Mock data inserted successfully!",
        "readings_inserted" => count($readings),
        "alerts_inserted" => count($alerts)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
