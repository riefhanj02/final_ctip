# AWS Integration Guide

This guide explains how your Expo app is integrated with your AWS infrastructure.

## Architecture Overview

Your app uses a hybrid authentication and data storage approach:

1. **AWS Cognito** - Handles user authentication (email/password)
2. **DynamoDB** - Stores user profiles and plant records
3. **S3** - Stores plant images
4. **Lambda + API Gateway** - Backend API endpoints
5. **SageMaker** - AI model for plant identification (in progress)

## Configuration Files

### 1. AWS Cognito Configuration
**File:** `src/config/aws-config.js`

Update with your Cognito credentials:
- User Pool ID
- App Client ID
- AWS Region

### 2. API Gateway Configuration
**File:** `src/config/api-config.js`

Update with your API Gateway endpoint URL:
- BASE_URL: Your API Gateway invoke URL (e.g., `https://abc123.execute-api.us-east-1.amazonaws.com/prod`)

## Authentication Flow

### Registration
1. User registers in **AWS Cognito** (handles email/password)
2. After successful Cognito registration, user profile is created in **DynamoDB Users table**
3. User receives email verification code
4. After verification, user can log in

### Login
1. User authenticates with **AWS Cognito** (email/password)
2. If successful, app fetches user profile from **DynamoDB** (using EmailIndex or userID)
3. Combined user data (Cognito + DynamoDB) is returned to the app

## Plant Identification Flow

### Upload & Identify
1. User selects/captures image
2. App requests **presigned URL** from Lambda (`/presign` endpoint)
3. Image is uploaded directly to **S3** using presigned URL
4. App calls **identify endpoint** (`/plants/identify`) with imageKey
5. Lambda:
   - Retrieves image from S3
   - Calls **SageMaker** endpoint for AI prediction (or uses mock if disabled)
   - Stores result in **DynamoDB PlantRecords table**
   - Returns species, confidence, and image URL
6. App displays identification results

### History
- App calls `/plants/history?userID=...` endpoint
- Lambda queries **DynamoDB PlantRecords** using UserIndex
- Returns list of user's plant identifications

### Feedback
- User can submit feedback on identifications
- App calls `/plants/feedback` endpoint
- Lambda updates **DynamoDB PlantRecords** with feedback data

## DynamoDB Tables

### Users Table
- **Partition Key:** `userID` (Cognito user ID)
- **Index:** `EmailIndex` (for lookup by email)
- **Fields:** userID, email, username, realName, phone, createdAt, etc.

### PlantRecords Table
- **Partition Key:** `plantID`
- **Indexes:**
  - `UserIndex` - Query by userID
  - `LocationIndex` - Query by location
  - `StatusIndex` - Query by status
  - `RetainQueueIndex` - For retraining queue
- **Fields:** plantID, userID, imageS3Path, species, confidence, timestamp, location, etc.

## Required Lambda Endpoints

Your Lambda function should handle these endpoints:

### Existing (from your code):
- `POST /presign` - Get presigned S3 URL
- `POST /plants/identify` - Identify plant from image
- `GET /plants/history` - Get user's plant history
- `POST /plants/feedback` - Submit feedback on identification
- `GET /debug/s3` - Debug S3 connection

### Additional (for user management):
You may want to add these endpoints to your Lambda:

- `POST /users/create` - Create user in DynamoDB (called after Cognito registration)
- `GET /users/getByEmail?email=...` - Get user by email (using EmailIndex)
- `GET /users/{userID}` - Get user by userID

## Environment Variables

Your Lambda function uses these environment variables:
- `REGION` - AWS region (default: us-east-1)
- `S3_BUCKET` - S3 bucket name (default: smartplant-raw-uploads)
- `MODEL_BUCKET` - Model bucket (default: smartplant-models)
- `TABLE_PLANTS` - PlantRecords table name (default: PlantRecords)
- `TABLE_USERS` - Users table name (default: Users)
- `SM_ENDPOINT` - SageMaker endpoint name
- `USE_SAGEMAKER` - Enable/disable SageMaker (default: false)

## Setup Steps

1. **Configure Cognito:**
   - Update `src/config/aws-config.js` with your User Pool ID, App Client ID, and Region

2. **Configure API Gateway:**
   - Update `src/config/api-config.js` with your API Gateway invoke URL

3. **Test Authentication:**
   - Register a new user
   - Verify email
   - Log in

4. **Test Plant Identification:**
   - Log in
   - Go to Scan/Upload screen
   - Select/capture an image
   - Upload and identify

## Troubleshooting

### Authentication Issues
- Check Cognito configuration in `aws-config.js`
- Verify User Pool and App Client are correctly configured
- Check console logs for specific error messages

### API Issues
- Verify API Gateway URL in `api-config.js`
- Check API Gateway CORS settings
- Verify Lambda function has correct IAM permissions
- Check CloudWatch logs for Lambda errors

### DynamoDB Issues
- Verify table names match your actual DynamoDB tables
- Check IAM permissions for Lambda to access DynamoDB
- Verify index names match (EmailIndex, UserIndex, etc.)

### S3 Issues
- Verify bucket names match
- Check IAM permissions for presigned URL generation
- Verify CORS settings on S3 bucket

## Next Steps

1. Add user management endpoints to Lambda (if not already present)
2. Implement feedback functionality in the app UI
3. Add location-based features using LocationIndex
4. Enable SageMaker when model is ready (set `USE_SAGEMAKER=true`)
5. Add retraining queue processing using RetainQueueIndex

