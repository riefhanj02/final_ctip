// app/map.tsx
// @ts-nocheck

import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import AdminShell from "../components/AdminShell";
import { apiCreatePlant, apiGetPlants, apiGetHeatmap } from "../src/api";
import {
  FILTERS,
  KUCHING_CENTER
} from "../src/mapData";
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

const MapPage: React.FC = () => {
  return (
    <AdminShell
      title="Map"
      subtitle="Visualise and manage plant sightings and IoT locations."
    >
      <MapContent />
    </AdminShell>
  );
};

const MapContent: React.FC = () => {
  const [allSightings, setAllSightings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);

  // For adding / relocating
  const [pendingCoord, setPendingCoord] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [newTitle, setNewTitle] = useState(""); // Description
  const [newSub, setNewSub] = useState(""); // Notes/Species
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Local URI
  const [newRarity, setNewRarity] = useState("Common"); // Rarity classification
  const [showAdminView, setShowAdminView] = useState(false); // Admin toggle

  // For editing (simplified for now, mostly just viewing/deleting/adding in this iteration)
  const [editingId, setEditingId] = useState<string | null>(null);

  // Heatmap state
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(false);

  useEffect(() => {
    loadPlants(showAdminView);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPlants(adminMode = showAdminView) {
    setLoading(true);
    try {
      const res = await apiGetPlants(adminMode);
      // Map API response to internal format
      const mapped = (res.items || []).map(item => {
        const uploadedAtRaw = item.created_at || item.timestamp || item.updated_at || null;
        // Use userID instead of name
        const uploaderID = item.userID || item.user_id || "Unknown";

        return {
          id: item.id || item.plantID || String(Math.random()),
          plantID: item.plantID || item.id,
          title: item.description || "Unknown",
          sub: item.species || "Unclassified",
          rarity: item.rarity || "Common",
          habitat: item.habitat || "Lowland",
          coord: {
            lat: parseFloat(item.latitude) || 0,
            lng: parseFloat(item.longitude) || 0
          },
          // Support both image_url and imageUrl field names from API
          image_url: item.image_url || item.imageUrl || "",
          updatedAt: uploadedAtRaw ? new Date(uploadedAtRaw).getTime() : Date.now(),
          isMasked: item.is_masked || false,
          uploadedBy: uploaderID, // Use ID instead of name
          uploadedAtLabel: uploadedAtRaw ? new Date(uploadedAtRaw).toLocaleString() : "Unknown time"
        };
      });
      setAllSightings(mapped);
    } catch (e) {
      console.error("Failed to load plants", e);
      // Keep empty or show error
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    const now = Date.now();

    return allSightings.filter((s) => {
      const matchesText =
        !text ||
        s.title.toLowerCase().includes(text) ||
        s.sub.toLowerCase().includes(text);

      const rarity = (s.rarity || "").toLowerCase();
      const habitat = (s.habitat || "").toLowerCase();

      let matchesFilter = true;
      switch (activeFilter) {
        case "Common":
          matchesFilter = rarity === "common" || rarity === "uncommon";
          break;
        case "Rare":
          matchesFilter = rarity === "rare" || rarity === "endangered";
          break;
        case "Mangrove":
        case "Lowland":
        case "Montane":
          matchesFilter = habitat === activeFilter.toLowerCase();
          break;
        case "Recent":
          matchesFilter = now - s.updatedAt <= 1000 * 60 * 60 * 24; // last 24h
          break;
        default:
          matchesFilter = true; // "All" or unknown filter
      }

      return matchesText && matchesFilter;
    });
  }, [q, activeFilter, allSightings]);

  // Web-only: Leaflet map (only works on web)
  const isWeb = Platform.OS === "web";
  const hasWindow = typeof window !== "undefined";

  // ---- CRUD handlers ----
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleAdd = async () => {
    console.log("handleAdd called");
    console.log("pendingCoord:", pendingCoord);
    console.log("newTitle:", newTitle);

    if (!pendingCoord || !newTitle.trim()) {
      console.log("Validation failed: Missing coord or title");
      return;
    }

    const payload = {
      description: newTitle.trim(),
      latitude: pendingCoord.lat,
      longitude: pendingCoord.lng,
      image: selectedImage,
      species: newSub.trim() || "Unknown",
      rarity: newRarity
    };
    console.log("Sending payload:", payload);

    try {
      const res = await apiCreatePlant(payload);
      console.log("API Response:", res);
      Alert.alert("Success", "Plant added.");
      setNewTitle("");
      setNewSub("");
      setSelectedImage(null);
      setNewRarity("Common");
      setPendingCoord(null);
      loadPlants(); // Reload from server
    } catch (e) {
      console.error("API Error:", e);
      Alert.alert("Error", "Failed to add plant: " + e.message);
    }
  };

  const handleDelete = (id: string) => {
    // TODO: Implement apiDeletePlant if available
    setAllSightings((prev) => prev.filter((s) => s.id !== id));
  };

  const handleMaskToggle = async (plant) => {
    const targetId = plant.plantID || plant.id;
    if (!targetId) {
      Alert.alert("Error", "Missing plant identifier.");
      return;
    }

    try {
      await apiMaskPlant(targetId, !plant.isMasked);
      Alert.alert(
        "Success",
        !plant.isMasked
          ? "Plant location masked for public users."
          : "Plant location unmasked."
      );
      loadPlants();
    } catch (e) {
      console.error("Failed to toggle mask", e);
      Alert.alert("Error", "Failed to update mask status: " + e.message);
    }
  };

  // Load heatmap data from AWS Lambda endpoint
  // The Lambda returns GeoJSON format: { count, geojson: { features: [...] } }
  // OR if using plants endpoint: { items: [...] }
  async function loadHeatmap() {
    try {
      const res = await apiGetHeatmap(showAdminView); // Pass admin view status
      
      console.log("[loadHeatmap] Response:", res);
      
      let points = [];
      
      // Check if response has sightings format (from plants.js Lambda getHeatmapData)
      if (res.sightings && Array.isArray(res.sightings)) {
        // Convert sightings to heatmap points
        points = res.sightings.map(sighting => {
          const lat = parseFloat(sighting.coord?.lat) || parseFloat(sighting.latitude) || 0;
          const lng = parseFloat(sighting.coord?.lng) || parseFloat(sighting.longitude) || 0;
          const confidence = parseFloat(sighting.confidence) || 0.6;
          
          // Skip invalid coordinates
          if (lat === 0 && lng === 0) {
            return null;
          }
          
          return {
            lat: lat,
            lng: lng,
            weight: confidence > 0 ? confidence : 0.6
          };
        }).filter(p => p !== null); // Remove invalid points
      }
      // Check if response has GeoJSON format (from dedicated heatmap Lambda)
      else if (res.geojson && res.geojson.features) {
        const features = res.geojson.features || [];
        
        // Transform GeoJSON features to heatmap points format
        // GeoJSON coordinates are [longitude, latitude] format
        points = features.map(feature => {
          const coordinates = feature.geometry?.coordinates || [];
          const properties = feature.properties || {};
          
          // GeoJSON uses [lng, lat] order, heatmap needs { lat, lng }
          const lng = coordinates[0] || 0;
          const lat = coordinates[1] || 0;
          
          // Skip invalid coordinates
          if (lat === 0 && lng === 0) {
            return null;
          }
          
          // Use confidence from properties, default to 0.6
          const confidence = properties.confidence || 0.6;
          
          return {
            lat: lat,
            lng: lng,
            weight: confidence > 0 ? confidence : 0.6
          };
        }).filter(p => p !== null); // Remove invalid points
      } 
      // Check if response has items format (from plants list endpoint)
      else if (res.items && Array.isArray(res.items)) {
        // Convert plant items to heatmap points
        points = res.items.map(item => {
          const lat = parseFloat(item.latitude) || 0;
          const lng = parseFloat(item.longitude) || 0;
          const confidence = parseFloat(item.confidence) || 0.6;
          
          // Skip invalid coordinates
          if (lat === 0 && lng === 0) {
            return null;
          }
          
          return {
            lat: lat,
            lng: lng,
            weight: confidence > 0 ? confidence : 0.6
          };
        }).filter(p => p !== null); // Remove invalid points
      }
      
      console.log(`✅ Loaded ${points.length} heatmap points from Lambda`);
      console.log("[loadHeatmap] Sample points:", points.slice(0, 3));
      
      setHeatmapPoints(points);
      setShowHeatmap(!showHeatmap);
      
      if (points.length === 0) {
        console.warn("[loadHeatmap] No points found. Response structure:", {
          hasGeojson: !!res.geojson,
          hasItems: !!res.items,
          geojsonFeatures: res.geojson?.features?.length || 0,
          itemsCount: res.items?.length || 0,
          fullResponse: res
        });
        Alert.alert("Info", "No heatmap data available. Check console for response details.");
      } else {
        console.log(`[loadHeatmap] Heatmap enabled with ${points.length} points`);
      }
    } catch (err) {
      console.error("❌ Failed to load heatmap", err);
      Alert.alert("Error", "Failed to load heatmap data: " + err.message);
    }
  }

  // SSR guard and web check
  if (!hasWindow || !isWeb) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Map view is only available on web platform.</Text>
      </View>
    );
  }

  // ---- Leaflet bits (only on web client) ----
  const {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
    useMap,
  } = require("react-leaflet");
  const L = require("leaflet");
  require("leaflet/dist/leaflet.css");
  
  // Load leaflet.heat from CDN (works with React 19 + react-leaflet 5)
  // We'll use a custom component that integrates directly with leaflet.heat
  if (Platform.OS === "web" && typeof window !== "undefined") {
    // Load leaflet.heat from CDN if not already loaded
    if (!window.L || !window.L.heatLayer) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ leaflet.heat loaded from CDN');
      };
      script.onerror = () => {
        console.warn('⚠️ Failed to load leaflet.heat from CDN');
      };
      document.head.appendChild(script);
    }
  }
  
  // Import custom HeatmapLayer component (uses leaflet.heat directly)
  let HeatmapLayer = null;
  if (Platform.OS === "web") {
    try {
      HeatmapLayer = require("../components/HeatmapLayer").default;
    } catch (e) {
      console.warn("HeatmapLayer component not found, using fallback");
    }
  }

  // Fix for default marker icon - use CDN icons for web compatibility
  if (typeof L !== 'undefined' && L.Icon) {
    delete L.Icon.Default.prototype._getIconUrl;
    // Use CDN icons directly - more reliable for web
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    console.log("✅ Leaflet marker icons configured");
  }

  // Map click handler – used to choose coordinates
  const ClickHandler = ({ onClick }) => {
    useMapEvents({
      click(e) {
        onClick(e.latlng);
      },
    });
    return null;
  };

  return (
    <>
      {/* CARD 1 – MAP */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Sightings map</Text>
          <TouchableOpacity
            onPress={() => {
              const next = !showAdminView;
              setShowAdminView(next);
              loadPlants(next);
            }}
            style={styles.adminToggle}
          >
            <Text style={styles.adminToggleText}>
              {showAdminView ? "🔓 Admin View" : "🔒 Public View"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.filterRow}>
          <View style={styles.filterCol}>
            <Text style={styles.label}>Search</Text>
            <TextInput
              style={styles.input}
              placeholder="Species, location…"
              placeholderTextColor={COLORS.muted}
              value={q}
              onChangeText={setQ}
            />
          </View>
        </View>

        {/* Filter chips */}
        <View style={styles.chipRow}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.chip,
                activeFilter === filter && styles.chipActive,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilter === filter && styles.chipTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Heatmap Toggle Button */}
        <View style={{ marginTop: 8, marginBottom: 8 }}>
          <TouchableOpacity
            onPress={loadHeatmap}
            style={{
              backgroundColor: showHeatmap ? "#10b981" : "#6b7280",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              alignSelf: "flex-start"
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Map */}
        <View style={styles.mapBox}>
          <MapContainer
            center={[KUCHING_CENTER.lat, KUCHING_CENTER.lng]}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap"
            />

            {/* Markers */}
            {filtered.map((s) => (
              <Marker
                key={s.id}
                position={[s.coord.lat, s.coord.lng]}
              >
                <Popup>
                  <div style={{ width: 150 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                      {s.isMasked && "🔒 "}{s.title}
                    </div>
                    <div style={{ fontSize: 12, marginBottom: 2 }}>{s.sub}</div>
                    <div style={{ fontSize: 11, color: '#666', marginBottom: 2 }}>
                      User ID: {s.uploadedBy || "Unknown"}
                    </div>
                    <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Rarity: {s.rarity}</div>
                    {s.image_url ? (
                      <img
                        src={s.image_url}
                        alt={s.title}
                        style={{ 
                          width: '100%', 
                          height: 100, 
                          marginTop: 5, 
                          borderRadius: 4,
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.warn("Failed to load image:", s.image_url);
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div style={{ fontSize: 10, marginTop: 4, color: '#666' }}>
                      {s.coord.lat.toFixed(4)}, {s.coord.lng.toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Heatmap Layer - Using custom component with leaflet.heat directly */}
            {showHeatmap && heatmapPoints.length > 0 && HeatmapLayer && (
              <HeatmapLayer
                points={heatmapPoints}
                radius={25}
                blur={15}
                max={1.0}
              />
            )}

            {/* Click to choose coordinates */}
            <ClickHandler
              onClick={(latlng) => {
                setPendingCoord({ lat: latlng.lat, lng: latlng.lng });
              }}
            />
          </MapContainer>
        </View>

        {/* Selected point info */}
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>
            Click on the map to choose a location for a new sighting.
          </Text>
          {pendingCoord && (
            <Text style={{ fontSize: 12, color: "#374151", marginTop: 2, fontWeight: "bold" }}>
              Selected: {pendingCoord.lat.toFixed(5)}, {pendingCoord.lng.toFixed(5)}
            </Text>
          )}
        </View>
      </View>

      {/* CARD 2 – ADD + LIST */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Manage sightings</Text>

        {/* Add new point */}
        <View style={styles.addRow}>
          <View style={styles.addCol}>
            <Text style={styles.label}>Description / Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Shorea macrophylla"
              value={newTitle}
              onChangeText={setNewTitle}
            />
          </View>
          <View style={styles.addCol}>
            <Text style={styles.label}>Species</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dipterocarpaceae"
              placeholderTextColor={COLORS.muted}
              value={newSub}
              onChangeText={setNewSub}
            />
          </View>
        </View>
        <View style={styles.addRow}>
          <View style={styles.addCol}>
            <Text style={styles.label}>Rarity</Text>
            <View style={styles.pickerContainer}>
              <select
                value={newRarity}
                onChange={(e) => setNewRarity(e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 10,
                  border: '1px solid #d1d5db',
                  fontSize: 13,
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="Common">Common</option>
                <option value="Uncommon">Uncommon</option>
                <option value="Rare">Rare (Location Masked)</option>
                <option value="Endangered">Endangered (Location Masked)</option>
              </select>
            </View>
          </View>
          <View style={styles.addCol}>
            <Text style={styles.label}>Image</Text>
            <TouchableOpacity onPress={pickImage} style={styles.uploadBtn}>
              <Text style={styles.uploadBtnText}>
                {selectedImage ? "Change Image" : "Upload Image"}
              </Text>
            </TouchableOpacity>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleAdd}
          style={[
            styles.primaryBtn,
            (!pendingCoord || !newTitle.trim()) && { opacity: 0.6 },
          ]}
          disabled={!pendingCoord || !newTitle.trim()}
        >
          <Text style={styles.primaryBtnText}>Add sighting at selected point</Text>
        </TouchableOpacity>

        <View style={styles.resultsHeader}>
          <Text style={{ color: COLORS.muted }}>
            Showing {filtered.length} of {allSightings.length} points
          </Text>
          {loading && <ActivityIndicator size="small" />}
        </View>

        {/* List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.row}>
              {item.image_url ? (
                <S3Image
                  source={item.image_url}
                  style={{ width: 50, height: 50, borderRadius: 4, marginRight: 10 }}
                  resizeMode="cover"
                  fallback={
                    <View style={{ width: 50, height: 50, borderRadius: 4, marginRight: 10, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 8, color: '#999' }}>No Img</Text>
                    </View>
                  }
                />
              ) : (
                <View style={{ width: 50, height: 50, borderRadius: 4, marginRight: 10, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 8, color: '#999' }}>No Img</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>
                  {item.isMasked && "🔒 "} {item.title}
                </Text>
                <Text style={styles.rowSub}>{item.sub}</Text>
                <Text style={styles.rowMeta}>Rarity: {item.rarity}</Text>
                <Text style={styles.rowMeta}>
                  User ID: {item.uploadedBy}
                </Text>
                <Text style={styles.rowMeta}>{item.uploadedAtLabel}</Text>
                <Text style={styles.rowMeta}>
                  Lat: {item.coord.lat.toFixed(4)}, Lng: {item.coord.lng.toFixed(4)}
                </Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'flex-end', gap: 6 }}>
                {showAdminView && (
                  <TouchableOpacity
                    onPress={() => handleMaskToggle(item)}
                    style={[
                      styles.smallBtn,
                      item.isMasked ? styles.unmaskBtn : styles.maskBtn,
                    ]}
                  >
                    <Text style={styles.smallBtnText}>
                      {item.isMasked ? "Unmask" : "Mask"}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={[styles.smallBtn, styles.deleteBtn]}
                >
                  <Text style={styles.smallBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: COLORS.text,
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  filterCol: {
    flex: 1,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  chipActive: {
    borderColor: COLORS.surface,
    backgroundColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  chipTextActive: {
    color: COLORS.text,
    fontWeight: "600",
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    fontSize: 13,
    color: COLORS.text,
    placeholderTextColor: COLORS.muted, // Gray placeholder
  },
  mapBox: {
    height: 360,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 4,
  },
  addRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
    marginTop: 8,
  },
  addCol: {
    flex: 1,
  },
  primaryBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 13,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: "center"
  },
  rowTitle: {
    fontWeight: "600",
    color: COLORS.text,
  },
  rowSub: {
    fontSize: 12,
    color: COLORS.muted,
  },
  rowMeta: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },
  smallBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  smallBtnText: {
    fontSize: 11,
    color: COLORS.white,
  },
  maskBtn: {
    backgroundColor: COLORS.surface,
  },
  unmaskBtn: {
    backgroundColor: COLORS.primary,
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  adminToggle: {
    backgroundColor: COLORS.primary + "40", // 40% opacity
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  adminToggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  uploadBtn: {
    backgroundColor: COLORS.primary + "30", // 30% opacity
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  uploadBtnText: {
    color: COLORS.text,
    fontSize: 13,
  },
  previewImage: {
    width: "100%",
    height: 100,
    marginTop: 8,
    borderRadius: 8,
    resizeMode: "cover",
  },
});

export default MapPage;
