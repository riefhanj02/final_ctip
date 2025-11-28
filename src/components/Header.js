// components/Header.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, Pressable, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { header } from '../styles/header';
import { colors } from '../theme/colors';

export default function Header({ navigation, isVisible = true }) {
  const insets = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState(false);
  const scale = useRef(new Animated.Value(0.95)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const openAnim = () => {
    Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  };
  const closeAnim = (onEnd) => {
    Animated.parallel([
      Animated.timing(scale, { toValue: 0.98, duration: 120, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 120, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    ]).start(({ finished }) => finished && onEnd?.());
  };

  useEffect(() => {
    if (menuVisible) openAnim();
    // reset values when hidden
    else { scale.setValue(0.95); opacity.setValue(0); }
  }, [menuVisible]);

  // Animate header visibility based on scroll
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? 0 : -100,
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [isVisible, translateY]);

  const toggleMenu = () => setMenuVisible((v) => !v);

  const go = (screen) => {
    closeAnim(() => {
      setMenuVisible(false);
      navigation?.navigate?.(screen);
    });
  };

  return (
    <Animated.View 
      style={[
        header.container,
        {
          transform: [{ translateY }],
          opacity: isVisible ? 1 : 0,
          marginTop: -insets.top,
          paddingTop: insets.top + 16,
        }
      ]}
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      <View style={header.navContainer}>
        {/* Left: Hamburger */}
        <TouchableOpacity style={header.iconBtn} onPress={toggleMenu} activeOpacity={0.85}>
          <Ionicons name="menu" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Center: Logo */}
        <Image source={require('../../assets/logo.png')} style={header.logo} />

        {/* Right: Actions */}
        <View style={header.actionsRow}>
          <TouchableOpacity style={header.iconBtn} onPress={() => navigation?.navigate?.('Encyclopedia')}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown */}
      {menuVisible && (
        <>
          <Pressable style={header.overlay} onPress={() => closeAnim(() => setMenuVisible(false))} />

          <Animated.View
            style={[
              header.menu,
              { transform: [{ scale }], opacity },
            ]}
          >
            {/* Profile header row */}
            <View style={header.menuHeader}>
              <View style={header.avatar}>
                <Ionicons name="leaf" size={18} color="#0f5132" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={header.userName}>Guest</Text>
                <Text style={header.userHint}>Sign in to sync collections</Text>
              </View>
              <TouchableOpacity onPress={() => go('Login')} style={header.chip}>
                <Text style={header.chipText}>Sign in</Text>
              </TouchableOpacity>
            </View>

            <View style={header.divider} />

            {/* Section: Explore */}
            <Text style={header.sectionLabel}>Explore</Text>
            <TouchableOpacity style={header.item} onPress={() => go('Home')}>
              <View style={header.itemLeft}>
                <Ionicons name="home" size={18} style={header.itemIcon} />
                <Text style={header.itemText}>Home</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} style={header.itemChevron} />
            </TouchableOpacity>

            <TouchableOpacity style={header.item} onPress={() => go('Encyclopedia')}>
              <View style={header.itemLeft}>
                <Ionicons name="book" size={18} style={header.itemIcon} />
                <Text style={header.itemText}>Plant Encyclopedia</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} style={header.itemChevron} />
            </TouchableOpacity>

            <TouchableOpacity style={header.item} onPress={() => go('Map')}>
              <View style={header.itemLeft}>
                <Ionicons name="map" size={18} style={header.itemIcon} />
                <Text style={header.itemText}>Map</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} style={header.itemChevron} />
            </TouchableOpacity>

            <View style={header.divider} />

            {/* Section: Community */}
            <Text style={header.sectionLabel}>Community</Text>
            <TouchableOpacity style={header.item} onPress={() => go('Community')}>
              <View style={header.itemLeft}>
                <Ionicons name="people" size={18} style={header.itemIcon} />
                <Text style={header.itemText}>Contribute</Text>
              </View>
              <View style={header.badge}>
                <Text style={header.badgeText}>NEW</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={header.item} onPress={() => go('AboutUs')}>
              <View style={header.itemLeft}>
                <Ionicons name="information-circle" size={18} style={header.itemIcon} />
                <Text style={header.itemText}>About Us</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} style={header.itemChevron} />
            </TouchableOpacity>

            <View style={header.divider} />

            {/* Section: Account */}
            <Text style={header.sectionLabel}>Account</Text>
            <TouchableOpacity style={header.item} onPress={() => go('Register')}>
              <View style={header.itemLeft}>
                <Ionicons name="person-add" size={18} style={header.itemIcon} />
                <Text style={header.itemText}>Register</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} style={header.itemChevron} />
            </TouchableOpacity>

            <TouchableOpacity style={header.item} onPress={() => go('Login')}>
              <View style={header.itemLeft}>
                <Ionicons name="log-in" size={18} style={header.itemIcon} />
                <Text style={header.itemText}>Login</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} style={header.itemChevron} />
            </TouchableOpacity>

            <TouchableOpacity style={[header.item, { marginBottom: 4 }]} onPress={() => go('Login')}>
              <View style={header.itemLeft}>
                <Ionicons name="log-out" size={18} style={header.itemIcon} />
                <Text style={header.itemText}>Logout</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} style={header.itemChevron} />
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </Animated.View>
  );
}
