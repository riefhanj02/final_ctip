import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import AboutUs from './src/screens/AboutUs';
import Encyclopedia from './src/screens/Encyclopedia';
import Homepage from './src/screens/Homepage';
import PlantDetails from './src/screens/PlantDetails';
import { colors } from './src/theme/colors';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import login from './src/screens/login';
import ScanUpload from './src/screens/ScanUpload';
import register from './src/screens/register';
import Map from './src/screens/Map';
import editprofile from './src/screens/editprofile';
import profile from './src/screens/profile';
import Community from './src/screens/Community';


const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Gabarito-Medium': require('./assets/fonts/Gabarito-Medium.ttf'),
          'Fustat-Light': require('./assets/fonts/Fustat-Light.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // Continue anyway
      }
    }
    loadFonts();
  }, []);

  // Show nothing while fonts are loading
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Homepage} />
          <Stack.Screen name="Encyclopedia" component={Encyclopedia} />
          <Stack.Screen name="PlantDetails" component={PlantDetails} />
          <Stack.Screen name="AboutUs" component={AboutUs} />
          <Stack.Screen name="Login" component={login} />
          <Stack.Screen name="Register" component={register} />
          <Stack.Screen name="Profile" component={profile} />
          <Stack.Screen name="Editprofile" component={editprofile} />
          <Stack.Screen name="Identify" component={ScanUpload} />
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen name="Community" component={Community} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}