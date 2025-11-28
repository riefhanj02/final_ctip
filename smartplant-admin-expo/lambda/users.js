// lambda/users.js
// AWS Lambda function for Users API (DynamoDB)

const AWS = require("aws-sdk");
const { success, error, corsOptions } = require("./helpers/cors");

// Initialize DynamoDB client
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || "us-east-1"
});

const USERS_TABLE = process.env.USERS_TABLE || "Users";

/**
 * Get user by ID
 */
async function getUserById(userId) {
  const params = {
    TableName: USERS_TABLE,
    Key: { id: userId }
  };

  try {
    const result = await dynamodb.get(params).promise();
    if (!result.Item) {
      return error("User not found", 404);
    }
    return success({ user: result.Item });
  } catch (err) {
    console.error("Error getting user:", err);
    return error(`Failed to get user: ${err.message}`, 500);
  }
}

/**
 * List all users with optional filtering
 */
async function listUsers(queryParams) {
  const params = {
    TableName: USERS_TABLE
  };

  try {
    const result = await dynamodb.scan(params).promise();
    let users = result.Items || [];

    // Apply filters if provided
    if (queryParams.email) {
      users = users.filter(u => u.email?.includes(queryParams.email));
    }
    if (queryParams.name) {
      users = users.filter(u => 
        u.username?.toLowerCase().includes(queryParams.name.toLowerCase()) ||
        u.real_name?.toLowerCase().includes(queryParams.name.toLowerCase())
      );
    }
    if (queryParams.is_admin !== undefined && queryParams.is_admin !== "") {
      const isAdmin = queryParams.is_admin === "1" || queryParams.is_admin === "true";
      users = users.filter(u => Boolean(u.is_admin) === isAdmin);
    }

    // Pagination
    const page = parseInt(queryParams.page || "1");
    const pageSize = parseInt(queryParams.page_size || "10");
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = users.slice(startIndex, endIndex);

    return success({
      items: paginatedUsers,
      total: users.length,
      page,
      page_size: pageSize
    });
  } catch (err) {
    console.error("Error listing users:", err);
    return error(`Failed to list users: ${err.message}`, 500);
  }
}

/**
 * Get user statistics
 */
async function getUserStats() {
  const params = {
    TableName: USERS_TABLE
  };

  try {
    const result = await dynamodb.scan(params).promise();
    const users = result.Items || [];

    const totalUsers = users.length;
    const adminUsers = users.filter(u => Boolean(u.is_admin)).length;
    const regularUsers = totalUsers - adminUsers;

    return success({
      total_users: totalUsers,
      admin_users: adminUsers,
      regular_users: regularUsers
    });
  } catch (err) {
    console.error("Error getting stats:", err);
    return error(`Failed to get stats: ${err.message}`, 500);
  }
}

/**
 * Create new user
 */
async function createUser(body) {
  if (!body || !body.email || !body.username) {
    return error("Missing required fields: email, username", 400);
  }

  const userId = body.id || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const user = {
    id: userId,
    email: body.email,
    username: body.username,
    real_name: body.real_name || "",
    phone_number: body.phone_number || "",
    is_admin: Boolean(body.is_admin) || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const params = {
    TableName: USERS_TABLE,
    Item: user,
    ConditionExpression: "attribute_not_exists(id)" // Prevent duplicates
  };

  try {
    await dynamodb.put(params).promise();
    return success({ user }, 201);
  } catch (err) {
    if (err.code === "ConditionalCheckFailedException") {
      return error("User already exists", 409);
    }
    console.error("Error creating user:", err);
    return error(`Failed to create user: ${err.message}`, 500);
  }
}

/**
 * Update user
 */
async function updateUser(userId, body) {
  if (!body) {
    return error("Missing request body", 400);
  }

  // Build update expression
  const updateExpressions = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  const allowedFields = ["username", "email", "real_name", "phone_number", "is_admin"];
  
  allowedFields.forEach(field => {
    if (body[field] !== undefined) {
      updateExpressions.push(`#${field} = :${field}`);
      expressionAttributeNames[`#${field}`] = field;
      if (field === "is_admin") {
        expressionAttributeValues[`:${field}`] = Boolean(body[field]);
      } else {
        expressionAttributeValues[`:${field}`] = body[field];
      }
    }
  });

  if (updateExpressions.length === 0) {
    return error("No valid fields to update", 400);
  }

  updateExpressions.push("#updated_at = :updated_at");
  expressionAttributeNames["#updated_at"] = "updated_at";
  expressionAttributeValues[":updated_at"] = new Date().toISOString();

  const params = {
    TableName: USERS_TABLE,
    Key: { id: userId },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamodb.update(params).promise();
    return success({ user: result.Attributes });
  } catch (err) {
    if (err.code === "ResourceNotFoundException") {
      return error("User not found", 404);
    }
    console.error("Error updating user:", err);
    return error(`Failed to update user: ${err.message}`, 500);
  }
}

/**
 * Delete user
 */
async function deleteUser(userId) {
  const params = {
    TableName: USERS_TABLE,
    Key: { id: userId }
  };

  try {
    await dynamodb.delete(params).promise();
    return success({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return error(`Failed to delete user: ${err.message}`, 500);
  }
}

/**
 * Main handler for Users API
 */
exports.handler = async (event) => {
  console.log("Users Lambda Event:", JSON.stringify(event, null, 2));

  // Handle OPTIONS preflight
  if (event.httpMethod === "OPTIONS") {
    return corsOptions();
  }

  const method = event.httpMethod;
  const path = event.path;
  const pathParameters = event.pathParameters || {};
  const queryStringParameters = event.queryStringParameters || {};
  
  let body;
  try {
    body = event.body ? JSON.parse(event.body) : null;
  } catch (err) {
    return error("Invalid JSON in request body", 400);
  }

  // Route handling
  try {
    // GET /users/{id}
    if (method === "GET" && pathParameters.id) {
      return await getUserById(pathParameters.id);
    }

    // GET /users?mode=stats
    if (method === "GET" && queryStringParameters.mode === "stats") {
      return await getUserStats();
    }

    // GET /users (list all)
    if (method === "GET") {
      return await listUsers(queryStringParameters);
    }

    // POST /users
    if (method === "POST") {
      return await createUser(body);
    }

    // PUT /users/{id}
    if (method === "PUT" && pathParameters.id) {
      return await updateUser(pathParameters.id, body);
    }

    // DELETE /users/{id}
    if (method === "DELETE" && pathParameters.id) {
      return await deleteUser(pathParameters.id);
    }

    return error("Method not allowed", 405);
  } catch (err) {
    console.error("Unexpected error:", err);
    return error(`Internal server error: ${err.message}`, 500);
  }
};

