// lambda/admin-unsure-images.js
// Lambda for managing unsure plant images (low confidence or marked as unsure)

const { DynamoDBClient, ScanCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const REGION = process.env.REGION || "us-east-1";
const TABLE_PLANTS = process.env.TABLE_PLANTS || "PlantRecords";

const dynamodb = new DynamoDBClient({ region: REGION });

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

const ok = (body) => ({
  statusCode: 200,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

const bad = (code, msg) => ({
  statusCode: code,
  headers: corsHeaders,
  body: JSON.stringify({ error: msg }),
});

// GET /admin/unsure-images - List all unsure plants
async function listUnsurePlants() {
  try {
    console.log(`[listUnsurePlants] Scanning ${TABLE_PLANTS} for unsure plants`);
    
    const res = await dynamodb.send(
      new ScanCommand({ TableName: TABLE_PLANTS })
    );
    
    console.log(`[listUnsurePlants] Found ${res.Items?.length || 0} total items`);
    
    // Filter for unsure plants:
    // 1. status = "unsure" or "unknown"
    // 2. confidence < 0.5
    // 3. unsure field = true
    const unsureItems = (res.Items || []).filter(item => {
      const status = item.status?.S || "";
      const confidence = item.confidence?.N ? Number(item.confidence.N) : 1.0;
      const unsure = item.unsure?.BOOL || false;
      
      return (
        status === "unsure" ||
        status === "unknown" ||
        confidence < 0.5 ||
        unsure === true
      );
    });
    
    console.log(`[listUnsurePlants] Found ${unsureItems.length} unsure plants`);
    
    // Transform to response format
    const items = unsureItems.map(item => ({
      plantID: item.plantID?.S || "",
      userID: item.userID?.S || "",
      species: item.species?.S || "Unknown",
      status: item.status?.S || "unsure",
      confidence: item.confidence?.N ? Number(item.confidence.N) : 0,
      rarity: item.rarity?.S || null,
      latitude: item.latitude?.S || "0",
      longitude: item.longitude?.S || "0",
      timestamp: item.timestamp?.S || item.createdAt?.S || new Date().toISOString(),
      imageUrl: item.imageUrl?.S || item.imageS3Path?.S || "",
      imageS3Path: item.imageS3Path?.S || "",
      unsure: item.unsure?.BOOL || false,
    }));
    
    return ok({
      items,
      total: items.length
    });
    
  } catch (err) {
    console.error("[listUnsurePlants] Error:", err);
    return bad(500, "Failed to list unsure plants: " + err.message);
  }
}

// POST /admin/unsure-images - Update unsure plant status
async function updateUnsurePlant(body) {
  try {
    const { plantID, action } = body;
    
    if (!plantID) {
      return bad(400, "plantID is required");
    }
    
    if (!action || (action !== "unsure" && action !== "sure")) {
      return bad(400, "action must be 'unsure' or 'sure'");
    }
    
    console.log(`[updateUnsurePlant] Updating ${plantID} to ${action}`);
    
    // Update plant status
    const updateExpression = action === "sure" 
      ? "SET #status = :status, unsure = :unsure"
      : "SET #status = :status, unsure = :unsure";
    
    const expressionAttributeNames = {
      "#status": "status"
    };
    
    const expressionAttributeValues = {
      ":status": { S: action === "sure" ? "identified" : "unsure" },
      ":unsure": { BOOL: action === "unsure" }
    };
    
    await dynamodb.send(
      new UpdateItemCommand({
        TableName: TABLE_PLANTS,
        Key: {
          plantID: { S: plantID }
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );
    
    console.log(`[updateUnsurePlant] Successfully updated ${plantID}`);
    
    return ok({
      success: true,
      plantID,
      action,
      message: `Plant marked as ${action === "sure" ? "confirmed" : "unsure"}`
    });
    
  } catch (err) {
    console.error("[updateUnsurePlant] Error:", err);
    return bad(500, "Failed to update plant: " + err.message);
  }
}

// Main handler
exports.handler = async (event) => {
  const method = event.httpMethod || event.requestContext?.http?.method || "GET";
  const path = event.rawPath || event.path || event.resource || "";
  
  console.log(`[admin-unsure-images] ${method} ${path}`);
  
  // Handle OPTIONS preflight
  if (method === "OPTIONS") {
    return ok({});
  }
  
  // Parse body
  let body = {};
  if (event.body) {
    try {
      body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } catch (e) {
      return bad(400, "Invalid JSON body");
    }
  }
  
  // Route requests
  if (method === "GET") {
    return await listUnsurePlants();
  } else if (method === "POST") {
    return await updateUnsurePlant(body);
  } else {
    return bad(405, `Method ${method} not allowed`);
  }
};

