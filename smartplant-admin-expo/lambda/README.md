# AWS Lambda Functions for SmartPlant Hybrid Backend

This directory contains AWS Lambda functions for the Users and Plants APIs. These functions interact with DynamoDB and S3.

## Directory Structure

```
lambda/
├── helpers/
│   └── cors.js          # CORS helper utilities
├── users.js             # Users API Lambda function
├── plants.js            # Plants API Lambda function
├── router.js            # Main router (optional - use if single Lambda)
└── README.md            # This file
```

## Environment Variables

Configure these environment variables in your Lambda functions:

- `AWS_REGION`: AWS region (default: "us-east-1")
- `USERS_TABLE`: DynamoDB table name for users (default: "Users")
- `PLANTS_TABLE`: DynamoDB table name for plants (default: "Plants")
- `S3_BUCKET`: S3 bucket name for plant images (default: "smartplant-uploads")

## API Endpoints

### Users API (`users.js`)

- `GET /users` - List all users (supports query params: mode, page, page_size, email, name, is_admin)
- `GET /users?mode=stats` - Get user statistics
- `GET /users/{id}` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Plants API (`plants.js`)

- `GET /plants` - List all plants (supports query params: page, page_size, species, rarity, admin)
- `GET /plants/{id}` - Get plant by ID
- `POST /plants` - Create new plant
- `DELETE /plants/{id}` - Delete plant
- `POST /plants/presign` - Generate S3 presigned URL for image upload
- `GET /plants/heatmap` - Get heatmap data (supports ?admin=1)
- `PUT /plants/{id}/mask` - Mask/unmask plant location

## Deployment Options

### Option 1: Separate Lambda Functions (Recommended)

Deploy `users.js` and `plants.js` as separate Lambda functions and configure API Gateway to route to each:

1. Create Lambda function: `smartplant-users`
   - Handler: `users.handler`
   - Runtime: Node.js 18.x or later
   - Environment variables: Set USERS_TABLE, AWS_REGION

2. Create Lambda function: `smartplant-plants`
   - Handler: `plants.handler`
   - Runtime: Node.js 18.x or later
   - Environment variables: Set PLANTS_TABLE, S3_BUCKET, AWS_REGION

3. Configure API Gateway routes:
   - `/users/*` → `smartplant-users` Lambda
   - `/plants/*` → `smartplant-plants` Lambda

### Option 2: Single Router Lambda

Deploy `router.js` as a single Lambda function that routes to the appropriate handler:

1. Bundle all files together (users.js, plants.js, router.js, helpers/)
2. Create Lambda function: `smartplant-api`
   - Handler: `router.handler`
   - Runtime: Node.js 18.x or later
   - Environment variables: Set all required variables

3. Configure API Gateway:
   - `/*` → `smartplant-api` Lambda

## Dependencies

Install AWS SDK (should be available in Lambda runtime):

```bash
npm install aws-sdk
```

Note: AWS SDK v2 is available by default in Node.js 18.x Lambda runtime.

## CORS Configuration

All Lambda functions include CORS headers via the `helpers/cors.js` module:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS`
- `Access-Control-Allow-Headers: Content-Type,Authorization,X-Requested-With`

OPTIONS preflight requests are automatically handled.

## Testing Locally

You can test Lambda functions locally using AWS SAM or serverless framework:

```bash
# Install dependencies
npm install

# Test users handler
node -e "require('./users').handler({httpMethod:'GET', path:'/users', pathParameters:{}, queryStringParameters:{}}).then(console.log)"

# Test plants handler
node -e "require('./plants').handler({httpMethod:'GET', path:'/plants', pathParameters:{}, queryStringParameters:{}}).then(console.log)"
```

## API Gateway Event Format

These Lambda functions expect API Gateway v1 event format:

```json
{
  "httpMethod": "GET",
  "path": "/users",
  "pathParameters": {},
  "queryStringParameters": {},
  "body": null
}
```

For API Gateway v2 (HTTP API), you may need to add a translation layer or modify the handlers.

## IAM Permissions

Lambda execution role needs the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/Users",
        "arn:aws:dynamodb:*:*:table/Plants"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::smartplant-uploads/*"
    }
  ]
}
```

## Notes

- IoT APIs remain on local PHP backend (`backend/iot.php`)
- Users and Plants APIs are migrated to AWS Lambda + DynamoDB
- Frontend (`src/api.js`) uses hybrid backend configuration

