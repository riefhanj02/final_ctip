// Admin Dashboard Configuration
export const config = {
  // AWS Cognito Configuration
  cognito: {
    userPoolId: 'us-east-1_FYjpIo9VS',
    userPoolClientId: '55f996relcqhob768bpvv7f6dn',
    region: 'us-east-1',
  },
  
  // API Gateway Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'https://sj2osq50u1.execute-api.us-east-1.amazonaws.com/demo',
  },
  
  // Admin role check (you can customize this based on your Cognito groups)
  adminGroup: 'admin', // Cognito group name for admins
};

