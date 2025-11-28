// lambda/router.js
// Main router Lambda function (optional - can use API Gateway routing instead)
// This is useful if you want a single Lambda function to handle all routes

const usersHandler = require("./users");
const plantsHandler = require("./plants");
const { error } = require("./helpers/cors");

/**
 * Route requests to appropriate handler based on path
 */
exports.handler = async (event) => {
  console.log("Router Lambda Event:", JSON.stringify(event, null, 2));

  const path = event.path || "";
  const resource = event.resource || "";

  // Route to Users handler
  if (path.startsWith("/users") || resource.includes("/users")) {
    // Modify event path to match users handler expectations
    const modifiedEvent = {
      ...event,
      path: path.replace("/users", "") || "/"
    };
    return await usersHandler.handler(modifiedEvent);
  }

  // Route to Plants handler
  if (path.startsWith("/plants") || resource.includes("/plants")) {
    // Modify event path to match plants handler expectations
    const modifiedEvent = {
      ...event,
      path: path.replace("/plants", "") || "/"
    };
    return await plantsHandler.handler(modifiedEvent);
  }

  // Unknown route
  return error("Route not found", 404);
};

