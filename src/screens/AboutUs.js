import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/AboutUsStyles';
import { colors } from '../theme/colors';
import { useScrollHide } from '../hooks/useScrollHide';

const TEAM = [
  { 
    id: '1', 
    name: 'Sharlene Lim Khai Xing',
    major: 'Cybersecurity',
    studentId: '102783112',
    description: 'I may struggle, but I never give up.',
    color: '#FF6F61',
    image: require('../../assets/team/sharlene1.png'),
    social: {
      whatsapp: 'https://wa.me/60109582348', 
      linkedin: 'https://www.linkedin.com/in/sharlene-lim-189b94384/', 
      facebook: 'https://www.facebook.com/profile.php?id=100011110778545', 
    }
  },
  { 
    id: '2', 
    name: 'Stefani Lee Shi Huey',
    major: 'Cybersecurity',
    studentId: '102783196',
    description: 'Be great or be nothing.',
    color: '#6B5B95',
    image: require('../../assets/team/stefani.jpg'),

    social: {
      whatsapp: 'https://wa.me/60143148508',
      linkedin: 'https://www.linkedin.com/in/stefani-lee', //change later 
      facebook: 'https://www.facebook.com/stefani.lee.777',
    }
  },
  { 
    id: '3', 
    name: 'Ngui Jia Yi',
    major: 'Data Science',
    studentId: '102783222',
    description: 'Placeholder',
    color: '#88B04B',
        image: require('../../assets/team/jiayi.jpg'),

    social: {
      whatsapp: 'https://wa.me/601120246748',
      linkedin: 'https://www.linkedin.com/in/jia-yi', // change later
      facebook: 'https://www.facebook.com/jia.yi.06',
    }
  },
  { 
    id: '4', 
    name: 'Erica Chong Pei Pei',
    major: 'Software Development',
    studentId: '102786849',
    description: 'placeholder',
    color: '#F7CAC9',
        image: require('../../assets/team/erica.jpg'),

    social: {
      whatsapp: 'https://wa.me/60148886863',
      linkedin: 'https://www.linkedin.com/in/erica-chong', //change later
      facebook: 'https://www.facebook.com/erica-chong', //change later
    }
  },
  { 
    id: '5', 
    name: 'Yong Suen Xuen',
    major: 'Artificial Intelligence',
    studentId: '102781734',
    description: 'placeholder',
    color: '#92A8D1',
        image: require('../../assets/team/jack.jpg'),

    social: {
      whatsapp: 'https://wa.me/60198792183',
      linkedin: 'https://www.linkedin.com/in/jack-xuan', //change later
      facebook: 'https://www.facebook.com/JackXuan24',
    }
  },
  { 
    id: '6', 
    name: 'Riefhan Jawaheer Bin Jemain',
    major: 'Software Development',
    studentId: '1027777047',
    description: 'placeholder',
    color: '#955251',
        image: require('../../assets/team/riefhan.jpg'),

    social: {
      whatsapp: 'https://wa.me/60136457601',
      linkedin: 'https://www.linkedin.com/in/riefhan-j', //change later
      facebook: 'https://www.facebook.com/RiefhanJ02',
    }
  },
  { 
    id: '7', 
    name: 'Radzien Jawharee Bin Jemain',
    major: 'Cybersecurity',
    studentId: '102781734',
    description: 'placeholder',
    color: '#B565A7',
        image: require('../../assets/team/radzien.jpg'),
    social: {
      whatsapp: 'https://wa.me/60197507675',
      linkedin: 'https://www.linkedin.com/in/radzien-j', //change later
      facebook: 'https://www.facebook.com/radzien.jawharee',
    }
  },
];

export default function AboutUs({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isVisible, handleScroll } = useScrollHide();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const DOT_WIDTH = 72; // 56 (dot) + 16 (gap from styles)
  
  const headerHeight = insets.top + 16 + 2 + 80;
  const footerHeight = insets.bottom + 18 + 2 + 60;

  // Auto-scroll dots when current index changes
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: currentIndex * DOT_WIDTH,
        animated: true,
      });
    }
  }, [currentIndex]);

  // Handle opening social media links
  const handleSocialPress = async (url, platform) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open ${platform}. Please check if the app is installed.`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to open ${platform}: ${error.message}`);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TEAM.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === TEAM.length - 1 ? 0 : prev + 1));
  };

  const handleTabPress = (tabId) => {
    const routeMap = {
      Home: 'Home',
      Identify: 'Identify',
      Map: 'Map',
      Profile: 'Profile',
    };
    const route = routeMap[tabId] || tabId;
    if (route) navigation?.navigate?.(route);
  };

  const currentMember = TEAM[currentIndex];

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      {/* Header component */}
      <Header navigation={navigation} isVisible={isVisible} />

      {/* Title Section */}
      <View style={styles.titleSection}>
        <View style={styles.titleIcon}>
          <Ionicons name="people" size={14} color={colors.primary} />
        </View>
        <Text style={styles.titleText}>Management Team</Text>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: headerHeight + 20,
          paddingBottom: footerHeight + 24,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.mainContainer}>
          {/* Navigation Arrows */}
          <TouchableOpacity 
            onPress={handlePrev}
            style={[styles.navButton, styles.navButtonLeft]}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleNext}
            style={[styles.navButton, styles.navButtonRight]}
          >
            <Ionicons name="chevron-forward" size={24} color="#333" />
          </TouchableOpacity>

          {/* Profile Content */}
          <View style={styles.profileContent}>
            {/* Profile Image */}
            <View style={styles.profileImageContainer}>
              <Image 
                source={currentMember.image}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </View>

            {/* Name */}
            <Text style={styles.nameText}>{currentMember.name}</Text>

            {/* Major - NEW! */}
            <Text style={styles.majorText}>{currentMember.major}</Text>

            {/* Student ID */}
            <Text style={styles.studentId}>{currentMember.studentId}</Text>

            {/* Description */}
            <Text style={styles.description}>{currentMember.description}</Text>

            {/* Social Icons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity 
                style={[styles.socialButton, styles.socialWhatsapp]}
                onPress={() => handleSocialPress(currentMember.social.whatsapp, 'WhatsApp')}
              >
                <Ionicons name="logo-whatsapp" size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.socialButton, styles.socialLinkedIn]}
                onPress={() => handleSocialPress(currentMember.social.linkedin, 'LinkedIn')}
              >
                <Ionicons name="logo-linkedin" size={20} color="#2563eb" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.socialButton, styles.socialFacebook]}
                onPress={() => handleSocialPress(currentMember.social.facebook, 'Facebook')}
              >
                <Ionicons name="logo-facebook" size={20} color="#2563eb" />
              </TouchableOpacity>
            </View>

            {/* Team Member Dots - Now with auto-scroll */}
            <ScrollView 
              ref={scrollViewRef}
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dotsScroll}
            >
              {TEAM.map((member, idx) => (
                <TouchableOpacity
                  key={member.id}
                  onPress={() => setCurrentIndex(idx)}
                  style={styles.dotButton}
                >
                  <View style={[
                    styles.dot,
                    { backgroundColor: member.color },
                    idx === currentIndex ? styles.dotActive : styles.dotInactive
                  ]}>
                    {idx === currentIndex && (
                      <Text style={styles.dotLabel}>
                        {member.name.split(' ')[0].slice(0, 3)}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Footer component */}
      <Footer activeTab="Home" isVisible={isVisible} navigation={navigation} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}