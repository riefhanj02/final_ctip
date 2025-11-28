import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useScrollHide } from "../hooks/useScrollHide";
import styles from "../styles/editprofile";

export default function EditProfile({ route, navigation }) {
  const { user } = route.params;

  const insets = useSafeAreaInsets();
  const { isVisible, handleScroll } = useScrollHide();

  const [activeTab, setActiveTab] = useState("Profile");

  const headerHeight = insets.top + 16 + 2 + 80;
  const footerHeight = insets.bottom + 18 + 2 + 60;

  const [form, setForm] = useState({
    username: user.username || "",
    real_name: user.real_name || "",
    phone_number: user.phone_number || "",
    email: user.email || "",
    email_visible: !!user.email_visible,
  });

  const [image, setImage] = useState(
    user.profile_pic
      ? { uri: `${BASE_URL}/uploads/${user.profile_pic}` }
      : require("../../assets/image/profile_pic.jpg")
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission Denied", "Camera roll access is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setImage({ uri: result.assets[0].uri });
  };

  const handleSave = async () => {
    const fd = new FormData();
    fd.append("userId", String(user.id));
    fd.append("username", form.username);
    fd.append("real_name", form.real_name);
    fd.append("phone_number", form.phone_number);
    fd.append("email", form.email);
    fd.append("email_visible", form.email_visible ? "1" : "0");

    if (image.uri && !String(image.uri).includes("http")) {
      const filename = image.uri.split("/").pop();
      const ext = filename.split(".").pop();
      const type = `image/${ext}`;
      fd.append("profile_pic", { uri: image.uri, name: filename, type });
    }

    try {
      const res = await fetch(`${BASE_URL}/auth/updateProfile`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "Profile updated!");
        navigation.navigate("Profile", {
          user: {
            ...user,
            ...form,
            email_visible: form.email_visible ? 1 : 0,
            profile_pic: data.profile_pic || user.profile_pic,
          },
        });
      } else {
        Alert.alert("Error", data.error || "Update failed");
      }
    } catch (e) {
      Alert.alert("Error", "Connection failed");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert("Error", "Fill in both password fields");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/auth/changePassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert("Success", "Password changed!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        Alert.alert("Error", data.message || "Failed");
      }
    } catch (e) {
      Alert.alert("Error", "Connection failed");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header navigation={navigation} isVisible={isVisible} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: headerHeight + 10,
          paddingBottom: footerHeight + 20,
          paddingHorizontal: 18,
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.header}>Edit Profile</Text>

        {/* Profile Image */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage} style={styles.profileImageWrapper}>
            <Image source={image} style={styles.profileImage} />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera-outline" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileHint}>Tap to change profile photo</Text>
        </View>

        {/* Info Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Your Information</Text>

          {/* Username */}
          <View style={styles.field}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={form.username}
              onChangeText={(t) => handleChange("username", t)}
            />
          </View>

          {/* Real Name */}
          <View style={styles.field}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={form.real_name}
              onChangeText={(t) => handleChange("real_name", t)}
            />
          </View>

          {/* Phone */}
          <View style={styles.field}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={form.phone_number}
              keyboardType="phone-pad"
              onChangeText={(t) => handleChange("phone_number", t)}
            />
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              keyboardType="email-address"
              onChangeText={(t) => handleChange("email", t)}
            />
          </View>

          {/* Privacy Toggle */}
          <View style={styles.privacyRow}>
            <Text style={styles.privacyLabel}>Show my email publicly</Text>
            <Switch
              value={form.email_visible}
              onValueChange={(v) => handleChange("email_visible", v)}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Password Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Change Password</Text>

          <View style={styles.field}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.inputLabel}>New Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          <TouchableOpacity style={styles.changePassButton} onPress={handleChangePassword}>
            <Text style={styles.saveText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer navigation={navigation} activeTab={"Profile"} />
    </SafeAreaView>
  );
}
