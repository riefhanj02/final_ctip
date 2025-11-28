// app/unsure-plants.tsx
// Unsure Images Review Page - Connected to DynamoDB

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AdminShell from "../components/AdminShell";
import { apiGetUnsurePlants, apiUpdateUnsurePlant } from "../src/api";
import S3Image from "../components/S3Image";

// Theme colors
const COLORS = {
  primary: '#C8D2AE',      // Light sage green - main buttons, links
  surface: '#96AA8B',     // Medium sage green - background
  text: '#0F172A',        // Dark slate - main text
  muted: 'rgba(0,0,0,0.55)', // Semi-transparent black - secondary text
  border: 'rgba(0,0,0,0.08)', // Very light gray - borders
  white: '#FFFFFF',       // Pure white
};

// Example/mock data for prototype (fallback)
const MOCK_UNSURE_PLANTS = [
  {
    id: "plant_001",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    species: "Nepenthes rafflesiana",
    confidence: 0.42,
    userID: "user_123",
    date: "2025-01-18",
    status: "unsure",
  },
  {
    id: "plant_002",
    imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400",
    species: "Rafflesia arnoldii",
    confidence: 0.38,
    userID: "user_456",
    date: "2025-01-17",
    status: "unsure",
  },
  {
    id: "plant_003",
    imageUrl: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=400",
    species: "Shorea macrophylla",
    confidence: 0.35,
    userID: "user_789",
    date: "2025-01-16",
    status: "unsure",
  },
  {
    id: "plant_004",
    imageUrl: "https://images.unsplash.com/photo-1508610048658-a5a83c72234e?w=400",
    species: "Dipterocarpus alatus",
    confidence: 0.45,
    userID: "user_321",
    date: "2025-01-15",
    status: "unsure",
  },
  {
    id: "plant_005",
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
    species: "Hopea beccariana",
    confidence: 0.40,
    userID: "user_654",
    date: "2025-01-14",
    status: "unsure",
  },
];

