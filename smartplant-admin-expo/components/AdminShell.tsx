// components/AdminShell.tsx
import {
  usePathname,
  useRouter,
  type Href,
} from "expo-router";
import React, { ReactNode } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentUser, clearAuth } from "../authStore";
import COLORS from "../src/theme/colors";

type AdminShellProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

type NavItem = {
  label: string;
  path: Href;
};

const navItems = [
  { label: "Users", path: "/users" as Href },
  { label: "IoT", path: "/iot" as Href },
  { label: "Map", path: "/map" as Href },
  { label: "Unsure Images", path: "/unsure-plants" as Href },
] satisfies NavItem[];

const AdminShell: React.FC<AdminShellProps> = ({
  title,
  subtitle,
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const logo = require("../assets/images/logo.png");
  const user = getCurrentUser();
  const displayName = user?.username || "Administrator";

  const handleLogout = () => {
    console.log("LOGOUT CLICKED");
    clearAuth(); // Clear both user and Cognito tokens
    router.replace("/"); // back to login
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <Image
              source={logo}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Nav items */}
          <View style={styles.navSection}>
            {navItems.map((item) => {
              const active = pathname === item.path;
              return (
                <Pressable
                  key={String(item.path)}
                  onPress={() => router.push(item.path)}
                  style={({ pressed }) => [
                    styles.navItem,
                    active && styles.navItemActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text
                    style={[
                      styles.navText,
                      active && styles.navTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Spacer + Logout at bottom */}
          <View style={{ flex: 1 }} />
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutBtn,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>

        {/* Main area */}
        <View style={styles.main}>
          {/* Top bar */}
          <View style={styles.topbarContainer}>
            <View style={styles.topbar}>
              <View />
              <Text style={styles.userLabel}>Hi, {displayName}</Text>
            </View>
          </View>

          {/* Page content */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
            {(title || subtitle) && (
              <View style={styles.pageHeader}>
                {title && <Text style={styles.pageTitle}>{title}</Text>}
                {subtitle && (
                  <Text style={styles.pageSubtitle}>{subtitle}</Text>
                )}
              </View>
            )}

            {children}

            <Text style={styles.footer}>© SmartPlant</Text>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  root: {
    flex: 1,
    flexDirection: "row",
  },

  /* Sidebar */
  sidebar: {
    width: 240,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: COLORS.sidebarBackground,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  logoRow: {
    alignItems: "center",
    marginBottom: 12,
  },
  logoImage: {
    width: 180,
    height: 100,
    resizeMode: "contain",
  },
  navSection: {
    marginTop: 8,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 4,
    ...(Platform.OS === "web"
      ? ({ cursor: "pointer" } as any)
      : null),
  },
  navItemActive: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  navText: {
    fontSize: 14,
    color: COLORS.text,
  },
  navTextActive: {
    color: COLORS.surface,
    fontWeight: "600",
  },

  /* Logout button */
  logoutBtn: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error + "40",
    backgroundColor: COLORS.error + "20",
    ...(Platform.OS === "web"
      ? ({ cursor: "pointer" } as any)
      : null),
  },
  logoutText: {
    fontSize: 14,
    color: COLORS.error,
    fontWeight: "600",
    textAlign: "center",
  },

  /* Main + topbar */
  main: {
    flex: 1,
  },
  topbarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  topbar: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },

  /* Content */
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  pageHeader: {
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },
  pageSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: COLORS.muted,
  },
  footer: {
    marginTop: 18,
    fontSize: 12,
    color: COLORS.muted,
  },
});

export default AdminShell;
