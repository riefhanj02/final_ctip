// lambda/heatmap.js
// Lambda for generating aggregated plant sighting heatmap + filters
// This is the actual Lambda function in use (provided by user)

// ──────────────────────────────────────────────
// Imports
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

// ──────────────────────────────────────────────
// Env
const REGION = process.env.REGION || "us-east-1";
const TABLE_PLANTS = process.env.TABLE_PLANTS || "PlantRecords";

// DynamoDB client
const dynamodb = new DynamoDBClient({ region: REGION });

// ──────────────────────────────────────────────
// Simple CORS helpers
const corsHeaders = () => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
});

const ok = (body) => ({
  statusCode: 200,
  headers: corsHeaders(),
  body: JSON.stringify(body),
});

const bad = (code, msg) => ({
  statusCode: code,
  headers: corsHeaders(),
  body: JSON.stringify({ error: msg }),
});

// ──────────────────────────────────────────────
// Helper – convert DynamoDB item → JS object
function ddb(item) {
  return {
    plantID: item.plantID.S,
    userID: item.userID.S,
    species: item.species.S,
    status: item.status.S,
    confidence: Number(item.confidence.N),
    rarity: item.rarity?.S,
    latitude: parseFloat(item.latitude.S || "0"),
    longitude: parseFloat(item.longitude.S || "0"),
    timestamp: item.timestamp.S,
  };
}

// ──────────────────────────────────────────────
// Handler
exports.handler = async (event) => {
  const path =
    event.rawPath || event.path || event.resource || "/heatmap";

  // Only allow GET
  if (event.httpMethod && event.httpMethod !== "GET") {
    return bad(405, "Only GET allowed");
  }

  // Handle OPTIONS preflight
  if (event.httpMethod === "OPTIONS") {
    return ok({});
  }

  // Parse filters
  const qs = event.queryStringParameters || {};
  const filterSpecies = qs.species || null;
  const filterRarity = qs.rarity || null;
  const filterStart = qs.startDate || null;
  const filterEnd = qs.endDate || null;

  // ──────────────────────────────────────────────
  // Scan all plant records
  let items = [];
  try {
    const res = await dynamodb.send(
      new ScanCommand({ TableName: TABLE_PLANTS })
    );
    items = (res.Items || []).map(ddb);
  } catch (err) {
    return bad(500, "DynamoDB scan error: " + err.message);
  }

  // ──────────────────────────────────────────────
  // Apply filters
  let filtered = items;
  if (filterSpecies) {
    filtered = filtered.filter((x) => x.species === filterSpecies);
  }
  if (filterRarity) {
    filtered = filtered.filter((x) => x.rarity === filterRarity);
  }
  if (filterStart) {
    filtered = filtered.filter(
      (x) => new Date(x.timestamp) >= new Date(filterStart)
    );
  }
  if (filterEnd) {
    filtered = filtered.filter(
      (x) => new Date(x.timestamp) <= new Date(filterEnd)
    );
  }

  // ──────────────────────────────────────────────
  // Build GeoJSON FeatureCollection
  const features = filtered.map((x) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [x.longitude, x.latitude], // GeoJSON format: [lng, lat]
    },
    properties: {
      plantID: x.plantID,
      species: x.species,
      rarity: x.rarity,
      timestamp: x.timestamp,
      confidence: x.confidence,
      status: x.status,
    },
  }));

  const geojson = {
    type: "FeatureCollection",
    features,
  };

  return ok({ count: features.length, geojson });
};

