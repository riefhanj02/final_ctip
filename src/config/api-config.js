// API Gateway Configuration
// Replace with your actual API Gateway endpoint URL

export const API_CONFIG = {

    BASE_URL: process.env.API_GATEWAY_URL || 'https://sj2osq50u1.execute-api.us-east-1.amazonaws.com/demo',

    // API endpoints (will be appended to BASE_URL)
    ENDPOINTS: {
        PRESIGN: '/presign',  // Updated to match your API Gateway structure
        IDENTIFY: '/plants/identify',
        HISTORY: '/plants/history',
        FEEDBACK: '/plants/feedback',
        DEBUG: '/debug/s3',
        SIGHTINGS: '/Sightings',
    },
};

// Instructions:
// 1. Go to AWS Console > API Gateway
// 2. Select your API
// 3. Go to Stages > Select your stage (e.g., prod, dev)
// 4. Copy the "Invoke URL" (e.g., https://abc123.execute-api.us-east-1.amazonaws.com/prod)
// 5. Replace YOUR_API_GATEWAY_URL above with your actual URL

