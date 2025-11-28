<?php
// backend/sightings.php
require 'db_connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure uploads directory exists
$uploadDir = __DIR__ . '/uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Function to mask coordinates for rare plants
function maskCoordinates($latitude, $longitude, $rarity) {
    // Only mask Rare and Endangered plants
    if ($rarity === 'Rare' || $rarity === 'Endangered') {
        // Add random offset of ±0.01 degrees (~1km)
        $latOffset = (mt_rand(-100, 100) / 10000);
        $lngOffset = (mt_rand(-100, 100) / 10000);
        
        return [
            'latitude' => $latitude + $latOffset,
            'longitude' => $longitude + $lngOffset,
            'is_masked' => true
        ];
    }
    
    return [
        'latitude' => $latitude,
        'longitude' => $longitude,
        'is_masked' => false
    ];
}

if ($method === 'GET') {
    try {
        // Check if admin mode is enabled
        $isAdmin = isset($_GET['admin']) && $_GET['admin'] == '1';
        
        // Fetch all sightings
        $stmt = $conn->query("SELECT * FROM sightings ORDER BY created_at DESC");
        $sightings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Add full URL to image path and apply masking
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
        $host = $_SERVER['HTTP_HOST'];
        $basePath = dirname($_SERVER['SCRIPT_NAME']);
        
        foreach ($sightings as &$sighting) {
            // Handle image URL
            if (!empty($sighting['image_url']) && !filter_var($sighting['image_url'], FILTER_VALIDATE_URL)) {
                $sighting['image_url'] = "$protocol://$host$basePath/uploads/" . $sighting['image_url'];
            }
            
            // Apply location masking if not admin
            if (!$isAdmin) {
                $masked = maskCoordinates(
                    $sighting['latitude'],
                    $sighting['longitude'],
                    $sighting['rarity']
                );
                $sighting['latitude'] = $masked['latitude'];
                $sighting['longitude'] = $masked['longitude'];
                $sighting['is_masked'] = $masked['is_masked'];
            } else {
                $sighting['is_masked'] = false;
            }
        }

        echo json_encode(['items' => $sightings]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    try {
        $description = $_POST['description'] ?? '';
        $latitude = $_POST['latitude'] ?? 0;
        $longitude = $_POST['longitude'] ?? 0;
        $species = $_POST['species'] ?? 'Unknown';
        $rarity = $_POST['rarity'] ?? 'Common';
        
        // Validate rarity value
        $validRarities = ['Common', 'Uncommon', 'Rare', 'Endangered'];
        if (!in_array($rarity, $validRarities)) {
            $rarity = 'Common';
        }
        
        $imagePath = '';
        
        // Handle File Upload
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['image']['tmp_name'];
            $fileName = $_FILES['image']['name'];
            $fileNameCmps = explode(".", $fileName);
            $fileExtension = strtolower(end($fileNameCmps));
            
            $allowedfileExtensions = array('jpg', 'gif', 'png', 'jpeg');
            if (in_array($fileExtension, $allowedfileExtensions)) {
                $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
                $dest_path = $uploadDir . $newFileName;
                
                if(move_uploaded_file($fileTmpPath, $dest_path)) {
                    $imagePath = $newFileName;
                } else {
                    throw new Exception("Error moving uploaded file");
                }
            } else {
                throw new Exception("Upload failed. Allowed file types: " . implode(',', $allowedfileExtensions));
            }
        } elseif (isset($_POST['image_url'])) {
            // Fallback to URL if provided
            $imagePath = $_POST['image_url'];
        }

        $sql = "INSERT INTO sightings (description, species, latitude, longitude, rarity, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$description, $species, $latitude, $longitude, $rarity, $imagePath]);
        
        echo json_encode(['message' => 'Sighting added successfully', 'id' => $conn->lastInsertId()]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        try {
            $stmt = $conn->prepare("DELETE FROM sightings WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['message' => 'Sighting deleted']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Missing ID']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
