<?php
// backend/users.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require 'vendor/autoload.php';

use Aws\DynamoDb\DynamoDbClient;
use Aws\CognitoIdentityProvider\CognitoIdentityProviderClient;
use Aws\Exception\AwsException;

// CONFIGURATION
$region = 'us-east-1';
$userPoolId = 'us-east-1_xxxxxxxxx'; // REPLACE WITH YOUR USER POOL ID
$tableName = 'Users';

// Clients
$dynamo = new DynamoDbClient([
    'region'  => $region,
    'version' => 'latest'
]);
$cognito = new CognitoIdentityProviderClient([
    'region'  => $region,
    'version' => 'latest'
]);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// GET: List Users
if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    
    try {
        if ($id) {
            // Get single user
            $result = $dynamo->getItem([
                'TableName' => $tableName,
                'Key' => ['id' => ['S' => $id]]
            ]);
            
            if (empty($result['Item'])) {
                http_response_code(404);
                echo json_encode(['error' => 'User not found']);
                exit();
            }
            
            $item = $result['Item'];
            $user = [
                'id' => $item['id']['S'],
                'username' => $item['username']['S'] ?? '',
                'email' => $item['email']['S'] ?? '',
                'real_name' => $item['real_name']['S'] ?? '',
                'phone_number' => $item['phone_number']['S'] ?? '',
                'is_admin' => isset($item['is_admin']['N']) ? (bool)$item['is_admin']['N'] : false,
                'created_at' => $item['created_at']['S'] ?? ''
            ];
            echo json_encode(['user' => $user]);
            
        } else {
            // List all users
            $result = $dynamo->scan([
                'TableName' => $tableName
            ]);

            $items = [];
            foreach ($result['Items'] as $item) {
                $items[] = [
                    'id' => $item['id']['S'],
                    'username' => $item['username']['S'] ?? '',
                    'email' => $item['email']['S'] ?? '',
                    'real_name' => $item['real_name']['S'] ?? '',
                    'phone_number' => $item['phone_number']['S'] ?? '',
                    'is_admin' => isset($item['is_admin']['N']) ? (bool)$item['is_admin']['N'] : false,
                    'created_at' => $item['created_at']['S'] ?? ''
                ];
            }
            echo json_encode(['items' => $items, 'total' => count($items)]);
        }
    } catch (AwsException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// PUT: Update User (and Promote/Demote)
elseif ($method === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing user ID']);
        exit();
    }

    $data = json_decode(file_get_contents('php://input'), true);
    
    // Prepare DynamoDB update
    $updates = [];
    $eav = [];
    $ean = [];

    if (isset($data['name'])) {
        $updates[] = '#n = :n';
        $eav[':n'] = ['S' => $data['name']];
        $ean['#n'] = 'real_name';
    }
    if (isset($data['email'])) {
        $updates[] = 'email = :e';
        $eav[':e'] = ['S' => $data['email']];
    }
    if (isset($data['phone'])) {
        $updates[] = 'phone_number = :p';
        $eav[':p'] = ['S' => $data['phone']];
    }
    
    // Handle Admin Status
    if (isset($data['is_admin'])) {
        $isAdmin = $data['is_admin'] ? 1 : 0;
        $updates[] = 'is_admin = :a';
        $eav[':a'] = ['N' => (string)$isAdmin];

        // Cognito Group Operation
        try {
            // First get the username from DynamoDB to use in Cognito
            $userResult = $dynamo->getItem([
                'TableName' => $tableName,
                'Key' => ['id' => ['S' => $id]]
            ]);
            
            if (!empty($userResult['Item'])) {
                $username = $userResult['Item']['username']['S'];
                
                if ($isAdmin) {
                    $cognito->adminAddUserToGroup([
                        'UserPoolId' => $userPoolId,
                        'Username' => $username,
                        'GroupName' => 'Admins'
                    ]);
                } else {
                    $cognito->adminRemoveUserFromGroup([
                        'UserPoolId' => $userPoolId,
                        'Username' => $username,
                        'GroupName' => 'Admins'
                    ]);
                }
            }
        } catch (AwsException $e) {
            // Log error but continue with DB update
            error_log("Cognito Error: " . $e->getMessage());
        }
    }

    if (empty($updates)) {
        echo json_encode(['message' => 'No changes']);
        exit();
    }

    try {
        $dynamo->updateItem([
            'TableName' => $tableName,
            'Key' => ['id' => ['S' => $id]],
            'UpdateExpression' => 'SET ' . implode(', ', $updates),
            'ExpressionAttributeValues' => $eav,
            'ExpressionAttributeNames' => !empty($ean) ? $ean : null
        ]);
        
        echo json_encode(['message' => 'User updated']);
        
    } catch (AwsException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// DELETE: Delete User
elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing user ID']);
        exit();
    }

    try {
        // 1. Get username to delete from Cognito
        $result = $dynamo->getItem([
            'TableName' => $tableName,
            'Key' => ['id' => ['S' => $id]]
        ]);

        if (!empty($result['Item'])) {
            $username = $result['Item']['username']['S'];
            
            // 2. Delete from Cognito
            try {
                $cognito->adminDeleteUser([
                    'UserPoolId' => $userPoolId,
                    'Username' => $username
                ]);
            } catch (AwsException $e) {
                // User might not exist in Cognito, continue
                error_log("Cognito Delete Error: " . $e->getMessage());
            }
        }

        // 3. Delete from DynamoDB
        $dynamo->deleteItem([
            'TableName' => $tableName,
            'Key' => ['id' => ['S' => $id]]
        ]);

        echo json_encode(['message' => 'User deleted']);

    } catch (AwsException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
