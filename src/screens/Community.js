// src/screens/Community.js
import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/community';
import { useScrollHide } from '../hooks/useScrollHide';

const MOCK_POSTS = [
  { id: 'p1', user: { name: 'Aiman', avatar: null }, speciesName: 'Shorea macrophylla', rarity: 'rare', location: 'Bako National Park', time: '2h', photo: null, caption: 'Found along the riverbank. Nuts scattered around!', tags: ['leaf', 'whole'], likes: 18, comments: 4 },
  { id: 'p2', user: { name: 'Bella', avatar: null }, speciesName: 'Eurycoma longifolia', rarity: 'rare', location: 'Kubang, Kuching', time: '5h', photo: null, caption: 'Understory clump near trail. Marked location for review.', tags: ['leaf', 'bark'], likes: 41, comments: 12 },
  { id: 'p3', user: { name: 'Chen', avatar: null }, speciesName: 'Avicennia alba', rarity: 'common', location: 'Kuching Wetlands NP', time: '1d', photo: null, caption: 'Healthy mangrove fringe — great for coastal protection.', tags: ['whole'], likes: 9, comments: 1 },
];

export default function Community({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isVisible, handleScroll } = useScrollHide();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all | common | rare | mine
  const [donationAmount, setDonationAmount] = useState('20'); // RM 20 default
  
  const headerHeight = insets.top + 16 + 2 + 80;
  const footerHeight = insets.bottom + 18 + 2 + 60;
  const QUICK_AMOUNTS = ['5', '10', '20', '50'];

  const handleDonate = useCallback(async () => {
    try {
      navigation?.navigate?.('Donate'); // comment out if no Donate route yet
      return;
    } catch (e) {}
    const url = 'https://example.org/donate'; // TODO: replace with real URL
    const ok = await Linking.canOpenURL(url);
    if (ok) Linking.openURL(url);
    else Alert.alert('Donation', 'Unable to open donation page right now.');
  }, [navigation]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_POSTS.filter((p) => {
      const matchFilter =
        filter === 'all'
          ? true
          : filter === 'mine'
          ? p.user.name === 'Aiman'
          : p.rarity === filter;
      const matchQuery =
        !q ||
        p.speciesName.toLowerCase().includes(q) ||
        p.caption.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [query, filter]);

  const renderPost = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={16} color="#0f5132" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName} numberOfLines={1}>{item.user.name}</Text>
          <Text style={styles.meta} numberOfLines={1}>{item.location} • {item.time}</Text>
        </View>
        <View style={[styles.rarityPill, item.rarity === 'rare' ? styles.rare : styles.common]}>
          <Text style={[styles.rarityText, item.rarity === 'rare' ? styles.rareText : styles.commonText]}>
            {item.rarity === 'rare' ? 'Rare' : 'Common'}
          </Text>
        </View>
      </View>

      <Text style={styles.species} numberOfLines={1}>{item.speciesName}</Text>
      <Text style={styles.caption}>{item.caption}</Text>

      <View style={styles.photoWrap}>
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]}>
            <MaterialCommunityIcons name="image-outline" size={28} color="#94a3b8" />
          </View>
        )}
      </View>

      <View style={styles.tagRow}>
        {item.tags.map((t) => (
          <View style={styles.tag} key={`${item.id}-${t}`}>
            <Text style={styles.tagText}>{t}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
          <Ionicons name="heart-outline" size={18} color="#0F172A" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
          <Ionicons name="chatbubble-ellipses-outline" size={18} color="#0F172A" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { marginLeft: 'auto' }]} activeOpacity={0.85}>
          <Ionicons name="share-social-outline" size={18} color="#0F172A" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // ⬇️ Donation as a footer component (so it stays at the bottom)
  const renderDonation = () => (
    <View style={[styles.donateCard, { marginTop: 8, marginBottom: 16 }]}>
      <View style={styles.donateHeader}>
        <View style={styles.donateIcon}>
          <Ionicons name="heart" size={16} color="#fff" />
        </View>
        <Text style={styles.donateTitle}>Support Conservation</Text>
      </View>

      <Text style={styles.donateSubtitle}>
        Help fund biodiversity mapping, expert verification, and community education in Sarawak.
      </Text>

      <View style={styles.amountRow}>
        {['5', '10', '20', '50'].map((amt) => {
          const active = donationAmount === amt;
          return (
            <TouchableOpacity
              key={amt}
              style={[styles.amountChip, active && styles.amountChipActive]}
              onPress={() => setDonationAmount(amt)}
              activeOpacity={0.85}
            >
              <Text style={[styles.amountText, active && styles.amountTextActive]}>RM {amt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.customRow}>
        <TextInput
          style={styles.customInput}
          keyboardType="numeric"
          placeholder="Custom amount (RM)"
          placeholderTextColor="rgba(0,0,0,0.45)"
          value={donationAmount}
          onChangeText={setDonationAmount}
        />
        <TouchableOpacity style={styles.donateBtn} onPress={handleDonate} activeOpacity={0.9}>
          <Ionicons name="card" size={16} color="#fff" />
          <Text style={styles.donateBtnText}>Donate</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressWrap}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '62%' }]} />
        </View>
        <Text style={styles.progressText}>RM 6,200 raised of RM 10,000 goal</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.page} edges={['left', 'right']}>
      <Header navigation={navigation} isVisible={isVisible} />

      {/* Top controls */}
      <View style={styles.controls}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#64748B" style={{ marginHorizontal: 6 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search species, captions, locations…"
            placeholderTextColor="rgba(0,0,0,0.45)"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>

        <View style={styles.filterRow}>
          {['all', 'common', 'rare', 'mine'].map((key) => (
            <TouchableOpacity
              key={key}
              style={[styles.chip, filter === key && styles.chipActive]}
              onPress={() => setFilter(key)}
              activeOpacity={0.85}
            >
              <Text style={[styles.chipText, filter === key && styles.chipTextActive]}>
                {key === 'all' ? 'All' : key === 'mine' ? 'My Posts' : key[0].toUpperCase() + key.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Feed with donation at the bottom */}
      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        renderItem={renderPost}
        contentContainerStyle={[
          styles.list,
          {
            paddingTop: headerHeight + 10,
            paddingBottom: footerHeight + 24,
          }
        ]}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderDonation}              // 👈 donation footer lives here
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation?.navigate?.('Capture')}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={22} color="#fff" />
      </TouchableOpacity>

      <Footer
        activeTab="Home"
        isVisible={isVisible}
        navigation={navigation}
        onTabPress={(id) => {
          const route = { Home: 'Home', Identify: 'Identify', Map: 'Map', Profile: 'Profile' }[id];
          if (route) navigation?.navigate?.(route);
        }}
      />
    </SafeAreaView>
  );
}
