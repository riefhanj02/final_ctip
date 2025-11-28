// DynamoDB Service for user management
// This service interacts with your Lambda function to manage users in DynamoDB
import { API_CONFIG } from '../config/api-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEYS = {
  ID_TOKEN: '@smartplant:idToken',
  ACCESS_TOKEN: '@smartplant:accessToken',
};

// Convert DynamoDB AttributeValue map (e.g., { email: { S: 'a@b.com' } })
// into a plain JS object with string/number/boolean values.
const normalizeDynamoItem = (item) => {
  if (!item || typeof item !== 'object') return item;

  const extract = (attr) => {
    if (attr && typeof attr === 'object') {
      if ('S' in attr) return attr.S;
      if ('N' in attr) return attr.N;
      if ('BOOL' in attr) return !!attr.BOOL;
      if ('SS' in attr) return attr.SS;
      if ('NS' in attr) return attr.NS;
      if ('L' in attr) return Array.isArray(attr.L) ? attr.L.map(extract) : attr.L;
      if ('M' in attr) return normalizeDynamoItem(attr.M);
    }
    return attr;
  };

  // If it already looks normalized (e.g., has plain strings), just return it
  if (typeof item.email === 'string' || typeof item.userID === 'string') {
    return item;
  }

  const out = {};
  Object.keys(item).forEach((k) => {
    out[k] = extract(item[k]);
  });
  return out;
};

/**
 * Get authorization headers with Cognito token
 */
const getAuthHeaders = async () => {
  try {
    const idToken = await AsyncStorage.getItem(TOKEN_KEYS.ID_TOKEN);

    return {
      'Content-Type': 'application/json',
      ...(idToken ? { 'Authorization': `Bearer ${idToken}` } : {}),
    };
  } catch (error) {
    console.error('Error getting auth token:', error);
    return {
      'Content-Type': 'application/json',
    };
  }
};

/**
 * Create user in DynamoDB Users table
 * This should be called after successful Cognito registration
 * @param {object} userData - { userID (Cognito userId), email, username, realName, phone }
 * @returns {Promise<object>} Success/error result
 */
export const createUserInDynamoDB = async (userData) => {
  const baseUrl = API_CONFIG.BASE_URL;

  if (!baseUrl || baseUrl === 'YOUR_API_GATEWAY_URL') {
    console.warn('API Gateway URL not configured. Skipping DynamoDB user creation.');
    return { success: false, error: 'API Gateway not configured' };
  }

  // You'll need to add this endpoint to your Lambda function
  // For now, we'll use a generic endpoint pattern
  const endpoint = '/users/create'; // Add this to your Lambda

  const headers = await getAuthHeaders();

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userID: userData.userID,
        email: userData.email,
        username: userData.username,
        // Lambda expects 'name' (we map from realName if present)
        name: userData.name || userData.realName || '',
        phone: userData.phone,
        createdAt: new Date().toISOString(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create user in DynamoDB');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error creating user in DynamoDB:', error);
    return {
      success: false,
      error: error.message || 'Failed to create user in DynamoDB',
    };
  }
};

/**
 * Get user from DynamoDB by email
 * @param {string} email - User email
 * @returns {Promise<object>} User data or null
 */
export const getUserByEmail = async (email) => {
  const baseUrl = API_CONFIG.BASE_URL;

  if (!baseUrl || baseUrl === 'YOUR_API_GATEWAY_URL') {
    return { success: false, error: 'API Gateway not configured' };
  }

  // You'll need to add this endpoint to your Lambda function
  const endpoint = '/users/getByEmail'; // Add this to your Lambda

  const headers = await getAuthHeaders();

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
      // Pass email as query parameter
    });

    const url = new URL(`${baseUrl}${endpoint}`);
    url.searchParams.append('email', email);

    const finalResponse = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    const data = await finalResponse.json();

    if (!finalResponse.ok) {
      if (finalResponse.status === 404) {
        return { success: false, user: null, error: 'User not found' };
      }
      throw new Error(data.error || 'Failed to get user from DynamoDB');
    }

    return { success: true, user: data.user || data };
  } catch (error) {
    console.error('Error getting user from DynamoDB:', error);
    return {
      success: false,
      user: null,
      error: error.message || 'Failed to get user from DynamoDB',
    };
  }
};

/**
 * Get user from DynamoDB by userID
 * @param {string} userID - Cognito user ID
 * @returns {Promise<object>} User data or null
 */
export const getUserByID = async (userID) => {
  const baseUrl = API_CONFIG.BASE_URL;

  if (!baseUrl || baseUrl === 'YOUR_API_GATEWAY_URL') {
    return { success: false, error: 'API Gateway not configured' };
  }

  // You'll need to add this endpoint to your Lambda function
  const endpoint = `/users/${userID}`; // Add this to your Lambda

  const headers = await getAuthHeaders();

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, user: null, error: 'User not found' };
      }
      throw new Error(data.error || 'Failed to get user from DynamoDB');
    }

    return { success: true, user: data.user || data };
  } catch (error) {
    console.error('Error getting user from DynamoDB:', error);
    return {
      success: false,
      user: null,
      error: error.message || 'Failed to get user from DynamoDB',
    };
  }
};

