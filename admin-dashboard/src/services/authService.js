// Admin Authentication Service using AWS Cognito
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  GetUserCommand,
  GlobalSignOutCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { config } from '../config/config';

const cognitoClient = new CognitoIdentityProviderClient({
  region: config.cognito.region,
});

const CLIENT_ID = config.cognito.userPoolClientId;

// Token storage
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'admin_access_token',
  ID_TOKEN: 'admin_id_token',
  REFRESH_TOKEN: 'admin_refresh_token',
  USER_EMAIL: 'admin_user_email',
};

// Store tokens in localStorage
const storeTokens = (authResult) => {
  if (authResult.AccessToken) {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, authResult.AccessToken);
  }
  if (authResult.IdToken) {
    localStorage.setItem(TOKEN_KEYS.ID_TOKEN, authResult.IdToken);
  }
  if (authResult.RefreshToken) {
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, authResult.RefreshToken);
  }
};

// Get stored tokens
const getStoredTokens = () => {
  return {
    accessToken: localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN),
    idToken: localStorage.getItem(TOKEN_KEYS.ID_TOKEN),
    refreshToken: localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN),
    email: localStorage.getItem(TOKEN_KEYS.USER_EMAIL),
  };
};

// Clear tokens
const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.ID_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.USER_EMAIL);
};

// Decode JWT token
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

// Check if user is admin
const checkAdminRole = async (accessToken) => {
  try {
    const command = new GetUserCommand({
      AccessToken: accessToken,
    });
    const response = await cognitoClient.send(command);
    
    // Check if user is in admin group
    const groups = response.UserAttributes?.find(attr => attr.Name === 'cognito:groups')?.Value;
    if (groups) {
      const groupList = groups.split(',');
      return groupList.includes(config.adminGroup);
    }
    
    // Alternative: Check custom attribute
    const isAdmin = response.UserAttributes?.find(attr => attr.Name === 'custom:isAdmin')?.Value === 'true';
    return isAdmin;
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};

// Login
export const login = async (email, password) => {
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email.trim(),
        PASSWORD: password,
      },
    });

    const response = await cognitoClient.send(command);

    if (response.AuthenticationResult) {
      storeTokens(response.AuthenticationResult);
      localStorage.setItem(TOKEN_KEYS.USER_EMAIL, email.trim());

      // Check if user is admin
      const isAdmin = await checkAdminRole(response.AuthenticationResult.AccessToken);
      if (!isAdmin) {
        clearTokens();
        return {
          success: false,
          error: 'Access denied. Admin privileges required.',
        };
      }

      return {
        success: true,
        user: {
          email: email.trim(),
          tokens: response.AuthenticationResult,
        },
      };
    }

    return {
      success: false,
      error: 'Login failed. Unexpected response.',
    };
  } catch (error) {
    console.error('Login error:', error);
    let errorMessage = 'Login failed. Please check your credentials.';
    
    if (error.name === 'NotAuthorizedException') {
      errorMessage = 'Incorrect email or password.';
    } else if (error.name === 'UserNotConfirmedException') {
      errorMessage = 'Please verify your email address.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Logout
export const logout = async () => {
  try {
    const tokens = getStoredTokens();
    if (tokens.accessToken) {
      try {
        const command = new GlobalSignOutCommand({
          AccessToken: tokens.accessToken,
        });
        await cognitoClient.send(command);
      } catch (error) {
        console.warn('Error signing out from Cognito:', error);
      }
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearTokens();
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const tokens = getStoredTokens();
  return !!(tokens.accessToken && tokens.idToken);
};

// Get current user
export const getCurrentUser = () => {
  const tokens = getStoredTokens();
  if (!tokens.idToken) return null;

  const decoded = decodeToken(tokens.idToken);
  return {
    email: tokens.email || decoded?.email,
    userId: decoded?.sub,
    ...decoded,
  };
};

// Get access token for API calls
export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

