// src/api.js
// ================== HYBRID BACKEND CONFIGURATION ==================
// AWS Lambda endpoints for Users and Plants
const AWS_BASE_URL = "https://sj2osq50u1.execute-api.us-east-1.amazonaws.com/demo";

// Local PHP backend for IoT (MySQL)
const LOCAL_BASE_URL = "http://localhost/Admin(Expo)%20(3)/Admin(Expo)/smartplant-admin-expo/backend";

// AWS Lambda request function (for Users and Plants)
async function awsRequest(path, options = {}) {
    const url = path.startsWith("http") ? path : `${AWS_BASE_URL}/${path}`;

    const headers = {
        ...(options.headers || {})
    };

    // Only set Content-Type to json if body is not FormData
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const res = await fetch(url, { ...options, headers });
    const text = await res.text();

    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch (e) {
        throw new Error("Invalid JSON: " + text);
    }

    if (!res.ok || data.error) {
        throw new Error(data.error || `${res.status} ${res.statusText}`);
    }
    return data;
}

// Local PHP request function (for IoT)
async function localRequest(path, options = {}) {
    let url;
    // If path is already a full URL, use it as-is
    if (path.startsWith("http")) {
        url = path;
    } else {
        // Remove leading slash if present
        const cleanPath = path.startsWith("/") ? path.substring(1) : path;
        url = `${LOCAL_BASE_URL}/${cleanPath}`;
    }

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    const res = await fetch(url, { ...options, headers });
    const text = await res.text();

    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch (e) {
        throw new Error("Invalid JSON: " + text);
    }

    if (!res.ok || data.error) {
        throw new Error(data.error || `${res.status} ${res.statusText}`);
    }
    return data;
}

