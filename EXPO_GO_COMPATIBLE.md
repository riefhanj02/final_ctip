# Expo Go Compatible AWS Cognito Integration

## ✅ Implementation Complete

The app has been updated to use **AWS SDK v3** directly instead of AWS Amplify, making it fully compatible with **Expo Go**. You can now test authentication without needing to build a development client.

## What Changed

### 1. Authentication Service (`src/services/authService.js`)
- ✅ Replaced AWS Amplify with AWS SDK v3 (`@aws-sdk/client-cognito-identity-provider`)
- ✅ Uses `AsyncStorage` for token management (works in Expo Go)
- ✅ All authentication functions work: `registerUser`, `loginUser`, `confirmRegistration`, `logoutUser`
- ✅ Added `resendConfirmationCode` function

### 2. API Services
- ✅ Updated `apiService.js` to use `AsyncStorage` for tokens
- ✅ Updated `dynamoService.js` to use `AsyncStorage` for tokens

### 3. Dependencies
- ✅ Removed `aws-amplify` and `@aws-amplify/react-native` (not needed)
- ✅ Added `@aws-sdk/client-cognito-identity-provider` (pure JavaScript, works in Expo Go)
- ✅ Using existing `@react-native-async-storage/async-storage` for token storage

### 4. Registration Screen
- ✅ Added "Resend Code" button in verification modal

## How to Test

1. **Start the app in Expo Go:**
   ```bash
   npm start
   # Then scan QR code with Expo Go app
   ```

2. **Test Registration:**
   - Go to Register screen
   - Fill in email, password, and other details
   - Submit registration
   - Check email for verification code
   - Enter code in the modal
   - Use "Resend Code" if needed

3. **Test Login:**
   - Go to Login screen
   - Enter email and password
   - Should successfully authenticate

## Features

- ✅ **User Registration** with email verification
- ✅ **Email Verification** with resend code option
- ✅ **User Login** with Cognito authentication
- ✅ **Token Management** using AsyncStorage
- ✅ **DynamoDB Integration** for user profiles (optional, non-blocking)
- ✅ **Error Handling** with user-friendly messages
- ✅ **Phone Number Formatting** (E.164 format)

## Configuration

Make sure your AWS Cognito User Pool has:
- ✅ `USER_PASSWORD_AUTH` enabled in App Client settings
- ✅ Email verification enabled
- ✅ User pool ID and client ID configured in `src/config/aws-config.js`

## Notes

- The app will work in **Expo Go** without any native builds
- Tokens are stored securely in AsyncStorage
- DynamoDB user profile fetching is optional and won't block login if it fails
- All authentication operations use AWS SDK v3 which is pure JavaScript

## Troubleshooting

If you encounter issues:

1. **Check Cognito Configuration:**
   - Verify `USER_PASSWORD_AUTH` is enabled
   - Check user pool ID and client ID are correct

2. **Check Email Verification:**
   - Make sure email verification is enabled in Cognito
   - Check spam folder for verification codes

3. **Check Network:**
   - Ensure device has internet connection
   - Check AWS region is correct (`us-east-1`)

4. **Check Console Logs:**
   - Look for detailed error messages in the console
   - All authentication operations log detailed information

