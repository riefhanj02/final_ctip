// ADD THIS TO YOUR plants.js Lambda function
// Add this handler function to handle GET /plants endpoint

// ──────────────────────────────────────────────
// GET /plants - List all plants for map display
// ──────────────────────────────────────────────

async function handleListPlants(qs) {
  console.log("[handleListPlants] Starting scan of", TABLE_PLANTS);
  
  try {
    const res = await dynamodb.send(
      new ScanCommand({ TableName: TABLE_PLANTS })
    );
    
    console.log("[handleListPlants] Scan result:", res.Items?.length || 0, "items");
    
    let items = (res.Items || []).map((item) => {
      // Convert DynamoDB typed format to plain object
      const plant = {
        id: item.plantID?.S || "",
        plantID: item.plantID?.S || "",
        userID: item.userID?.S || "",
        species: item.species?.S || "Unknown",
        status: item.status?.S || "identified",
        confidence: item.confidence?.N ? Number(item.confidence.N) : 0,
        rarity: item.rarity?.S || null,
        latitude: item.latitude?.S || "0",
        longitude: item.longitude?.S || "0",
        timestamp: item.timestamp?.S || item.createdAt?.S || new Date().toISOString(),
        image_url: item.imageUrl?.S || "",
        imageS3Path: item.imageS3Path?.S || "",
        is_masked: false, // You can add logic here based on rarity
        description: item.species?.S || "Plant", // Use species as description
      };
      
      // Determine rarity from species if not set
      if (!plant.rarity && SPECIES_RARITY[plant.species]) {
        plant.rarity = SPECIES_RARITY[plant.species];
      }
      
      // Set is_masked based on rarity
      if (plant.rarity === "rare" || plant.rarity === "Rare") {
        plant.is_masked = true;
      }
      
      return plant;
    });
    
    // Filter out unsure/unknown status if needed
    const isAdmin = qs.admin === "1" || qs.admin === "true";
    if (!isAdmin) {
      items = items.filter(item => 
        item.status !== "unknown" && 
        item.status !== "unsure" &&
        !item.is_masked
      );
    }
    
    // Apply filters
    if (qs.species) {
      items = items.filter(item => 
        item.species?.toLowerCase().includes(qs.species.toLowerCase())
      );
    }
    
    if (qs.rarity) {
      items = items.filter(item => item.rarity === qs.rarity);
    }
    
    // Pagination
    const page = parseInt(qs.page || "1");
    const pageSize = parseInt(qs.page_size || "50");
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = items.slice(startIndex, endIndex);
    
    console.log("[handleListPlants] Returning", paginatedItems.length, "items");
    
    return ok({
      items: paginatedItems,
      total: items.length,
      page,
      page_size: pageSize
    });
    
  } catch (err) {
    console.error("[handleListPlants] Error:", err);
    return bad(500, "Failed to list plants: " + err.message);
  }
}

// ──────────────────────────────────────────────
// ADD THIS TO YOUR MAIN HANDLER IN plants.js
// ──────────────────────────────────────────────

// In your exports.handler function, ADD THIS CASE:

// LIST PLANTS (for map display)
if (path.endsWith("/plants") && method === "GET") {
  return await handleListPlants(qs);
}

// Or if using proxy, check if path === "/plants":
if ((path === "/plants" || path.endsWith("/plants")) && method === "GET") {
  return await handleListPlants(qs);
}

