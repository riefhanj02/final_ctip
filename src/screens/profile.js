import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from "../styles/profile";
import { getStoredUserData, getCurrentAuthenticatedUser, logoutUser } from '../services/authService';
import { useScrollHide } from '../hooks/useScrollHide';

// Try to load BASE_URL if you have ../config.js exporting default or named
let BASE_URL = "";
try {
  const cfg = require("../config");
  BASE_URL = cfg.default || cfg.BASE_URL || "";
} catch {
  // no config file — okay, run in demo mode (no network)
}

export default function Profile({ route, navigation }) {
  const { user: initialUser } = route?.params || {};
  const [user, setUser] = useState(initialUser || null);
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const { isVisible, handleScroll } = useScrollHide();

  const headerHeight = insets.top + 16 + 2 + 80;
  const footerHeight = insets.bottom + 18 + 2 + 60;

  // Load user data from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // First check route params
        if (initialUser) {
          setUser(initialUser);
          setLoading(false);
          return;
        }

        // Try to get stored user data
        const storedUser = await getStoredUserData();
        if (storedUser) {
          setUser(storedUser);
          setLoading(false);
          return;
        }

        // Try to get current authenticated user
        const authResult = await getCurrentAuthenticatedUser();
        if (authResult.success && authResult.user) {
          setUser(authResult.user);
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading user:', error);
        setLoading(false);
      }
    };

    loadUser();
  }, [initialUser]);

  // Refresh a lightweight copy for immediate UI
  useFocusEffect(
    useCallback(() => {
      if (user?.id && BASE_URL) {
        fetch(`${BASE_URL}/auth/getUser/${user.id}`)
          .then((res) => res.json())
          .then((data) => setUserData(data.user || user))
          .catch(() => setUserData(user));
      }
    }, [user])
  );

  // Hard refresh when coming back to this screen
  useEffect(() => {
    if (isFocused && user?.id && BASE_URL) {
      fetch(`${BASE_URL}/auth/getUser/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setUser(data.user);
        })
        .catch((err) => console.error("Error refreshing profile:", err));
    }
  }, [isFocused, user?.id]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigation.navigate("Login");
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login even if logout fails
      setUser(null);
      navigation.navigate("Login");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.page} edges={['left', 'right']}>
        <Header navigation={navigation} isVisible={isVisible} />
        <View style={[styles.container, { paddingTop: headerHeight + 20, justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={styles.primaryColor || '#0f5132'} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If no user data, show login prompt
  if (!user) {
    return (
      <SafeAreaView style={styles.page} edges={['left', 'right']}>
        <Header navigation={navigation} isVisible={isVisible} />
        <ScrollView
          contentContainerStyle={[
            styles.container,
            {
              paddingTop: headerHeight + 20,
              paddingBottom: footerHeight + 40,
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100%'
            }
          ]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.emptyStateContainer}>
            <Ionicons name="person-circle-outline" size={80} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>Welcome to SmartPlant</Text>
            <Text style={styles.emptyStateText}>
              Please log in to view your profile and access all features
            </Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Footer
          activeTab="Profile"
          isVisible={isVisible}
          navigation={navigation}
        />
      </SafeAreaView>
    );
  }

  const profileImage = (user.profile_pic && BASE_URL)
    ? { uri: `${BASE_URL}/uploads/${user.profile_pic}` }
    : require("../../assets/image/profile_pic.jpg");

  const displayName = user.real_name || user.realName || user.name || user.username || 'User';
  const displayEmail = user.email || '';
  const displayPhone = user.phone || user.phone_number || '';

  // Menu options
  const menuOptions = [
    {
      id: 'edit',
      icon: 'create-outline',
      label: 'Edit Profile',
      onPress: () => navigation.navigate("Editprofile", { user }),
      color: '#0f5132'
    },
    {
      id: 'identify',
      icon: 'camera-outline',
      label: 'Scan / Upload Plant',
      onPress: () => navigation.navigate("Identify", { user }),
      color: '#0f5132'
    },
    {
      id: 'history',
      icon: 'time-outline',
      label: 'Identification History',
      onPress: () => navigation.navigate("Identify", { user }),
      color: '#0f5132'
    },
    {
      id: 'settings',
      icon: 'settings-outline',
      label: 'Settings',
      onPress: () => { },
      color: '#0f5132'
    },
    {
      id: 'about',
      icon: 'information-circle-outline',
      label: 'About Us',
      onPress: () => navigation.navigate("AboutUs"),
      color: '#0f5132'
    },
    {
      id: 'logout',
      icon: 'log-out-outline',
      label: 'Log Out',
      onPress: handleLogout,
      color: '#DC2626'
    },
  ];

  return (
    <SafeAreaView style={styles.page} edges={['left', 'right']}>
      <Header navigation={navigation} isVisible={isVisible} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + 20,
            paddingBottom: footerHeight + 40,
          }
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <LinearGradient
          colors={['rgba(15, 81, 50, 0.1)', 'rgba(15, 81, 50, 0.05)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileHeaderCard}
        >
          <View style={styles.profileImageContainer}>
            <Image source={profileImage} style={styles.profileImage} />
            <View style={styles.profileImageBorder} />
          </View>

          <Text style={styles.profileName}>{displayName}</Text>

          {displayEmail && user?.email_visible && (
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={16} color="#6B7280" />
              <Text style={styles.infoText}>{displayEmail}</Text>
            </View>
          )}

          {displayPhone && (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={16} color="#6B7280" />
              <Text style={styles.infoText}>{displayPhone}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate("Editprofile", { user })}
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          {menuOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.menuItem}
              onPress={option.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: option.color + '15' }]}>
                  <Ionicons name={option.icon} size={22} color={option.color} />
                </View>
                <Text style={styles.menuItemText}>{option.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appName}>SmartPlant Sarawak</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      <Footer
        activeTab="Profile"
        isVisible={isVisible}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}
