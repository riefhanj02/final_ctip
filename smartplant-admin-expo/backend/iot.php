<?php
// backend/iot.php - Local PHP backend for IoT data (MySQL)
require 'db_connect.php';

// ================== CORS Headers for Hybrid Mode ==================
// Allow requests from any origin (for Expo Web and mobile apps)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$mode = isset($_GET['mode']) ? $_GET['mode'] : '';

// Handle preflight requests (CORS OPTIONS)
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    if ($method === 'GET') {
        if ($mode === 'stats') {
            // Get total readings
            $stmt = $conn->query("SELECT COUNT(*) as count FROM iot_sensor_readings");
            $total_readings = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

            // Get total alerts
            $stmt = $conn->query("SELECT COUNT(*) as count FROM iot_motion_alerts");
            $total_alerts = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

            // Get unread alerts
            $stmt = $conn->query("SELECT COUNT(*) as count FROM iot_motion_alerts WHERE is_read = 0");
            $unread_alerts = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

            // Get latest reading
            $stmt = $conn->query("SELECT * FROM iot_sensor_readings ORDER BY created_at DESC LIMIT 1");
            $latest_reading = $stmt->fetch(PDO::FETCH_ASSOC);

            echo json_encode([
                "total_readings" => $total_readings,
                "total_alerts" => $total_alerts,
                "unread_alerts" => $unread_alerts,
                "latest_reading" => $latest_reading
            ]);
        } elseif ($mode === 'alerts') {
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['page_size']) ? (int)$_GET['page_size'] : 10;
            $offset = ($page - 1) * $limit;
            $unread_only = isset($_GET['unread_only']) && $_GET['unread_only'] == '1';

            $sql = "SELECT * FROM iot_motion_alerts";
            if ($unread_only) {
                $sql .= " WHERE is_read = 0";
            }
            $sql .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";

            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $alerts = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(["alerts" => $alerts]);
        } elseif ($mode === 'readings') {
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['page_size']) ? (int)$_GET['page_size'] : 20;
            $offset = ($page - 1) * $limit;

            $stmt = $conn->prepare("SELECT * FROM iot_sensor_readings ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $readings = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(["readings" => $readings]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid mode"]);
        }
    } elseif ($method === 'PUT') {
        if ($mode === 'mark_all_read') {
            $stmt = $conn->prepare("UPDATE iot_motion_alerts SET is_read = 1 WHERE is_read = 0");
            $stmt->execute();
            echo json_encode(["message" => "All alerts marked as read"]);
        } elseif (isset($_GET['id'])) {
            $id = (int)$_GET['id'];
            $stmt = $conn->prepare("UPDATE iot_motion_alerts SET is_read = 1 WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            echo json_encode(["message" => "Alert marked as read"]);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "Invalid request"]);
        }
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
