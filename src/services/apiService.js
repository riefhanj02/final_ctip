// API Service for interacting with Lambda/API Gateway endpoints
import { API_CONFIG } from '../config/api-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEYS = {
  ID_TOKEN: '@smartplant:idToken',
  ACCESS_TOKEN: '@smartplant:accessToken',
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
 * Make API request to Lambda endpoint
 */
const apiRequest = async (endpoint, method = 'GET', body = null, queryParams = {}) => {
  const baseUrl = API_CONFIG.BASE_URL;

  if (!baseUrl || baseUrl === 'YOUR_API_GATEWAY_URL') {
    throw new Error('API Gateway URL not configured. Please set API_CONFIG.BASE_URL in src/config/api-config.js');
  }

  // Build URL with query parameters
  const url = new URL(`${baseUrl}${endpoint}`);
  Object.keys(queryParams).forEach(key => {
    if (queryParams[key] !== null && queryParams[key] !== undefined) {
      url.searchParams.append(key, queryParams[key]);
    }
  });

  const headers = await getAuthHeaders();

  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(url.toString(), options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API request failed with status ${response.status}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error(`API request error (${endpoint}):`, error);
    return {
      success: false,
      error: error.message || 'API request failed',
    };
  }
};

/**
 * Get presigned URL for S3 upload
 * @param {string} userID - Cognito user ID
 * @param {string} mimeType - Image MIME type (default: image/jpeg)
 * @param {number} expiresInSec - URL expiration in seconds (default: 300)
 * @returns {Promise<object>} { uploadUrl, imageKey, plantID }
 */
export const getPresignedUrl = async (userID, mimeType = 'image/jpeg', expiresInSec = 300) => {
  return await apiRequest(API_CONFIG.ENDPOINTS.PRESIGN, 'POST', {
    userID,
    mimeType,
    expiresInSec,
  });
};

/**
 * Identify plant from image
 * @param {object} params - { userID, imageKey (or image as base64), location: { lat, lng } }
 * @returns {Promise<object>} { plantID, species, confidence, imageUrl }
 */
export const identifyPlant = async ({ userID, imageKey, image, location }) => {
  const body = {
    userID,
    ...(imageKey && { imageKey }),
    ...(image && { image }), // base64 encoded image
    ...(location && { location }),
  };

  return await apiRequest(API_CONFIG.ENDPOINTS.IDENTIFY, 'POST', body);
};

/**
 * Get plant identification history for a user
 * @param {string} userID - Cognito user ID
 * @returns {Promise<object>} { items: [...] }
 */
export const getPlantHistory = async (userID) => {
  return await apiRequest(API_CONFIG.ENDPOINTS.HISTORY, 'GET', null, { userID });
};

/**
 * Submit feedback for a plant identification
 * @param {object} params - { plantID, userID, correct (boolean), imageKey, correctLabel (optional) }
 * @returns {Promise<object>} { success, plantID, status, curatedKey }
 */
export const submitFeedback = async ({ plantID, userID, correct, imageKey, correctLabel }) => {
  return await apiRequest(API_CONFIG.ENDPOINTS.FEEDBACK, 'POST', {
    plantID,
    userID,
    correct,
    imageKey,
    ...(correctLabel && { correctLabel }),
  });
};

/**
 * Debug S3 connection
 * @returns {Promise<object>} Debug information
 */
export const debugS3 = async () => {
  return await apiRequest(API_CONFIG.ENDPOINTS.DEBUG, 'GET');
};

/**
 * Get sightings for the map
 * @param {object} params - { lat, lng, radius, filter }
 * @returns {Promise<object>} { success, data: [...] }
 */
export const getSightings = async ({ lat, lng, radius = 50, filter = 'All' } = {}) => {
  const queryParams = {
    ...(lat && { lat }),
    ...(lng && { lng }),
    radius,
    filter,
  };

  // Note: You need to add '/sightings' to API_CONFIG.ENDPOINTS if not present,
  // or just use the string literal here if it's a new endpoint.
  // Assuming standard REST pattern:
  return await apiRequest('/sightings', 'GET', null, queryParams);
};

