// components/Footer.js
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { footer } from '../styles/footer';

export default function Footer({
  activeTab = 'Home',
  onTabPress,
  navigation,
  isLoggedIn = false,
  isVisible = true,
}) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;

  // Animate footer visibility based on scroll
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? 0 : 100,
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [isVisible, translateY]);
  // Make tab IDs match your tab route names EXACTLY
  const tabs = [
    { id: 'Home',     label: 'Home',     icon: 'home' },
    { id: 'Identify', label: 'Identify', icon: 'scan' },      // or 'ScanUpload' if that's the tab name
    { id: 'Map',      label: 'Map',      icon: 'map' },
    { id: 'Profile',  label: 'Profile',  icon: 'person-circle' },
  ];

  // Map tab IDs -> real route names in your navigators
  const ROUTES = {
    Home: 'Home',
    Identify: 'Identify',   // Screen is registered as 'Identify' in App.js
    Map: 'Map',
    Profile: isLoggedIn ? 'Profile' : 'Login',
  };

  const handlePress = (id) => {
    onTabPress?.(id);

    const target = ROUTES[id];
    if (!target || !navigation?.navigate) return;

    // Prefer direct navigation in the current container
    const state = navigation.getState?.();
    const routeNames = state?.routeNames || [];
    if (routeNames.includes(target)) {
      navigation.navigate(target);
      return;
    }

    // If you're using a root stack wrapping the tabs (e.g. RootStack with 'Tabs'),
    // then you can nest like:
    // navigation.navigate('Tabs', { screen: target });
    // Otherwise, DO NOT try to navigate to a non-existent 'Main'.
    navigation.navigate(target);
  };

  return (
    <Animated.View 
      style={[
        footer.container,
        {
          transform: [{ translateY }],
          opacity: isVisible ? 1 : 0,
          marginBottom: -insets.bottom,
          paddingBottom: insets.bottom + 18,
        }
      ]}
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      <View style={footer.navContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[footer.tab, isActive && footer.activeTab]}
              onPress={() => handlePress(tab.id)}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel={`${tab.label} tab`}
            >
              <Ionicons
                name={tab.icon}
                size={22}
                style={[footer.tabIcon, isActive && footer.activeTabIcon]}
              />
              <Text style={[footer.tabLabel, isActive && footer.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}
