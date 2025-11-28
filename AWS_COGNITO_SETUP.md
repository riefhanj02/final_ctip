# AWS Cognito Integration Setup Guide

This guide will help you configure your app to use AWS Cognito for authentication.

## Required AWS Information

To integrate AWS Cognito with your app, you need the following information from your AWS Cognito User Pool:

### 1. **User Pool ID**
- **Where to find it**: AWS Console → Cognito → User Pools → Select your pool → General settings
- **Format**: `region_XXXXXXXXX` (e.g., `us-east-1_AbCdEfGhI`)
- **Example**: `us-east-1_123456789`

### 2. **App Client ID**
- **Where to find it**: AWS Console → Cognito → User Pools → Select your pool → App integration tab → App clients and analytics
- **Format**: Alphanumeric string (e.g., `1a2b3c4d5e6f7g8h9i0j`)
- **Example**: `7k8l9m0n1o2p3q4r5s6t`

### 3. **AWS Region**
- **Where to find it**: AWS Console → Cognito → User Pools → Select your pool → General settings
- **Common regions**: 
  - `us-east-1` (N. Virginia)
  - `us-west-2` (Oregon)
  - `eu-west-1` (Ireland)
  - `ap-southeast-1` (Singapore)
  - `ap-southeast-2` (Sydney)
- **Example**: `us-east-1`

### 4. **App Client Secret** (Optional)
- **Where to find it**: Only if your App Client was created with a client secret
- **Note**: Most mobile apps don't use client secrets for security reasons
- **If you have one**: You'll need to add it to the config file

## Configuration Steps

### Step 1: Update the Configuration File

1. Open `src/config/aws-config.js`
2. Replace the placeholder values with your actual AWS Cognito credentials:

```javascript
export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_123456789',        // Your User Pool ID
      userPoolClientId: '7k8l9m0n1o2p3q4r5s6t', // Your App Client ID
      region: 'us-east-1',                       // Your AWS Region
    }
  }
};
```

### Step 2: Verify Your Cognito User Pool Settings

Make sure your Cognito User Pool is configured correctly:

1. **Sign-in options**: Should include "Email" or "Username"
2. **Password policy**: Should match your app's password requirements
3. **Email verification**: Should be enabled (users need to verify email)
4. **App client settings**:
   - Authentication flows: Should include "ALLOW_USER_PASSWORD_AUTH"
   - OAuth 2.0 settings: Not required for basic authentication

### Step 3: Test the Integration

1. Start your app: `npm start` or `expo start`
2. Try registering a new user
3. Check your email for the verification code
4. Verify the email and then try logging in

## Features Implemented

✅ **User Registration**
- Email-based registration
- Password validation
- Email verification required
- Additional user attributes (name, phone, username)

✅ **User Login**
- Email/password authentication
- Error handling with user-friendly messages
- Session management

✅ **Email Verification**
- Modal for entering verification code
- Automatic navigation to login after verification

## Troubleshooting

### Common Issues

1. **"User pool ID not found"**
   - Check that you've correctly copied the User Pool ID
   - Ensure there are no extra spaces

2. **"Invalid client ID"**
   - Verify the App Client ID is correct
   - Check that the App Client is associated with your User Pool

3. **"Region mismatch"**
   - Ensure the region matches where your User Pool was created
   - Check the region in your User Pool settings

4. **"User not confirmed"**
   - Users must verify their email before logging in
   - Check spam folder for verification email

5. **"NotAuthorizedException"**
   - Verify email and password are correct
   - Ensure user has verified their email

### Getting Help

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify your AWS Cognito configuration in the AWS Console
3. Ensure your User Pool allows the authentication flow you're using

## Security Notes

- Never commit your AWS credentials to version control
- Consider using environment variables for production
- The current config file should be added to `.gitignore` if it contains real credentials
- Use IAM roles and policies to restrict access to your Cognito resources

## Next Steps

After successful integration, you may want to:
- Add password reset functionality
- Implement "Remember me" functionality
- Add social login (Google, Facebook, etc.)
- Implement MFA (Multi-Factor Authentication)
- Add session persistence across app restarts

