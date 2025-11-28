// app/index.tsx – Login screen

import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { clearAuth, setCognitoTokens, setCurrentUser } from "../authStore";
import { getEmailFromToken, getUsernameFromToken, isAdminFromToken } from "../utils/cognito";
import COLORS from "../src/theme/colors";

// Users API Gateway URL
const USERS_API_BASE = "https://sj2osq50u1.execute-api.us-east-1.amazonaws.com/demo";


export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      console.log("Logging in with Cognito:", email);

      // Call Cognito login endpoint
      const res = await fetch(`${USERS_API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      console.log("Login raw response:", text);
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error("Invalid JSON from server");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || `HTTP ${res.status}`);
      }

      // Check if user has tokens
      if (!data.tokens || !data.tokens.IdToken) {
        throw new Error("No authentication tokens received");
      }

      // Check if user is in admin group
      const idToken = data.tokens.IdToken;
      const isAdmin = isAdminFromToken(idToken);

      if (!isAdmin) {
        clearAuth();
        throw new Error("Access denied. Only users in the admin group can access this dashboard.");
      }

      // Save tokens
      setCognitoTokens({
        AccessToken: data.tokens.AccessToken,
        IdToken: data.tokens.IdToken,
        RefreshToken: data.tokens.RefreshToken,
      });

      // Extract user info from token
      const userEmail = getEmailFromToken(idToken) || email;
      const username = getUsernameFromToken(idToken) || userEmail.split("@")[0];

      // Save user info
      setCurrentUser({
        username: username,
        email: userEmail,
      });

      // ✅ Login OK → go to dashboard
      router.replace("/users");
    } catch (e: any) {
      console.error("Login error:", e);
      setError(e.message || "Login failed");
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.outer}>
      <View style={styles.card}>
        {/* Logo */}
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Welcome back!</Text>

        {/* Email */}
        <View style={{ width: "100%", marginTop: 16 }}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="admin@example.com"
            placeholderTextColor={COLORS.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        {/* Password */}
        <View style={{ width: "100%", marginTop: 12 }}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={COLORS.muted}
              secureTextEntry={!showPassword}
              style={[styles.input, { flex: 1, marginRight: 8 }]}
            />
            <Pressable
              onPress={() => setShowPassword((v) => !v)}
              style={styles.eyeBtn}
            >
              <Text style={{ fontSize: 12 }}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.helper}>
          Use at least 8 characters with 1 number, and one special
          character.
        </Text>

        {/* Error */}
        {error && (
          <Text style={styles.errorText}>
            {error}
          </Text>
        )}

        {/* Login button */}
        <Pressable
          style={({ pressed }) => [
            styles.loginBtn,
            pressed && { opacity: 0.9 },
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>LOG IN</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 480,
    maxWidth: "95%",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 32,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    alignItems: "center",
  },
  logo: {
    width: 260,
    height: 90,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    fontSize: 15,
    color: COLORS.text,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  helper: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 8,
    textAlign: "center",
  },
  errorText: {
    color: COLORS.error,
    marginTop: 10,
    fontSize: 13,
    textAlign: "center",
  },
  loginBtn: {
    marginTop: 18,
    width: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
});
