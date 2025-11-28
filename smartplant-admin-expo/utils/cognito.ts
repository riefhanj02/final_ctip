// utils/cognito.ts - Cognito helper functions

/**
 * Decode base64 URL-safe string (browser-compatible)
 */
function base64UrlDecode(str: string): string {
  // Replace URL-safe characters
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  
  // Add padding if needed
  while (base64.length % 4) {
    base64 += "=";
  }
  
  // Decode using atob (browser) or Buffer (Node.js)
  if (typeof window !== "undefined" && window.atob) {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } else if (typeof Buffer !== "undefined") {
    return Buffer.from(base64, "base64").toString("utf8");
  } else {
    throw new Error("No base64 decoder available");
  }
}

/**
 * Decode JWT token without verification (for client-side)
 * Returns null on failure
 */
export function decodeJWT(token: string | null): any | null {
  if (!token) return null;
  try {
    const cleaned = token.replace("Bearer ", "").trim();
    const parts = cleaned.split(".");
    if (parts.length < 2) return null;
    
    // Decode base64 payload
    const decoded = base64UrlDecode(parts[1]);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("JWT decode error:", e);
    return null;
  }
}

/**
 * Check if user is in admin group from JWT token
 * Checks the cognito:groups claim in the token
 */
export function isAdminFromToken(token: string | null): boolean {
  const decoded = decodeJWT(token);
  if (!decoded) return false;
  
  // Check cognito:groups claim
  const groups = decoded["cognito:groups"] || [];
  return Array.isArray(groups) && groups.includes("admin");
}

/**
 * Get user email from JWT token
 */
export function getEmailFromToken(token: string | null): string | null {
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  return decoded.email || decoded["cognito:username"] || null;
}

/**
 * Get username from JWT token
 */
export function getUsernameFromToken(token: string | null): string | null {
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  return decoded["cognito:username"] || decoded.preferred_username || decoded.username || null;
}

