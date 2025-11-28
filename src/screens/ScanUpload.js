// src/screens/ScanUpload.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";

import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/ScanUpload";
import { useScrollHide } from "../hooks/useScrollHide";
import { getPresignedUrl, identifyPlant, getPlantHistory, submitFeedback } from "../services/apiService";
import * as Location from 'expo-location';
import { findPlantByScientificName } from "../data/plantDetails";
import { getStoredUserData, getCurrentAuthenticatedUser } from "../services/authService";

export default function ScanUpload({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { isVisible, handleScroll } = useScrollHide();
  const isFocused = useIsFocused();
  
  const headerHeight = insets.top + 16 + 2 + 80;
  const footerHeight = insets.bottom + 18 + 2 + 60;

  const [activeTab, setActiveTab] = useState("Identify");
  const [image, setImage] = useState(null); // { uri }
  const [isUploading, setUploading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [uploads, setUploads] = useState([]); // newest → oldest
  const [user, setUser] = useState(route?.params?.user || null);
  
  // Load user data from storage if not provided in route params
  const loadUser = useCallback(async () => {
    // First check route params
    if (route?.params?.user) {
      setUser(route.params.user);
      return;
    }

    // Try to get stored user data
    try {
      const storedUser = await getStoredUserData();
      if (storedUser) {
        setUser(storedUser);
        return;
      }

      // Try to get current authenticated user
      const authResult = await getCurrentAuthenticatedUser();
      if (authResult.success && authResult.user) {
        setUser(authResult.user);
        return;
      }
    } catch (error) {
      console.error('Error loading user in ScanUpload:', error);
    }
  }, [route?.params?.user]);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Reload user when screen comes into focus (in case user logged in from another screen)
  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
  );

  // Get userID from user object (could be userId, id, or cognitoUserId)
  const userID = user?.userId || user?.id || user?.cognitoUserId || null;

  // --- Permissions
  const ensureMediaPermission = async () => {
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!lib.granted) {
      Alert.alert("Permission needed", "Media library access is required.");
      return false;
    }
    return true;
  };
  const ensureCameraPermission = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    if (!cam.granted) {
      Alert.alert("Permission needed", "Camera access is required.");
      return false;
    }
    return true;
  };

  // --- Pickers
  const pickFromGallery = async () => {
    if (!(await ensureMediaPermission())) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setImage({ uri: result.assets[0].uri });
  };

  const takePhoto = async () => {
    if (!(await ensureCameraPermission())) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setImage({ uri: result.assets[0].uri });
  };

  // Convert image URI to base64 (for fallback if presigned URL fails)
  const imageToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result;
          // Remove data URL prefix if present
          const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  };

  // Upload file -> then refresh list
  const uploadAsset = async () => {
    if (!image?.uri) return Alert.alert("No image", "Please choose an image first.");
    if (!userID) return Alert.alert("Error", "Please log in to upload images.");

    setUploading(true);
    try {
      // Get location (optional)
      let location = null;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          location = {
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
          };
        }
      } catch (locError) {
        console.warn('Location error (non-critical):', locError);
      }

      // Step 1: Get presigned URL from Lambda
      const presignResult = await getPresignedUrl(userID, 'image/jpeg', 300);
      if (!presignResult.success) {
        throw new Error(presignResult.error || 'Failed to get upload URL');
      }

      const { uploadUrl, imageKey, plantID } = presignResult.data;

      // Step 2: Upload image to S3 using presigned URL
      const imageResponse = await fetch(image.uri);
      const imageBlob = await imageResponse.blob();
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: imageBlob,
        headers: {
          'Content-Type': 'image/jpeg',
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image to S3');
      }

      // Step 3: Call identify endpoint
      const identifyResult = await identifyPlant({
        userID,
        imageKey,
        location,
      });

      if (!identifyResult.success) {
        throw new Error(identifyResult.error || 'Failed to identify plant');
      }

      const { species, confidence, imageUrl } = identifyResult.data;

      // Try to find the plant in the encyclopedia
      const matchedPlant = findPlantByScientificName(species);

      if (matchedPlant) {
        Alert.alert(
          "Plant Identified!",
          `${species} (${Math.round((confidence || 0) * 100)}% confidence)\n\nWould you like to view more details?`,
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "View Details",
              onPress: () => {
                // Navigate to PlantDetails page with the matched plant
                if (navigation && matchedPlant) {
                  navigation.navigate("PlantDetails", { 
                    plant: {
                      id: matchedPlant.id,
                      name: matchedPlant.scientificName,
                      subtitle: matchedPlant.commonName,
                      image: matchedPlant.heroImage
                    }
                  });
                }
              }
            }
          ]
        );
      } else {
        Alert.alert(
          "Plant Identified!",
          `${species} (${Math.round((confidence || 0) * 100)}% confidence)`
        );
      }

      setImage(null);
      await fetchAllUploads();
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Upload error", err.message || "Network request failed");
    } finally {
      setUploading(false);
    }
  };

  // Fetch ALL uploads from Lambda
  const fetchAllUploads = useCallback(async () => {
    if (!userID) {
      setUploads([]);
      return;
    }

    setLoadingList(true);
    try {
      const historyResult = await getPlantHistory(userID);
      
      if (historyResult.success && historyResult.data?.items) {
        // Transform DynamoDB items to app format
        const transformed = historyResult.data.items.map((item) => {
          // DynamoDB items have type annotations (S, N, etc.)
          const extractValue = (val) => {
            if (!val) return null;
            if (val.S) return val.S;
            if (val.N) return parseFloat(val.N);
            if (val.BOOL !== undefined) return val.BOOL;
            return val;
          };

          return {
            plantID: extractValue(item.plantID),
            id: extractValue(item.plantID),
            imageUrl: extractValue(item.imageUrl),
            imageS3Path: extractValue(item.imageS3Path),
            species: extractValue(item.species),
            confidence: extractValue(item.confidence),
            timestamp: extractValue(item.timestamp),
            createdAt: extractValue(item.createdAt || item.timestamp),
            status: extractValue(item.status),
            // For backward compatibility
            file_name: extractValue(item.imageS3Path)?.split('/').pop() || 'image.jpg',
            species_identified: extractValue(item.species),
            confidence_score: extractValue(item.confidence),
            created_at: extractValue(item.createdAt || item.timestamp),
          };
        });
        
        setUploads(transformed);
      } else {
        setUploads([]);
      }
    } catch (err) {
      console.log("Fetch uploads error:", err);
      setUploads([]);
    } finally {
      setLoadingList(false);
    }
  }, [userID]);

  useEffect(() => {
    fetchAllUploads();
  }, [fetchAllUploads]);

  // --- UI
  return (
    <SafeAreaView style={styles.page} edges={['left', 'right']}>
      <Header navigation={navigation} isVisible={isVisible} />

      <ScrollView 
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: headerHeight + 20,
            paddingBottom: footerHeight + 40,
          }
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.header}>Scan / Upload Plant</Text>

        {/* Preview area */}
        <View style={styles.previewBox}>
          {image?.uri ? (
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
          ) : uploads?.[0]?.imageUrl ? (
            <>
              <Text style={styles.previewLabel}>Most recent upload</Text>
              <Image
                source={{ uri: uploads[0].imageUrl }}
                style={styles.previewImage}
              />
            </>
          ) : (
            <Text style={styles.placeholder}>No image selected</Text>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.actionBtn} onPress={pickFromGallery}>
            <Ionicons name="image-outline" size={18} color="#fff" />
            <Text style={styles.actionText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={takePhoto}>
            <Ionicons name="camera-outline" size={18} color="#fff" />
            <Text style={styles.actionText}>Camera</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.uploadBtn, isUploading && { opacity: 0.7 }]}
          onPress={uploadAsset}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
              <Text style={styles.uploadText}>Upload</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* ALL Uploads */}
        <Text style={styles.subHeader}>Your Uploads</Text>
        {loadingList ? (
          <ActivityIndicator />
        ) : !userID ? (
          <Text style={styles.placeholderSmall}>
            Please log in to view your upload history.
          </Text>
        ) : uploads.length === 0 ? (
          <Text style={styles.placeholderSmall}>No uploads yet.</Text>
        ) : (
          uploads.map((u) => {
            // Try to find the plant in the encyclopedia
            const matchedPlant = u.species ? findPlantByScientificName(u.species) : null;
            
            return (
              <TouchableOpacity
                key={u.plantID || u.id}
                style={styles.lastBox}
                onPress={() => {
                  if (matchedPlant) {
                    navigation?.navigate?.("PlantDetails", {
                      plant: {
                        id: matchedPlant.id,
                        name: matchedPlant.scientificName,
                        subtitle: matchedPlant.commonName,
                        image: matchedPlant.heroImage
                      }
                    });
                  } else if (u.species) {
                    // If plant not found, navigate to Encyclopedia with search query
                    navigation?.navigate?.("Encyclopedia", { q: u.species });
                  }
                }}
                activeOpacity={matchedPlant || u.species ? 0.7 : 1}
              >
                <Image
                  source={{ uri: u.imageUrl || u.imageS3Path || '' }}
                  style={styles.lastImage}
                />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.lastName} numberOfLines={1}>
                      {u.species || 'Unknown Plant'}
                    </Text>
                    {(matchedPlant || u.species) && (
                      <Ionicons name="chevron-forward" size={16} color="#0f5132" />
                    )}
                  </View>
                  <Text style={styles.lastTime}>
                    {u.timestamp || u.createdAt || u.created_at 
                      ? new Date(u.timestamp || u.createdAt || u.created_at).toLocaleString()
                      : 'Unknown date'}
                  </Text>
                  {u.species && u.confidence && (
                    <Text style={styles.lastMeta}>
                      {u.species} — {Math.round((u.confidence || u.confidence_score || 0) * 100)}%
                    </Text>
                  )}
                  {matchedPlant && (
                    <Text style={[styles.lastMeta, { color: '#0f5132', marginTop: 4 }]}>
                      Tap to view details
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <Footer
        activeTab={activeTab}
        isVisible={isVisible}
        navigation={navigation}
        onTabPress={(id) => {
          setActiveTab(id);
          const routeMap = {
            Home: "Home",
            Identify: "Identify",
            Map: "Map",
            Profile: "Profile", // Screen is registered as 'Profile' in App.js
          };
          const r = routeMap[id];
          if (r) navigation?.navigate?.(r);
        }}
      />
    </SafeAreaView>
  );
}
