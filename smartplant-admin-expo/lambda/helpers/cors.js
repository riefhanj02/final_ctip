// lambda/helpers/cors.js
// CORS helper for AWS Lambda responses

/**
 * Standard CORS headers for all Lambda responses
 */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Requested-With"
};

/**
 * Create a CORS-enabled response
 * @param {number} statusCode - HTTP status code
 * @param {object} body - Response body object
 * @returns {object} API Gateway formatted response
 */
function corsResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

/**
 * Handle OPTIONS preflight request
 * @returns {object} API Gateway formatted response
 */
function corsOptions() {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: ""
  };
}

/**
 * Create success response with CORS
 * @param {object} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {object} API Gateway formatted response
 */
function success(data, statusCode = 200) {
  return corsResponse(statusCode, data);
}

/**
 * Create error response with CORS
 * @param {string|object} error - Error message or object
 * @param {number} statusCode - HTTP status code (default: 500)
 * @returns {object} API Gateway formatted response
 */
function error(error, statusCode = 500) {
  const errorMessage = typeof error === "string" ? error : error.message || "Internal Server Error";
  return corsResponse(statusCode, { error: errorMessage });
}

module.exports = {
  corsResponse,
  corsOptions,
  success,
  error,
  CORS_HEADERS
};

