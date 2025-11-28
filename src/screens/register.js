import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/register';
import { useScrollHide } from '../hooks/useScrollHide';
import { registerUser, confirmRegistration, resendConfirmationCode } from '../services/authService';


export default function Register({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Home');
  const { isVisible, handleScroll } = useScrollHide();
  
  const headerHeight = insets.top + 16 + 2 + 80;
  const footerHeight = insets.bottom + 18 + 2 + 60;
  
  const [form, setForm] = useState({
    username: '',
    realName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resendingCode, setResendingCode] = useState(false);

  const handleChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));
  const strong = (p) => /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(p);

  const handleRegister = async () => {
    // Validation
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (!strong(form.password)) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters long and contain:\n- One uppercase letter\n- One number\n- One special character (@$!%*?&)'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // Prepare attributes for Cognito
      const attributes = {};
      if (form.realName) attributes.name = form.realName;
      // Only include phone if provided (will be validated and formatted in authService)
      if (form.phone && form.phone.trim()) {
        attributes.phone_number = form.phone.trim();
      }
      if (form.username) attributes.preferred_username = form.username;

      const result = await registerUser(form.email.trim(), form.password, attributes);

      if (result.success) {
        // Show verification modal
        setShowVerificationModal(true);
        Alert.alert('Success', 'Registration successful! Please check your email for the verification code.');
      } else {
        Alert.alert('Registration Failed', result.error || 'Could not create account. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the verification code.');
      return;
    }

    setVerifying(true);
    try {
      const result = await confirmRegistration(form.email.trim(), verificationCode.trim());

      if (result.success) {
        Alert.alert('Success', 'Email verified! You can now log in.', [
          {
            text: 'OK',
            onPress: () => {
              setShowVerificationModal(false);
              setVerificationCode('');
              navigation.navigate('Login');
            },
          },
        ]);
      } else {
        Alert.alert('Verification Failed', result.error || 'Invalid verification code. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setResendingCode(true);
    try {
      const result = await resendConfirmationCode(form.email.trim());
      if (result.success) {
        Alert.alert('Success', 'Verification code sent! Please check your email.');
      } else {
        Alert.alert('Error', result.error || 'Failed to resend verification code.');
      }
    } catch (err) {
      console.error('Resend code error:', err);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setResendingCode(false);
    }
  };

  return (
    <SafeAreaView style={styles.page} edges={['left', 'right']}>
      {/* Header OUTSIDE the ScrollView -> full width, aligned */}
      <Header navigation={navigation} isVisible={isVisible} />

      {/* Scrollable content only */}
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
          <Text style={styles.heroTitle}>Create your account</Text>
          <Text style={styles.heroSubtitle}>
            Join SmartPlant Sarawak to identify species, map locations, and contribute to conservation.
          </Text>
        </View>

        {/* Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Register</Text>

          <TextInput style={styles.input} placeholder="Username"
            value={form.username} onChangeText={(t) => handleChange('username', t)} autoCapitalize="none" />

          <TextInput style={styles.input} placeholder="Real Name"
            value={form.realName} onChangeText={(t) => handleChange('realName', t)} />

          <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad"
            value={form.phone} onChangeText={(t) => handleChange('phone', t)} />

          <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none"
            value={form.email} onChangeText={(t) => handleChange('email', t)} />

          <TextInput style={styles.input} placeholder="Password" secureTextEntry
            value={form.password} onChangeText={(t) => handleChange('password', t)} />

          <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry
            value={form.confirmPassword} onChangeText={(t) => handleChange('confirmPassword', t)} />

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister} 
            activeOpacity={0.9}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <Text style={styles.switchLink}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Email Verification Modal */}
      <Modal
        visible={showVerificationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVerificationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Verify Your Email</Text>
            <Text style={styles.modalSubtitle}>
              We've sent a verification code to {form.email}. Please enter it below.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter verification code"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              autoFocus
            />

            <TouchableOpacity
              onPress={handleResendCode}
              disabled={resendingCode}
              style={{ marginBottom: 12, alignSelf: 'center' }}
            >
              {resendingCode ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text style={styles.switchLink}>Resend Code</Text>
              )}
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => {
                  setShowVerificationModal(false);
                  setVerificationCode('');
                }}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary, verifying && styles.buttonDisabled]}
                onPress={handleVerifyEmail}
                disabled={verifying}
              >
                {verifying ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonTextPrimary}>Verify</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
