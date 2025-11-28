// screens/Homepage.js
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/homepage';
import { getPlantDetails } from '../data/plantDetails';
import { TEAM } from '../data/team';
import { useScrollHide } from '../hooks/useScrollHide';

export default function Homepage({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Home');
  const [query, setQuery] = useState('');
  const { isVisible, handleScroll } = useScrollHide();
  
  // Calculate header and footer heights for padding
  const headerHeight = insets.top + 16 + 2 + 80; // status bar + padding + logo height
  const footerHeight = insets.bottom + 18 + 2 + 60; // safe area + padding + tab height

  const onSearch = () => {
    const q = query.trim();
    if (!q) return;
    navigation?.navigate?.('Encyclopedia', { q });
  };

  const featuredIds = [1, 6, 9, 12, 22, 83]; // Alstonia, Eurycoma, Shorea pinanga, Calophyllum, Shorea macrophylla, Avicennia alba
  const featured = useMemo(
    () =>
      featuredIds
        .map((id) => ({ id, ...getPlantDetails(id) }))
        .filter(Boolean),
    []
  );

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation?.navigate?.('PlantDetails', { id: item.id })}
    >
      <Image source={item.heroImage} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.commonName}</Text>
        <Text style={styles.cardSubtitle}>{item.scientificName}</Text>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={styles.cardIntro}
        >
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Header navigation={navigation} isVisible={isVisible} />

      <LinearGradient
        colors={['rgba(86,204,242,0.18)', 'rgba(16,185,129,0.10)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBg}
        pointerEvents="none"   
      />

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={[
          styles.contentInner,
          {
            paddingTop: headerHeight + 20,
            paddingBottom: footerHeight + 28,
          }
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* HERO */}
        <View style={styles.heroCard}>
          <View style={styles.heroTextWrap}>
            <Text style={styles.title}>SmartPlant Sarawak</Text>
            <Text style={styles.subtitle}>
              Discover, identify & protect Sarawak’s plant biodiversity with AI, maps, and community validation.
            </Text>
          </View>
          <View style={styles.heroBadge}>
            <MaterialCommunityIcons name="sprout" size={26} color="#fff" />
          </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#8A8A8A" style={styles.searchIcon} />
          <TextInput
            placeholder="Search plants, species..."
            placeholderTextColor="rgba(0,0,0,0.45)"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={onSearch}
          />
          <TouchableOpacity style={styles.searchBtn} activeOpacity={0.88} onPress={onSearch}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Plants</Text>
          <TouchableOpacity onPress={() => navigation?.navigate?.('Encyclopedia')}>
            <Text style={styles.sectionLink}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal card list */}
        <FlatList
          data={featured}
          keyExtractor={(it) => String(it.id)}
          renderItem={renderCard}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsHorizontal}
        />

        {/* QUICK ACTIONS */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.9}
            onPress={() => navigation?.navigate?.('Identify')}
          >
            <Ionicons name="scan" size={22} color="#0f5132" />
            <Text style={styles.quickTitle}>Identify Plant</Text>
            <Text style={styles.quickDesc}>Take a photo, get AI suggestions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.9}
            onPress={() => navigation?.navigate?.('Map')}
          >
            <Ionicons name="map" size={22} color="#0f5132" />
            <Text style={styles.quickTitle}>Explore Map</Text>
            <Text style={styles.quickDesc}>Sightings, filters & heatmap</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.9}
            onPress={() => navigation?.navigate?.('Community')}
          >
            <Ionicons name="people" size={22} color="#0f5132" />
            <Text style={styles.quickTitle}>Community Review</Text>
            <Text style={styles.quickDesc}>Validate labels, improve the model</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.9}
            onPress={() => navigation?.navigate?.('Security')}
          >
            <Ionicons name="shield-checkmark" size={22} color="#0f5132" />
            <Text style={styles.quickTitle}>Security & Privacy</Text>
            <Text style={styles.quickDesc}>Protected data & roles</Text>
          </TouchableOpacity>
        </View>

        {/* STATS */}
        <Text style={styles.statValue}>Statistic of This Project</Text>
        <View style={styles.statsWrap}>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Species</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>

        {/* ABOUT US (compact preview) */}
<View style={styles.aboutSection}>
  <View style={styles.aboutHeader}>
    <Text style={styles.aboutTitle}>Behind the Project</Text>
    <TouchableOpacity onPress={() => navigation?.navigate?.('AboutUs')}>
      <Text style={styles.aboutLink}>View All</Text>
    </TouchableOpacity>
  </View>

  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.aboutList}
  >
    {(TEAM || []).slice(0, 6).map((m) => (
      <TouchableOpacity
        key={m.id}
        activeOpacity={0.9}
        style={styles.aboutCard}
        onPress={() => navigation?.navigate?.('AboutUs')}
      >
        {/* avatar */}
        {!!m.image && <Image source={m.image} style={styles.aboutAvatar} />}
        {/* text */}
        <View style={styles.aboutBody}>
          <Text numberOfLines={1} style={styles.aboutName}>{m.name}</Text>
          <Text numberOfLines={1} style={styles.aboutMeta}>ID: {m.studentId}</Text>
          <Text numberOfLines={1} style={styles.aboutRole}>{m.major}</Text>
        </View>
      </TouchableOpacity>
    ))}
    
  </ScrollView>
</View>


</ScrollView>
      <Footer
        activeTab={activeTab}
        isVisible={isVisible}
        navigation={navigation}
        onTabPress={(id) => {
          setActiveTab(id);
          const route = { Home: 'Home', Identify: 'Identify', Map: 'Map', Profile: 'Profile' }[id];
          if (route) navigation?.navigate?.(route);
        }}
      />
</SafeAreaView>
)};
