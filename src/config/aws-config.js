// AWS Cognito Configuration
// Replace these values with your actual AWS Cognito details

export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_FYjpIo9VS',
      userPoolClientId: '55f996relcqhob768bpvv7f6dn',
      region: 'us-east-1',
      // Optional: If your app client has a secret, uncomment and add it:
      // userPoolClientSecret: 'YOUR_APP_CLIENT_SECRET',
      // Note: Make sure USER_PASSWORD_AUTH is enabled in your App Client settings
    }
  }
};

// Instructions:
// 1. Go to AWS Console > Cognito > User Pools
// 2. Select your User Pool
// 3. Copy the "User pool ID" (format: region_XXXXXXXXX)
// 4. Go to "App integration" tab > "App clients and analytics"
// 5. Copy the "Client ID"
// 6. Note your AWS Region (e.g., us-east-1, ap-southeast-1)
// 7. Replace the values above with your actual credentials

