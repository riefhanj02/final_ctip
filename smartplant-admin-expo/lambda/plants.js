// lambda/plants.js
// AWS Lambda function for Plants API (DynamoDB + S3)

const AWS = require("aws-sdk");
const { success, error, corsOptions } = require("./helpers/cors");

// Initialize AWS clients
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || "us-east-1"
});

const s3 = new AWS.S3({
  region: process.env.AWS_REGION || "us-east-1"
});

const PLANTS_TABLE = process.env.PLANTS_TABLE || process.env.TABLE_PLANTS || "PlantRecords";
const S3_BUCKET = process.env.S3_BUCKET || "smartplant-raw-uploads";

/**
 * Get plant by ID
 */
async function getPlantById(plantId) {
  const params = {
    TableName: PLANTS_TABLE,
    Key: { id: plantId }
  };

  try {
    const result = await dynamodb.get(params).promise();
    if (!result.Item) {
      return error("Plant not found", 404);
    }
    return success({ plant: result.Item });
  } catch (err) {
    console.error("Error getting plant:", err);
    return error(`Failed to get plant: ${err.message}`, 500);
  }
}

/**
 * List all plants with optional filtering
 */
async function listPlants(queryParams, isAdmin = false) {
  const params = {
    TableName: PLANTS_TABLE
  };

  try {
    const result = await dynamodb.scan(params).promise();
    let plants = result.Items || [];

    // If not admin, filter out masked plants
    if (!isAdmin) {
      plants = plants.filter(p => !p.is_masked);
    }

    // Apply filters if provided
    if (queryParams.species) {
      plants = plants.filter(p => 
        p.species?.toLowerCase().includes(queryParams.species.toLowerCase())
      );
    }
    if (queryParams.rarity) {
      plants = plants.filter(p => p.rarity === queryParams.rarity);
    }

    // Pagination
    const page = parseInt(queryParams.page || "1");
    const pageSize = parseInt(queryParams.page_size || "50");
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPlants = plants.slice(startIndex, endIndex);

    return success({
      items: paginatedPlants,
      total: plants.length,
      page,
      page_size: pageSize
    });
  } catch (err) {
    console.error("Error listing plants:", err);
    return error(`Failed to list plants: ${err.message}`, 500);
  }
}

/**
 * Create new plant
 */
async function createPlant(body) {
  if (!body || !body.description || !body.latitude || !body.longitude) {
    return error("Missing required fields: description, latitude, longitude", 400);
  }

  const plantId = body.id || `plant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Generate S3 image URL if image_key is provided
  let imageUrl = body.image_url || "";
  if (body.image_key && !imageUrl) {
    imageUrl = `https://${S3_BUCKET}.s3.amazonaws.com/${body.image_key}`;
  }

  const plant = {
    id: plantId,
    description: body.description,
    species: body.species || "Unknown",
    latitude: String(body.latitude),
    longitude: String(body.longitude),
    rarity: body.rarity || "Common",
    image_url: imageUrl,
    image_key: body.image_key || null,
    is_masked: body.rarity === "Rare" || body.rarity === "Endangered" || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const params = {
    TableName: PLANTS_TABLE,
    Item: plant,
    ConditionExpression: "attribute_not_exists(id)" // Prevent duplicates
  };

  try {
    await dynamodb.put(params).promise();
    return success({ plant }, 201);
  } catch (err) {
    if (err.code === "ConditionalCheckFailedException") {
      return error("Plant already exists", 409);
    }
    console.error("Error creating plant:", err);
    return error(`Failed to create plant: ${err.message}`, 500);
  }
}

/**
 * Delete plant
 */
async function deletePlant(plantId) {
  const params = {
    TableName: PLANTS_TABLE,
    Key: { id: plantId }
  };

  try {
    await dynamodb.delete(params).promise();
    return success({ message: "Plant deleted successfully" });
  } catch (err) {
    console.error("Error deleting plant:", err);
    return error(`Failed to delete plant: ${err.message}`, 500);
  }
}

/**
 * Generate S3 presigned URL for image upload
 */
async function generatePresignedUrl(body) {
  if (!body || !body.userID || !body.mimeType) {
    return error("Missing required fields: userID, mimeType", 400);
  }

  const fileExtension = body.mimeType.split("/")[1] || "jpg";
  const key = `plants/${body.userID}/${Date.now()}.${fileExtension}`;

  const params = {
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: body.mimeType,
    Expires: 300 // 5 minutes
  };

  try {
    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
    return success({
      key: key,
      uploadUrl: uploadUrl
    });
  } catch (err) {
    console.error("Error generating presigned URL:", err);
    return error(`Failed to generate presigned URL: ${err.message}`, 500);
  }
}

/**
 * Get heatmap data
 */
