// utils/api.ts - API helper with Cognito authentication

import { getAccessToken } from "../authStore";

/**
 * Make an authenticated API request to the Users API
 * Automatically includes the Cognito access token in Authorization header
 */
export async function authenticatedRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const USERS_API_BASE = "https://sj2osq50u1.execute-api.us-east-1.amazonaws.com/demo";
  
  const token = getAccessToken();
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  
  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const url = endpoint.startsWith("http") 
    ? endpoint 
    : `${USERS_API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Parse JSON response with error handling
 */
export async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : ({} as T);
  } catch (e) {
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
  }
}

