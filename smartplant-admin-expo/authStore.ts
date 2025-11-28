// authStore.ts
export type AuthUser = {
  id?: number;
  userID?: string;
  username: string;
  email: string;
  name?: string;
  realName?: string;
  phone?: string;
};

export type CognitoTokens = {
  AccessToken: string;
  IdToken: string;
  RefreshToken?: string;
};

let currentUser: AuthUser | null = null;
let cognitoTokens: CognitoTokens | null = null;

// Storage keys
const STORAGE_USER = "admin_cognito_user";
const STORAGE_TOKENS = "admin_cognito_tokens";

// Initialize from localStorage (for web)
export function initAuth() {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const savedUser = localStorage.getItem(STORAGE_USER);
      const savedTokens = localStorage.getItem(STORAGE_TOKENS);
      if (savedUser) {
        currentUser = JSON.parse(savedUser);
      }
      if (savedTokens) {
        cognitoTokens = JSON.parse(savedTokens);
      }
    } catch (e) {
      console.error("Failed to load auth from storage:", e);
    }
  }
}

export function setCurrentUser(user: AuthUser | null) {
  currentUser = user;
  if (typeof window !== "undefined" && window.localStorage) {
    if (user) {
      localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_USER);
    }
  }
}

export function getCurrentUser(): AuthUser | null {
  return currentUser;
}

export function setCognitoTokens(tokens: CognitoTokens | null) {
  cognitoTokens = tokens;
  if (typeof window !== "undefined" && window.localStorage) {
    if (tokens) {
      localStorage.setItem(STORAGE_TOKENS, JSON.stringify(tokens));
    } else {
      localStorage.removeItem(STORAGE_TOKENS);
    }
  }
}

export function getCognitoTokens(): CognitoTokens | null {
  return cognitoTokens;
}

export function getAccessToken(): string | null {
  return cognitoTokens?.AccessToken || null;
}

export function getIdToken(): string | null {
  return cognitoTokens?.IdToken || null;
}

export function clearAuth() {
  currentUser = null;
  cognitoTokens = null;
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_TOKENS);
  }
}

// Initialize on import
if (typeof window !== "undefined") {
  initAuth();
}