async function getHeatmapData(queryParams, isAdmin = false) {
  const params = {
    TableName: PLANTS_TABLE
  };

  try {
    const result = await dynamodb.scan(params).promise();
    let plants = result.Items || [];

    console.log(`[getHeatmapData] Scanned ${plants.length} plants from ${PLANTS_TABLE}`);

    // If not admin, filter out masked plants
    if (!isAdmin) {
      plants = plants.filter(p => !p.is_masked);
    }

    // Convert to heatmap format
    // Handle both DocumentClient format (plain objects) and typed format (S, N, etc.)
    const sightings = plants.map(plant => {
      // Handle typed DynamoDB format (if using low-level client)
      let lat, lng;
      if (plant.latitude && typeof plant.latitude === 'object' && plant.latitude.S) {
        // Typed format: { S: "1.5319" }
        lat = parseFloat(plant.latitude.S) || 0;
        lng = parseFloat(plant.longitude.S) || 0;
      } else {
        // DocumentClient format: plain string/number
        lat = parseFloat(plant.latitude) || 0;
        lng = parseFloat(plant.longitude) || 0;
      }
      
      // Skip invalid coordinates
      if (lat === 0 && lng === 0) {
        return null;
      }
      
      const confidence = plant.is_masked ? 0.3 : 0.8;
      
      return {
        coord: {
          lat: lat,
          lng: lng
        },
        confidence: confidence
      };
    }).filter(s => s !== null); // Remove invalid points

    console.log(`[getHeatmapData] Returning ${sightings.length} valid sightings`);

    return success({ sightings });
  } catch (err) {
    console.error("Error getting heatmap data:", err);
    return error(`Failed to get heatmap data: ${err.message}`, 500);
  }
}

/**
 * Mask/unmask plant location
 */
async function maskPlant(plantId, body) {
  if (!body || typeof body.enable !== "boolean") {
    return error("Missing or invalid 'enable' field (must be boolean)", 400);
  }

  const params = {
    TableName: PLANTS_TABLE,
    Key: { id: plantId },
    UpdateExpression: "SET #mask = :mask, #updated_at = :updated_at",
    ExpressionAttributeNames: {
      "#mask": "is_masked",
      "#updated_at": "updated_at"
    },
    ExpressionAttributeValues: {
      ":mask": body.enable,
      ":updated_at": new Date().toISOString()
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamodb.update(params).promise();
    return success({ plant: result.Attributes });
  } catch (err) {
    if (err.code === "ResourceNotFoundException") {
      return error("Plant not found", 404);
    }
    console.error("Error masking plant:", err);
    return error(`Failed to mask plant: ${err.message}`, 500);
  }
}

/**
 * Main handler for Plants API
 */
exports.handler = async (event) => {
  console.log("Plants Lambda Event:", JSON.stringify(event, null, 2));

  // Handle OPTIONS preflight
  if (event.httpMethod === "OPTIONS") {
    return corsOptions();
  }

  const method = event.httpMethod;
  // Handle multiple path formats from API Gateway
  const path = event.path || event.rawPath || event.resource || "";
  const pathParameters = event.pathParameters || {};
  const queryStringParameters = event.queryStringParameters || {};
  
  // Log for debugging
  console.log(`[plants.js] Method: ${method}, Path: ${path}, RawPath: ${event.rawPath}, Resource: ${event.resource}`);
  
  let body;
  try {
    body = event.body ? JSON.parse(event.body) : null;
  } catch (err) {
    return error("Invalid JSON in request body", 400);
  }

  // Check admin status
  const isAdmin = queryStringParameters.admin === "1" || 
                  queryStringParameters.admin === "true";

  // Route handling
  try {
    // POST /plants/presign
    if (method === "POST" && path.includes("/presign")) {
      return await generatePresignedUrl(body);
    }

    // GET /plants/heatmap (handle multiple path formats)
    const isHeatmapPath = path.includes("/heatmap") || 
                          path.endsWith("/heatmap") ||
                          event.rawPath?.includes("/heatmap") ||
                          event.resource?.includes("/heatmap") ||
                          (pathParameters.proxy && pathParameters.proxy.includes("heatmap"));
    
    if (method === "GET" && isHeatmapPath) {
      console.log(`[plants.js] Heatmap request detected, path: ${path}`);
      return await getHeatmapData(queryStringParameters, isAdmin);
    }

    // PUT /plants/{id}/mask
    if (method === "PUT" && pathParameters.id && path.includes("/mask")) {
      return await maskPlant(pathParameters.id, body);
    }

    // GET /plants/{id}
    if (method === "GET" && pathParameters.id) {
      return await getPlantById(pathParameters.id);
    }

    // DELETE /plants/{id}
    if (method === "DELETE" && pathParameters.id) {
      return await deletePlant(pathParameters.id);
    }

    // GET /plants (list all)
    if (method === "GET") {
      return await listPlants(queryStringParameters, isAdmin);
    }

    // POST /plants
    if (method === "POST") {
      return await createPlant(body);
    }

    return error("Method not allowed", 405);
  } catch (err) {
    console.error("Unexpected error:", err);
    return error(`Internal server error: ${err.message}`, 500);
  }
};