export default function UnsurePlantsScreen() {
  const [plants, setPlants] = useState<any[]>([]);
  const [removedPlants, setRemovedPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatTimestamp = (value?: string) => {
    if (!value) return "Unknown date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  // Load unsure plants from DynamoDB
  useEffect(() => {
    loadUnsurePlants();
  }, []);

  async function loadUnsurePlants() {
    setLoading(true);
    try {
      const res = await apiGetUnsurePlants();
      // Transform DynamoDB response to component format
      const transformed = (res.items || []).map((item: any) => {
        // Handle DynamoDB typed format (AWS SDK v3)
        const getValue = (field: any) => {
          if (!field) return null;
          if (field.S) return field.S; // String
          if (field.N) return Number(field.N); // Number
          if (field.BOOL !== undefined) return field.BOOL; // Boolean
          return null;
        };

        const userName = getValue(item.userName) || getValue(item.user_name) || getValue(item.userID);
        const timestamp = getValue(item.timestamp) || getValue(item.createdAt) || new Date().toISOString();

        return {
          id: getValue(item.plantID) || '',
          plantID: getValue(item.plantID) || '',
          imageUrl: getValue(item.imageUrl) || getValue(item.imageS3Path) || '',
          species: getValue(item.species) || 'Unknown',
          confidence: getValue(item.confidence) || 0,
          userID: getValue(item.userID) || '',
          userName: userName || 'Unknown user',
          date: timestamp,
          status: getValue(item.status) || 'unsure',
          unsure: getValue(item.unsure) || false,
        };
      });

      setPlants(transformed);
      console.log(`Loaded ${transformed.length} unsure plants from DynamoDB`);
    } catch (e) {
      console.error("Failed to load unsure plants:", e);
      Alert.alert("Error", "Failed to load unsure plants: " + e.message);
      // Fallback to empty array
      setPlants([]);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (plantId: string, newStatus: "unsure" | "sure") => {
    try {
      // Update via API
      await apiUpdateUnsurePlant(plantId, newStatus);
      
      // Reload data from server
      await loadUnsurePlants();
      
      Alert.alert("Success", `Plant marked as ${newStatus === "sure" ? "confirmed" : "unsure"}`);
    } catch (e) {
      console.error("Failed to update plant status:", e);
      Alert.alert("Error", "Failed to update plant status: " + e.message);
    }
    if (newStatus === "sure") {
      // Move to removed list
      const plantToRemove = plants.find((p) => p.id === plantId);
      if (plantToRemove) {
        setRemovedPlants((prev) => [...prev, { ...plantToRemove, status: "sure" }]);
        setPlants((prev) => prev.filter((plant) => plant.id !== plantId));
      }
    } else {
      // Check if plant is in removed list, restore it
      const plantToRestore = removedPlants.find((p) => p.id === plantId);
      if (plantToRestore) {
        setPlants((prev) => [...prev, { ...plantToRestore, status: "unsure" }]);
        setRemovedPlants((prev) => prev.filter((plant) => plant.id !== plantId));
      } else {
        // Update status if already in main list
        setPlants((prev) =>
          prev.map((plant) =>
            plant.id === plantId ? { ...plant, status: newStatus } : plant
          )
        );
      }
    }
  };

  return (
    <AdminShell
      title="Unsure Images"
      subtitle="Review and manage uncertain plant identifications"
    >
      <View style={styles.container}>
        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            Total unsure images:{" "}
            <Text style={styles.summaryNumber}>{plants.length}</Text>
          </Text>
          <Text style={styles.summarySubtext}>
            Use the buttons to mark images as &quot;Unsure&quot; or &quot;Sure&quot;
          </Text>
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading unsure plants...</Text>
          </View>
        )}

        {/* Plants Grid */}
        {!loading && plants.length === 0 && removedPlants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No unsure images to review – all clear! ✅
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            nestedScrollEnabled={true}
            contentContainerStyle={styles.gridContainer}
          >
            {plants.map((plant) => (
              <View key={plant.id} style={styles.plantCard}>
                {/* Image */}
                <View style={styles.imageContainer}>
                  <S3Image
                    source={plant.imageUrl}
                    style={styles.plantImage}
                    resizeMode="cover"
                  />
                </View>

                {/* Details */}
                <View style={styles.detailsContainer}>
                  <Text style={styles.speciesText} numberOfLines={2}>
                    {plant.species}
                  </Text>

                  <View style={styles.metadataRow}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {(plant.confidence * 100).toFixed(0)}% confidence
                      </Text>
                    </View>
                    {plant.confidence < 0.5 && (
                      <View style={[styles.badge, styles.lowConfidenceBadge]}>
                        <Text style={styles.badgeText}>Low</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.metadataText} numberOfLines={1}>
                    ID: {plant.id}
                  </Text>
                  <Text style={styles.metadataText} numberOfLines={1}>
                    Uploaded by: {plant.userName || plant.userID || "Unknown user"}
                  </Text>
                  <Text style={styles.metadataText}>
                    Date: {formatTimestamp(plant.date)}
                  </Text>
                </View>

                {/* Status Selector - Simple Buttons */}
                <View style={styles.statusContainer}>
                  <Text style={styles.statusLabel}>Status:</Text>
                  <View style={styles.statusButtons}>
                    <Pressable
                      style={[
                        styles.statusButton,
                        plant.status === "unsure" && styles.statusButtonActive,
                      ]}
                      onPress={() => {
                        handleStatusChange(plant.id, "unsure");
                      }}
                    >
                      <Text
                        style={[
                          styles.statusButtonText,
                          plant.status === "unsure" &&
                          styles.statusButtonTextActive,
                        ]}
                      >
                        ❓ Unsure
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.statusButton,
                        plant.status === "sure" && styles.statusButtonActive,
                        styles.statusButtonSure,
                      ]}
                      onPress={() => {
                        handleStatusChange(plant.id, "sure");
                      }}
                    >
                      <Text
                        style={[
                          styles.statusButtonText,
                          plant.status === "sure" &&
                          styles.statusButtonTextActive,
                        ]}
                      >
                        ✅ Sure
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
            {/* Show removed plants with option to restore */}
            {removedPlants.map((plant) => (
              <View key={plant.id} style={[styles.plantCard, styles.removedCard]}>
                <View style={styles.imageContainer}>
                  <S3Image
                    source={plant.imageUrl}
                    style={[styles.plantImage, styles.removedImage]}
                    resizeMode="cover"
                  />
                  <View style={styles.removedOverlay}>
                    <Text style={styles.removedText}>✅ Marked as Sure</Text>
                  </View>
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.speciesText} numberOfLines={2}>
                    {plant.species}
                  </Text>
                  <Text style={styles.metadataText}>ID: {plant.id}</Text>
                  <Text style={styles.metadataText}>
                    Uploaded by: {plant.userName || plant.userID || "Unknown user"}
                  </Text>
                  <Text style={styles.metadataText}>
                    Date: {formatTimestamp(plant.date)}
                  </Text>
                </View>
                <View style={styles.statusContainer}>
                  <Pressable
                    style={[styles.statusButton, styles.restoreButton]}
                    onPress={() => handleStatusChange(plant.id, "unsure")}
                  >
                    <Text style={styles.restoreButtonText}>↩️ Restore to Unsure</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.muted,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  summaryNumber: {
    fontWeight: "700",
    color: COLORS.surface,
  },
  summarySubtext: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.muted,
    textAlign: "center",
  },
  plantCard: {
    width: "19%", // 5 per row with gap
    minWidth: 200,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...(Platform.OS === "web"
      ? {
        boxSizing: "border-box" as any,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      }
      : {
        elevation: 2,
      }),
  },
  removedCard: {
    opacity: 0.7,
    borderColor: COLORS.surface,
    backgroundColor: COLORS.primary + "20", // 20% opacity
  },
  removedImage: {
    opacity: 0.5,
  },
  removedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.surface + "33", // 20% opacity
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  removedText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },
  restoreButton: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + "20",
  },
  restoreButtonText: {
    color: COLORS.surface,
    fontWeight: "600",
    fontSize: 12,
  },
  imageContainer: {
    marginBottom: 8,
    width: "100%",
  },
  plantImage: {
    width: "100%",
    height: 140, // shorter so grid looks balanced
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  detailsContainer: {
    marginBottom: 8,
  },
  speciesText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  metadataRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  lowConfidenceBadge: {
    backgroundColor: "#fee2e2",
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: "500",
  },
  metadataText: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 2,
  },
  statusContainer: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
  },
  statusButtons: {
    flexDirection: "row",
    gap: 6,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "web"
      ? ({ cursor: "pointer" } as any)
      : null),
  },
  statusButtonActive: {
    borderColor: COLORS.surface,
    backgroundColor: COLORS.primary + "30", // 30% opacity
  },
  statusButtonSure: {
    borderColor: COLORS.border,
  },
  statusButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.muted,
  },
  statusButtonTextActive: {
    color: COLORS.surface,
    fontWeight: "600",
  },
});