// ================== AUTHENTICATION (AWS Lambda) ==================
export async function apiLogin(email, password) {
    // Login via AWS Lambda /auth/login endpoint
    return awsRequest("auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
}

// ================== USERS API (AWS Lambda + DynamoDB) ==================
export async function apiStats() {
    return awsRequest("users?mode=stats", { method: "GET" });
}

export async function apiUsersList(params = {}) {
    const {
        mode = "list",
        name = "",
        email = "",
        is_admin = "",
        page = 1,
        page_size = 10
    } = params;

    const qs = new URLSearchParams({
        mode,
        name,
        email,
        is_admin,
        page: String(page),
        page_size: String(page_size)
    });
    return awsRequest(`users?${qs.toString()}`, { method: "GET" });
}

export async function apiUsersAll(page = 1, page_size = 10) {
    const qs = new URLSearchParams({
        page: String(page),
        page_size: String(page_size)
    });
    return awsRequest(`users?${qs.toString()}`, { method: "GET" });
}

export async function apiGetUser(id) {
    return awsRequest(`users/${id}`, { method: "GET" });
}

export async function apiCreateUser(payload) {
    return awsRequest("users", {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

export async function apiUpdateUser(id, payload) {
    return awsRequest(`users/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
}

export async function apiDeleteUser(id) {
    return awsRequest(`users/${id}`, {
        method: "DELETE"
    });
}

// ================== IoT API Functions (Local PHP + MySQL) ==================
// IoT APIs remain on local PHP backend and connect to MySQL database
export async function apiIoTStats() {
    return localRequest("iot.php?mode=stats", { method: "GET" });
}

export async function apiIoTLatestReading() {
    return localRequest("iot.php?mode=latest", { method: "GET" });
}

export async function apiIoTSensorReadings(page = 1, page_size = 50) {
    const qs = new URLSearchParams({
        mode: "readings",
        page: String(page),
        page_size: String(page_size)
    });
    return localRequest(`iot.php?${qs.toString()}`, { method: "GET" });
}

export async function apiIoTAlerts(page = 1, page_size = 20, unread_only = false) {
    const qs = new URLSearchParams({
        mode: "alerts",
        page: String(page),
        page_size: String(page_size),
        unread_only: unread_only ? "1" : "0"
    });
    return localRequest(`iot.php?${qs.toString()}`, { method: "GET" });
}

export async function apiIoTMarkAlertRead(id) {
    return localRequest(`iot.php?id=${id}`, {
        method: "PUT"
    });
}

export async function apiIoTMarkAllAlertsRead() {
    return localRequest("iot.php?mode=mark_all_read", {
        method: "PUT"
    });
}


// ================== PLANTS / MAP / HEATMAP (AWS Lambda + DynamoDB) ==================

// Get all plants (shared for app + admin)
export async function apiGetPlants(isAdmin = false) {
    const qs = new URLSearchParams();
    if (isAdmin) qs.append("admin", "1");

    const data = await awsRequest(`plants?${qs.toString()}`, {
        method: "GET",
    });

    // Map response to match frontend expectations
    // Handle actual DynamoDB table structure: plantID, imageUrl, timestamp, etc.
    const items = (data.items || []).map(p => ({
        id: p.plantID || p.id || String(Math.random()), // Use plantID from table
        plantID: p.plantID || p.id, // Keep original ID
        description: p.description || p.species || "Unknown", // Use species as description
        species: p.species || "Unclassified",
        latitude: Number(p.latitude) || 0,
        longitude: Number(p.longitude) || 0,
        rarity: p.rarity || "Common",
        image_url: p.image_url || p.imageUrl || "", // Support both field names
        created_at: p.created_at || p.timestamp || new Date().toISOString(), // Support timestamp
        is_masked: p.is_masked || false
    }));

    return { items, total: items.length };
}

// Create plant sighting (mobile app upload)
export async function apiCreatePlant(payload) {
    // ----- Create presigned upload request -----
    const presign = await awsRequest("plants/presign", {
        method: "POST",
        body: JSON.stringify({
            userID: payload.userID,
            mimeType: "image/jpeg"
        })
    });

    // ----- Upload image to S3 -----
    const formData = new FormData();
    formData.append("file", {
        uri: payload.image,
        name: "upload.jpg",
        type: "image/jpeg"
    });

    await fetch(presign.uploadUrl, {
        method: "PUT",
        body: formData._parts ? formData._parts[0][1] : payload.image, 
    });

    // Backend saves metadata + image key
    return awsRequest("plants", {
        method: "POST",
        body: JSON.stringify({
            description: payload.description,
            species: payload.species,
            latitude: payload.latitude,
            longitude: payload.longitude,
            rarity: payload.rarity,
            image_key: presign.key
        })
    });
}

// Get heatmap data from AWS Lambda endpoint
// The Lambda returns GeoJSON format: { count, geojson: { type: "FeatureCollection", features: [...] } }
export async function apiGetHeatmap(isAdmin = false, filters = {}) {
    const qs = new URLSearchParams();
    
    // Add filters if provided
    if (filters.species) qs.append("species", filters.species);
    if (filters.rarity) qs.append("rarity", filters.rarity);
    if (filters.startDate) qs.append("startDate", filters.startDate);
    if (filters.endDate) qs.append("endDate", filters.endDate);
    if (isAdmin) qs.append("admin", "1");
    
    const queryString = qs.toString();
    // Try multiple endpoint patterns - prioritize dedicated heatmap endpoints
    const candidates = [
        "heatmap",           // Dedicated heatmap Lambda
        "plants/heatmap",    // Plants Lambda with /heatmap path
    ];

    let lastError;
    for (const base of candidates) {
        // Build endpoint with proper query string handling
        const endpoint = `${base}${queryString ? `?${queryString}` : ""}`;
        
        try {
            console.log(`[apiGetHeatmap] Trying endpoint: ${endpoint}`);
            const result = await awsRequest(endpoint, { method: "GET" });
            console.log(`[apiGetHeatmap] Success with endpoint: ${endpoint}`, result);
            return result;
        } catch (err) {
            lastError = err;
            const message = err?.message || "";
            console.warn(`[apiGetHeatmap] Failed ${endpoint}:`, message);
            if (message.includes("Endpoint not found") || message.includes("404") || message.includes("Not Found")) {
                continue; // try next candidate
            }
            // If it's not a 404, might be a different error - still try next
            if (message.includes("500") || message.includes("Internal Server Error")) {
                continue;
            }
        }
    }

    // If all endpoints failed, provide helpful error
    throw new Error(`Heatmap endpoint not available. Tried: ${candidates.join(", ")}. Last error: ${lastError?.message || "Unknown"}`);
}

// Mask/unmask plant location (admin only)
export async function apiMaskPlant(id, enable = true) {
    return awsRequest(`plants/${id}/mask`, {
        method: "PUT",
        body: JSON.stringify({ enable })
    });
}

// ================== UNSURE PLANTS API (AWS Lambda + DynamoDB) ==================

// Get unsure plants (low confidence or marked as unsure)
export async function apiGetUnsurePlants() {
    return awsRequest("admin/unsure-images", {
        method: "GET"
    });
}

// Update unsure plant status (admin action)
export async function apiUpdateUnsurePlant(plantID, action) {
    // action: "unsure" or "sure"
    return awsRequest("admin/unsure-images", {
        method: "POST",
        body: JSON.stringify({ plantID, action })
    });
}