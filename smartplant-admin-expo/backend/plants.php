<?php
// backend/plants.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'vendor/autoload.php'; // Ensure AWS SDK is installed

use Aws\DynamoDb\DynamoDbClient;
use Aws\Exception\AwsException;

// Configure DynamoDB Client
$client = new DynamoDbClient([
    'region'  => 'us-east-1', // Change if your DynamoDB is in a different region
    'version' => 'latest'
]);

$tableName = 'Plants'; // Ensure this matches your DynamoDB table name

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($method === 'GET') {
    // Fetch all plants
    try {
        $result = $client->scan([
            'TableName' => $tableName
        ]);

        $items = [];
        foreach ($result['Items'] as $item) {
            // Unmarshal DynamoDB JSON format to standard JSON
            $items[] = [
                'id' => $item['id']['S'],
                'description' => $item['description']['S'] ?? '',
                'latitude' => $item['latitude']['S'] ?? '0',
                'longitude' => $item['longitude']['S'] ?? '0',
                'image_url' => $item['image_url']['S'] ?? '',
                'created_at' => $item['created_at']['S'] ?? ''
            ];
        }

        echo json_encode(['items' => $items, 'total' => count($items)]);

    } catch (AwsException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    // Create new plant
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !isset($data['description']) || !isset($data['latitude']) || !isset($data['longitude'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit();
    }

    $id = uniqid();
    $now = date('c');

    $item = [
        'id' => ['S' => $id],
        'description' => ['S' => $data['description']],
        'latitude' => ['S' => (string)$data['latitude']],
        'longitude' => ['S' => (string)$data['longitude']],
        'image_url' => ['S' => $data['image_url'] ?? ''],
        'created_at' => ['S' => $now]
    ];

    try {
        $client->putItem([
            'TableName' => $tableName,
            'Item' => $item
        ]);

        echo json_encode(['message' => 'Plant created', 'id' => $id]);

    } catch (AwsException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
