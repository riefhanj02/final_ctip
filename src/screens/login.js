import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/login';
import { useScrollHide } from '../hooks/useScrollHide';
import { loginUser, getStoredUserData, isAuthenticated } from '../services/authService';

export default function Login({ navigation }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('Home');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { isVisible, handleScroll } = useScrollHide();
  
  const headerHeight = insets.top + 16 + 2 + 80;
  const footerHeight = insets.bottom + 18 + 2 + 60;

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (authenticated) {
          const storedUser = await getStoredUserData();
          if (storedUser) {
            // User is already logged in, navigate to profile
            navigation.replace('Profile', { user: storedUser });
            return;
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      console.log('[Login Screen] Attempting login...');
      const result = await loginUser(email.trim(), password);
      console.log('[Login Screen] Login result:', result);

      if (result.success) {
        console.log('[Login Screen] Login successful, navigating to Profile');
        Alert.alert('Success', `Welcome back, ${result.user?.username || result.user?.email || 'user'}!`);
        // Navigate to Profile with user data (replace to prevent going back to login)
        navigation.replace('Profile', { user: result.user });
      } else {
        console.error('[Login Screen] Login failed:', result.error);
        Alert.alert('Login Failed', result.error || 'Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      console.error('[Login Screen] Unexpected error:', err);
      Alert.alert('Error', err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <SafeAreaView style={styles.page} edges={['left', 'right']}>
        <Header navigation={navigation} isVisible={isVisible} />
        <View style={[styles.pageInner, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={styles.button?.backgroundColor || '#0f5132'} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page} edges={['left', 'right']}>
      {/* Header OUTSIDE scroll so it aligns with other pages */}
      <Header navigation={navigation} isVisible={isVisible} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.pageInner,
          {
            paddingTop: headerHeight + 20,
            paddingBottom: footerHeight + 24,
          }
        ]}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Welcome back</Text>
          <Text style={styles.heroSubtitle}>
            Sign in to sync your sightings, contribute identifications, and access your profile.
          </Text>
        </View>

        {/* Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin} 
            activeOpacity={0.9}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.switchRow}>
            <Text style={styles.switchText}>Don’t have an account? </Text>
            <Text style={styles.switchLink}>Register</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
            <Footer
              activeTab={activeTab}
              isVisible={isVisible}
              navigation={navigation}
              onTabPress={(id) => {
                setActiveTab(id);
                const route = { Home: 'Home', Identify: 'Identify', Community: 'Map', Profile: 'Profile' }[id];
                if (route) navigation?.navigate?.(route);
              }}
            />
    </SafeAreaView>
  );
}
