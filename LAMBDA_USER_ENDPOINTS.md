# Lambda Function Code for User Management Endpoints

Your users are not being created in DynamoDB because the `/users/create` endpoint doesn't exist in your API Gateway. You need to add these endpoints to your Lambda function.

## Required Endpoints

1. **POST `/users/create`** - Create a new user in DynamoDB
2. **GET `/users/getByEmail?email={email}`** - Get user by email
3. **GET `/users/{userID}`** - Get user by userID

## Lambda Function Code

Add these handlers to your existing Lambda function (or create a new one):

```python
import json
import boto3
from datetime import datetime
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
users_table = dynamodb.Table('Users')  # Your DynamoDB table name

def lambda_handler(event, context):
    """
    Handle user management requests
    Routes:
    - POST /users/create
    - GET /users/getByEmail?email={email}
    - GET /users/{userID}
    """
    
    # Parse the request
    http_method = event.get('httpMethod', '')
    path = event.get('path', '')
    path_parameters = event.get('pathParameters') or {}
    query_parameters = event.get('queryStringParameters') or {}
    body = json.loads(event.get('body', '{}'))
    
    # Route to appropriate handler
    if http_method == 'POST' and path.endswith('/users/create'):
        return create_user(body, event)
    elif http_method == 'GET' and '/users/getByEmail' in path:
        email = query_parameters.get('email')
        return get_user_by_email(email)
    elif http_method == 'GET' and path.startswith('/users/') and path_parameters.get('userID'):
        user_id = path_parameters.get('userID')
        return get_user_by_id(user_id)
    else:
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({'error': 'Endpoint not found'})
        }

def create_user(body, event):
    """Create a new user in DynamoDB Users table"""
    try:
        # Extract user data from request body
        user_id = body.get('userID')
        email = body.get('email')
        username = body.get('username')
        real_name = body.get('realName', '')
        phone = body.get('phone', '')
        created_at = body.get('createdAt', datetime.utcnow().isoformat())
        
        if not user_id or not email:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({'error': 'userID and email are required'})
            }
        
        # Create user item
        user_item = {
            'userID': user_id,
            'email': email,
            'username': username or email,
            'realName': real_name,
            'phone': phone,
            'createdAt': created_at,
            'updatedAt': created_at,
        }
        
        # Put item in DynamoDB
        users_table.put_item(Item=user_item)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({
                'success': True,
                'message': 'User created successfully',
                'user': user_item
            })
        }
        
    except ClientError as e:
        print(f'DynamoDB error: {e}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }
    except Exception as e:
        print(f'Error creating user: {e}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({'error': f'Internal server error: {str(e)}'})
        }

def get_user_by_email(email):
    """Get user from DynamoDB by email (using EmailIndex GSI)"""
    try:
        if not email:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({'error': 'Email parameter is required'})
            }
        
        # Query by email using GSI (assuming you have an EmailIndex)
        response = users_table.query(
            IndexName='EmailIndex',  # Your GSI name
            KeyConditionExpression='email = :email',
            ExpressionAttributeValues={
                ':email': email
            }
        )
        
        if response['Items']:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({
                    'success': True,
                    'user': response['Items'][0]
                })
            }
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({'error': 'User not found'})
            }
            
    except ClientError as e:
        print(f'DynamoDB error: {e}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }

def get_user_by_id(user_id):
    """Get user from DynamoDB by userID (primary key)"""
    try:
        if not user_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({'error': 'userID is required'})
            }
        
        # Get item by primary key
        response = users_table.get_item(
            Key={'userID': user_id}
        )
        
        if 'Item' in response:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({
                    'success': True,
                    'user': response['Item']
                })
            }
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({'error': 'User not found'})
            }
            
    except ClientError as e:
        print(f'DynamoDB error: {e}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({'error': f'Database error: {str(e)}'})
        }
```

## API Gateway Setup

1. **Go to AWS Console > API Gateway**
2. **Select your API** (the one with base URL `sj2osq50u1.execute-api.us-east-1.amazonaws.com`)
3. **Add the following routes:**

### Route 1: POST /users/create
- Method: POST
- Resource: `/users/create`
- Integration: Lambda Function
- Select your Lambda function

### Route 2: GET /users/getByEmail
- Method: GET
- Resource: `/users/getByEmail`
- Integration: Lambda Function
- Query String Parameters: `email`

### Route 3: GET /users/{userID}
- Method: GET
- Resource: `/users/{userID}`
- Integration: Lambda Function
- Path Parameters: `userID`

## DynamoDB Table Requirements

Your `Users` table should have:
- **Primary Key**: `userID` (String)
- **Global Secondary Index (GSI)**: `EmailIndex`
  - Partition Key: `email` (String)
  - This allows querying by email

## IAM Permissions

Your Lambda function needs these IAM permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:YOUR_ACCOUNT_ID:table/Users",
        "arn:aws:dynamodb:us-east-1:YOUR_ACCOUNT_ID:table/Users/index/EmailIndex"
      ]
    }
  ]
}
```

## Testing

After deploying, test the endpoints:

1. **Create User:**
   ```bash
   curl -X POST https://sj2osq50u1.execute-api.us-east-1.amazonaws.com/demo/users/create \
     -H "Content-Type: application/json" \
     -d '{
       "userID": "test-user-123",
       "email": "test@example.com",
       "username": "testuser",
       "realName": "Test User",
       "phone": "+1234567890"
     }'
   ```

2. **Get User by Email:**
   ```bash
   curl "https://sj2osq50u1.execute-api.us-east-1.amazonaws.com/demo/users/getByEmail?email=test@example.com"
   ```

3. **Get User by ID:**
   ```bash
   curl "https://sj2osq50u1.execute-api.us-east-1.amazonaws.com/demo/users/test-user-123"
   ```

## Notes

- Make sure CORS is enabled in API Gateway for these endpoints
- The Lambda function assumes your table is named `Users` - adjust if different
- The GSI `EmailIndex` is required for email lookups - create it if it doesn't exist
- Replace `YOUR_ACCOUNT_ID` in IAM permissions with your actual AWS account ID

