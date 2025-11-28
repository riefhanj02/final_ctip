import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, FlatList, Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/map';
import { colors } from '../theme/colors';
import { useScrollHide } from '../hooks/useScrollHide';

import { getSightings } from '../services/apiService';
// import { useFocusEffect } from '@react-navigation/native';

// Filters you already had
const FILTERS = ['All', 'Common', 'Rare', 'Mangrove', 'Lowland', 'Montane', 'Recent'];

// --- Kuching base region (tight city view) ---
const KUCHING_REGION = {
  latitude: 1.5533,        // Kuching ~ Waterfront
  longitude: 110.3592,
  latitudeDelta: 0.18,     // zoom level (smaller = closer)
  longitudeDelta: 0.18,
};

// Demo sightings removed - using API
const SIGHTINGS = [];

const rarityColor = (r) => (r === 'Rare' ? '#EF4444' : r === 'Vulnerable' ? '#F59E0B' : colors.primary);

export default function Map({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Map');
  const [q, setQ] = useState('');
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [region, setRegion] = useState(KUCHING_REGION);
  const [myLoc, setMyLoc] = useState(null);
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const { isVisible, handleScroll } = useScrollHide();

  const headerHeight = insets.top + 16 + 2 + 80;
  const footerHeight = insets.bottom + 18 + 2 + 60;

  // location permission (optional)
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const pos = await Location.getCurrentPositionAsync({});
        setMyLoc({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      } catch { }
    })();
  }, []);

  // Fetch sightings from API
  const fetchSightings = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSightings({
        lat: region.latitude,
        lng: region.longitude,
        radius: 50, // 50km radius
        filter: activeFilter
      });

      if (result.success && Array.isArray(result.data)) {
        setSightings(result.data);
      } else {
        // Fallback to empty if failed
        setSightings([]);
      }
    } catch (err) {
      console.error('Failed to fetch sightings:', err);
    } finally {
      setLoading(false);
    }
  }, [region.latitude, region.longitude, activeFilter]);

  // Initial fetch and refresh on filter change
  useEffect(() => {
    fetchSightings();
  }, [activeFilter]);

  // Removed useFocusEffect to prevent potential loops/crashes during debug
  // We can re-add it later or use a "Search Here" button


  // search + filter for local filtering of fetched results (optional, if API returns more than needed)
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    const now = Date.now();

    // If API handles filtering, we might just return sightings. 
    // But let's keep client-side search for 'q' (text search) since API might only do category.
    return sightings.filter((s) => {
      const matchesText =
        !text || s.title.toLowerCase().includes(text) || s.sub.toLowerCase().includes(text);

      // We assume API handled the category filter, but double check or just rely on API.
      // If API returns everything, we filter here. 
      // For now, let's assume API does the heavy lifting for category, but we do text search here.

      return matchesText;
    });
  }, [q, sightings]);

  // fit to currently filtered pins
  useEffect(() => {
    if (!mapRef.current || filtered.length === 0) return;
    const coords = filtered.map((s) => s.coord);
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 80, right: 60, bottom: 80, left: 60 },
      animated: true,
    });
  }, [filtered]);

  const centerOnMe = () => {
    if (!mapRef.current || !myLoc) {
      Alert.alert('Location', 'Location not available yet.');
      return;
    }
    mapRef.current.animateCamera({ center: myLoc, zoom: 14 }, { duration: 600 });
  };

  return (
    <SafeAreaView style={styles.page} edges={['left', 'right']}>
      <Header navigation={navigation} isVisible={isVisible} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.inner,
          {
            paddingTop: headerHeight + 20,
            paddingBottom: footerHeight + 24,
          }
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* HERO */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <MaterialCommunityIcons name="map-search" size={26} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>Explore Kuching Map</Text>
          <Text style={styles.heroSubtitle}>
            Sightings and hotspots around Kuching, Sarawak.
          </Text>
        </View>

        {/* SEARCH */}
        <View style={styles.searchRow}>
          <Ionicons name="search" size={20} color="rgba(0,0,0,0.5)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search species, locations…"
            placeholderTextColor="rgba(0,0,0,0.4)"
            value={q}
            onChangeText={setQ}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchBtn} activeOpacity={0.88}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* FILTER CHIPS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {FILTERS.map((f) => {
            const active = f === activeFilter;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.9}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* MAP (Kuching-focused) */}
        <View style={{ height: 320, borderRadius: 14, overflow: 'hidden', backgroundColor: '#e5efe9' }}>
          <MapView
            ref={mapRef}
            style={{ width: '100%', height: '100%' }}
            initialRegion={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation={!!myLoc}
            showsMyLocationButton={false}
          // keep default provider for Expo Go; only set Google if you build a dev client with keys
          // provider={MapView.PROVIDER_DEFAULT}
          >
            {filtered.map((s) => (
              <Marker key={s.id} coordinate={s.coord} pinColor={rarityColor(s.rarity)}>
                <Callout onPress={() => navigation.navigate('PlantDetails', { id: s.id })}>
                  <View style={{ maxWidth: 220 }}>
                    <Text style={{ fontWeight: '700', marginBottom: 2 }}>{s.title}</Text>
                    <Text style={{ color: '#475569', marginBottom: 6 }}>{s.sub}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="navigate" size={12} color="#0F172A" />
                      <Text style={{ marginLeft: 4, color: '#0F172A' }}>{s.distance}</Text>
                    </View>
                    <Text style={{ marginTop: 6, color: '#0ea5e9' }}>View details ›</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

          {/* Center-on-me */}
          <TouchableOpacity
            style={{
              position: 'absolute', right: 10, bottom: 10,
              backgroundColor: '#fff', borderRadius: 18, padding: 10, elevation: 2,
            }}
            onPress={centerOnMe}
            activeOpacity={0.9}
          >
            <Ionicons name="locate" size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* LIST HEADER */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Nearby Sightings</Text>
          <TouchableOpacity onPress={() => { }}>
            <Text style={styles.listLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* LIST */}
        <FlatList
          data={filtered}
          keyExtractor={(it) => it.id}
          scrollEnabled={false}
          contentContainerStyle={styles.cardList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => mapRef.current?.animateCamera({ center: item.coord, zoom: 15 }, { duration: 600 })}
            >
              <View style={styles.cardIconWrap}>
                <Ionicons name="leaf" size={20} color={rarityColor(item.rarity)} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.sub}</Text>
              </View>
              <View style={styles.distancePill}>
                <Ionicons name="navigate" size={12} color="#0F172A" />
                <Text style={styles.distanceText}>{item.distance}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <View style={{ height: 28 }} />
      </ScrollView>

      <Footer
        navigation={navigation}
        activeTab={activeTab}
        isVisible={isVisible}
        onTabPress={(id) => {
          setActiveTab(id);
          const route = { Home: 'Home', Identify: 'Identify', Map: 'Map', Profile: 'Profile' }[id];
          if (route) navigation?.navigate?.(route);
        }}
      />
    </SafeAreaView>
  );
}
