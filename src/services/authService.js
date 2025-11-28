// AWS Cognito Authentication Service using AWS SDK v3 (Expo Go compatible)
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  GetUserCommand,
  GlobalSignOutCommand,
  ResendConfirmationCodeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { awsConfig } from '../config/aws-config';
import { createUserInDynamoDB, getUserByEmail, getUserByID } from './dynamoService';

// Create Cognito client
const cognitoClient = new CognitoIdentityProviderClient({
  region: awsConfig.Auth.Cognito.region,
});

const CLIENT_ID = awsConfig.Auth.Cognito.userPoolClientId;

// Token storage keys
const TOKEN_KEYS = {
  ACCESS_TOKEN: '@smartplant:accessToken',
  ID_TOKEN: '@smartplant:idToken',
  REFRESH_TOKEN: '@smartplant:refreshToken',
  USER_EMAIL: '@smartplant:userEmail',
  USER_DATA: '@smartplant:userData',
};

/**
 * Format phone number to E.164 format (required by Cognito)
 * @param {string} phone - Phone number
 * @returns {string|null} Formatted phone number or null if invalid
 */
const formatPhoneNumber = (phone) => {
  if (!phone) return null;

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If it already starts with +, return as is (assuming it's already formatted)
  if (phone.startsWith('+')) {
    return phone;
  }

  // If it's a valid length (10-15 digits), add + prefix
  // For US numbers (10 digits), add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  // For other lengths, try to add + if it looks valid
  if (digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`;
  }

  // Invalid format
  return null;
};

/**
 * Store authentication tokens
 */
const storeTokens = async (authResult) => {
  try {
    if (authResult.AccessToken) {
      await AsyncStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, authResult.AccessToken);
    }
    if (authResult.IdToken) {
      await AsyncStorage.setItem(TOKEN_KEYS.ID_TOKEN, authResult.IdToken);
    }
    if (authResult.RefreshToken) {
      await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, authResult.RefreshToken);
    }
  } catch (error) {
    console.error('Error storing tokens:', error);
  }
};

/**
 * Get stored tokens
 */
const getStoredTokens = async () => {
  try {
    const [accessToken, idToken, refreshToken, email] = await Promise.all([
      AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN),
      AsyncStorage.getItem(TOKEN_KEYS.ID_TOKEN),
      AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN),
      AsyncStorage.getItem(TOKEN_KEYS.USER_EMAIL),
    ]);

    return { accessToken, idToken, refreshToken, email };
  } catch (error) {
    console.error('Error getting stored tokens:', error);
    return { accessToken: null, idToken: null, refreshToken: null, email: null };
  }
};

/**
 * Clear stored tokens and user data
 */
const clearTokens = async () => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN),
      AsyncStorage.removeItem(TOKEN_KEYS.ID_TOKEN),
      AsyncStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN),
      AsyncStorage.removeItem(TOKEN_KEYS.USER_EMAIL),
      AsyncStorage.removeItem(TOKEN_KEYS.USER_DATA),
    ]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

/**
 * Store user data
 */
export const storeUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

/**
 * Get stored user data
 */
export const getStoredUserData = async () => {
  try {
    const userDataString = await AsyncStorage.getItem(TOKEN_KEYS.USER_DATA);
    if (userDataString) {
      return JSON.parse(userDataString);
    }
    return null;
  } catch (error) {
    console.error('Error getting stored user data:', error);
    return null;
  }
};

/**
 * Decode JWT token (simple base64 decode, no verification)
 */
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {object} attributes - Additional user attributes (username, phone, etc.)
 * @returns {Promise<object>} Sign up result
 */
export const registerUser = async (email, password, attributes = {}) => {
  try {
    console.log('[registerUser] Starting registration for:', email);

    // Prepare user attributes
    const userAttributes = [
      { Name: 'email', Value: email },
    ];

    if (attributes.name) {
      userAttributes.push({ Name: 'name', Value: attributes.name });
    }

    if (attributes.preferred_username) {
      userAttributes.push({ Name: 'preferred_username', Value: attributes.preferred_username });
    }

    // Format and add phone number only if valid
    if (attributes.phone_number) {
      const formattedPhone = formatPhoneNumber(attributes.phone_number);
      if (formattedPhone) {
        userAttributes.push({ Name: 'phone_number', Value: formattedPhone });
      }
    }

    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email.trim(),
      Password: password,
      UserAttributes: userAttributes,
    });

    const response = await cognitoClient.send(command);
    console.log('[registerUser] SignUp response:', response);

    // Step 2: Create user in DynamoDB (optional - will fail gracefully if API not configured)
    try {
      await createUserInDynamoDB({
        userID: response.UserSub || email,
        email: email,
        username: attributes.preferred_username || email,
        realName: attributes.name || '',
        phone: attributes.phone_number || '',
      });
    } catch (dbError) {
      console.warn('Failed to create user in DynamoDB (non-critical):', dbError);
      // Continue - user is registered in Cognito, DynamoDB can be synced later
    }

    return {
      success: true,
      userId: response.UserSub,
      userConfirmed: response.UserConfirmed,
      message: 'User registered successfully. Please check your email for verification code.',
    };
  } catch (error) {
    console.error('[registerUser] Registration error:', error);

    // Provide more specific error messages
    let errorMessage = error.message || 'Registration failed';
    const errorName = error.name || '';

    if (errorName === 'InvalidParameterException') {
      if (error.message?.includes('phone')) {
        errorMessage = 'Invalid phone number format. Please use format: +1234567890';
      } else {
        errorMessage = 'Invalid registration data. Please check all fields.';
      }
    } else if (errorName === 'UsernameExistsException') {
      errorMessage = 'An account with this email already exists.';
    } else if (errorName === 'InvalidPasswordException') {
      errorMessage = 'Password does not meet requirements.';
    }

    return {
      success: false,
      error: errorMessage,
      code: errorName,
    };
  }
};

/**
 * Confirm user sign up with verification code
 * @param {string} email - User email
 * @param {string} confirmationCode - Verification code from email
 * @returns {Promise<object>} Confirmation result
 */
export const confirmRegistration = async (email, confirmationCode) => {
  try {
    console.log('[confirmRegistration] Confirming user:', email);

    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: email.trim(),
      ConfirmationCode: confirmationCode.trim(),
    });

    const response = await cognitoClient.send(command);
    console.log('[confirmRegistration] ConfirmSignUp response:', response);

    return {
      success: true,
      message: 'Email verified successfully. You can now log in.',
    };
  } catch (error) {
    console.error('[confirmRegistration] Confirmation error:', error);

    let errorMessage = error.message || 'Verification failed';
    if (error.name === 'CodeMismatchException') {
      errorMessage = 'Invalid verification code. Please check and try again.';
    } else if (error.name === 'ExpiredCodeException') {
      errorMessage = 'Verification code has expired. Please request a new one.';
    }

    return {
      success: false,
      error: errorMessage,
      code: error.name,
    };
  }
};

/**
 * Sign in user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} Sign in result with user data
 */
export const loginUser = async (email, password) => {
  try {
    console.log('[loginUser] Starting login for:', email);

    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email.trim(),
        PASSWORD: password,
      },
    });

    const response = await cognitoClient.send(command);
    console.log('[loginUser] InitiateAuth response received');

    if (response.AuthenticationResult) {
      // Store tokens
      await storeTokens(response.AuthenticationResult);
      await AsyncStorage.setItem(TOKEN_KEYS.USER_EMAIL, email.trim());

      // Decode ID token to get user info
      const idToken = response.AuthenticationResult.IdToken;
      const decodedToken = decodeToken(idToken);
      const userId = decodedToken?.sub || email;

      console.log('[loginUser] User authenticated, fetching user details...');

      // Get user details from Cognito
      let cognitoUserInfo = null;
      try {
        const getUserCommand = new GetUserCommand({
          AccessToken: response.AuthenticationResult.AccessToken,
        });
        const userResponse = await cognitoClient.send(getUserCommand);
        cognitoUserInfo = userResponse;
        console.log('[loginUser] User details retrieved from Cognito');
      } catch (userError) {
        console.warn('[loginUser] Could not fetch user details:', userError);
      }

      // Try to fetch user profile from DynamoDB (non-blocking)
      let dynamoUser = null;
      try {
        console.log('[loginUser] Attempting to fetch user from DynamoDB...');
        // First try by email (using EmailIndex)
        const emailResult = await getUserByEmail(email.trim());
        if (emailResult.success && emailResult.user) {
          dynamoUser = emailResult.user;
          console.log('[loginUser] Found user in DynamoDB by email');
        } else {
          // Fallback: try by userID
          const idResult = await getUserByID(userId);
          if (idResult.success && idResult.user) {
            dynamoUser = idResult.user;
            console.log('[loginUser] Found user in DynamoDB by userID');
          } else {
            console.log('[loginUser] User not found in DynamoDB (this is okay)');
          }
        }
      } catch (dbError) {
        console.warn('[loginUser] Failed to fetch user from DynamoDB (non-critical):', dbError);
      }

      // Extract user attributes from Cognito response
      const userAttributes = {};
      if (cognitoUserInfo?.UserAttributes) {
        cognitoUserInfo.UserAttributes.forEach((attr) => {
          userAttributes[attr.Name] = attr.Value;
        });
      }

      // Combine Cognito and DynamoDB user data
      // First, build a base object from Cognito attributes
      const baseUser = {
        email: userAttributes.email || email,
        username: userAttributes.preferred_username || userAttributes['cognito:username'] || email,
        userId: userId,
        id: userId, // For backward compatibility
        cognitoUserId: userId,
        realName: userAttributes.name || userAttributes.given_name || '',
        name: userAttributes.name || userAttributes.given_name || '', // expose 'name' too for UI
        phone: userAttributes.phone_number || '',
      };

      // If DynamoDB data is available, merge it on top (it may include additional fields)
      const mergedFromDynamo = dynamoUser
        ? {
            id: dynamoUser.userID || dynamoUser.id || baseUser.id,
            // prefer Dynamo values if present; otherwise fall back to base
            realName: dynamoUser.realName || dynamoUser.real_name || dynamoUser.name || baseUser.realName,
            name: dynamoUser.name || dynamoUser.realName || dynamoUser.real_name || baseUser.name,
            phone: dynamoUser.phone || dynamoUser.phone_number || baseUser.phone,
            ...dynamoUser,
          }
        : {};

      const userData = { ...baseUser, ...mergedFromDynamo };

      // Store user data for persistent login
      await storeUserData(userData);

      console.log('[loginUser] Login successful, returning user data');
      return {
        success: true,
        user: userData,
        message: 'Login successful',
      };
    } else if (response.ChallengeName) {
      // Handle challenges (MFA, new password required, etc.)
      console.log('[loginUser] Challenge required:', response.ChallengeName);
      return {
        success: false,
        challengeName: response.ChallengeName,
        challengeParameters: response.ChallengeParameters,
        error: `Additional authentication required: ${response.ChallengeName}`,
      };
    } else {
      console.error('[loginUser] Unexpected response:', response);
      return {
        success: false,
        error: 'Login failed. Unexpected response from authentication service.',
      };
    }
  } catch (error) {
    console.error('[loginUser] Login error:', error);
    console.error('[loginUser] Error name:', error.name);
    console.error('[loginUser] Error message:', error.message);

    // Provide user-friendly error messages
    let errorMessage = 'Login failed. Please check your credentials.';
    const errorName = error.name || '';
    const errorMsg = error.message || '';

    if (errorName === 'UserNotConfirmedException' || errorMsg.includes('not confirmed')) {
      errorMessage = 'Please verify your email address before logging in. Check your email for the verification code.';
    } else if (errorName === 'NotAuthorizedException' || errorMsg.includes('not authorized') || errorMsg.includes('incorrect')) {
      errorMessage = 'Incorrect email or password. Please try again.';
    } else if (errorName === 'UserNotFoundException' || errorMsg.includes('not found')) {
      errorMessage = 'User not found. Please register first.';
    } else if (errorName === 'InvalidParameterException' || errorMsg.includes('invalid')) {
      errorMessage = 'Invalid email or password format.';
    } else if (errorName === 'InvalidPasswordException') {
      errorMessage = 'Password is incorrect.';
    } else if (errorMsg && errorMsg !== 'An unknown error has occurred.') {
      errorMessage = errorMsg;
    }

    return {
      success: false,
      error: errorMessage,
      code: errorName || 'Unknown',
    };
  }
};

/**
 * Sign out current user
 * @returns {Promise<object>} Sign out result
 */
export const logoutUser = async () => {
  try {
    const tokens = await getStoredTokens();

    // If we have an access token, try to sign out from Cognito
    if (tokens.accessToken) {
      try {
        const command = new GlobalSignOutCommand({
          AccessToken: tokens.accessToken,
        });
        await cognitoClient.send(command);
      } catch (signOutError) {
        console.warn('Error signing out from Cognito (non-critical):', signOutError);
        // Continue to clear local tokens anyway
      }
    }

    // Clear stored tokens and user data
    await clearTokens();

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    console.error('Logout error:', error);
    // Still try to clear tokens
    await clearTokens();
    return {
      success: true, // Consider it successful if we cleared local tokens
      message: 'Logged out successfully',
    };
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<object|null>} Current user or null if not authenticated
 */
export const getCurrentAuthenticatedUser = async () => {
  try {
    const tokens = await getStoredTokens();

    if (!tokens.accessToken || !tokens.idToken) {
      return {
        success: false,
        user: null,
      };
    }

    // Decode ID token to get user info
    const decodedToken = decodeToken(tokens.idToken);
    if (!decodedToken) {
      return {
        success: false,
        user: null,
      };
    }

    // Try to get fresh user info from Cognito
    let cognitoUserInfo = null;
    try {
      const command = new GetUserCommand({
        AccessToken: tokens.accessToken,
      });
      const response = await cognitoClient.send(command);
      cognitoUserInfo = response;
    } catch (error) {
      console.warn('Could not fetch user from Cognito, using token data:', error);
    }

    // Extract user attributes
    const userAttributes = {};
    if (cognitoUserInfo?.UserAttributes) {
      cognitoUserInfo.UserAttributes.forEach((attr) => {
        userAttributes[attr.Name] = attr.Value;
      });
    }

    const userId = decodedToken.sub || tokens.email;

    // Try to get DynamoDB user data
    let dynamoUser = null;
    try {
      const emailResult = await getUserByEmail(tokens.email || '');
      if (emailResult.success && emailResult.user) {
        dynamoUser = emailResult.user;
      }
    } catch (dbError) {
      // Ignore DynamoDB errors
    }

    const userData = {
      email: userAttributes.email || decodedToken.email || tokens.email,
      username: userAttributes.preferred_username || decodedToken['cognito:username'] || tokens.email,
      userId: userId,
      id: userId,
      cognitoUserId: userId,
      realName: userAttributes.name || dynamoUser?.realName || '',
      phone: userAttributes.phone_number || dynamoUser?.phone || '',
      ...(dynamoUser && { ...dynamoUser }),
    };

    // Update stored user data
    await storeUserData(userData);

    return {
      success: true,
      user: userData,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return {
      success: false,
      user: null,
    };
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export const isAuthenticated = async () => {
  try {
    const tokens = await getStoredTokens();
    if (!tokens.accessToken || !tokens.idToken) {
      return false;
    }

    // Try to validate token by getting user info
    const command = new GetUserCommand({
      AccessToken: tokens.accessToken,
    });
    await cognitoClient.send(command);
    return true;
  } catch {
    return false;
  }
};

/**
 * Resend confirmation code
 * @param {string} email - User email
 * @returns {Promise<object>} Result
 */
export const resendConfirmationCode = async (email) => {
  try {
    const command = new ResendConfirmationCodeCommand({
      ClientId: CLIENT_ID,
      Username: email.trim(),
    });

    await cognitoClient.send(command);

    return {
      success: true,
      message: 'Verification code sent. Please check your email.',
    };
  } catch (error) {
    console.error('Error resending confirmation code:', error);
    return {
      success: false,
      error: error.message || 'Failed to resend verification code',
    };
  }
};
