// src/navigation/RootNavigator.js
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

import AnalyticsScreen from "../screens/Analytics";
import DashboardScreen from "../screens/Dashboard";
import IoTScreen from "../screens/IoT";
import LoginScreen from "../screens/Login";
import MapScreen from "../screens/Map";
import ReviewsScreen from "../screens/Reviews";
import SettingsScreen from "../screens/Settings";
import SpeciesScreen from "../screens/Species";
import UsersScreen from "../screens/Users";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AppDrawer() {
    return (
        <Drawer.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
                headerTitleAlign: "left"
            }}
        >
            <Drawer.Screen name="Dashboard" component={DashboardScreen} />
            <Drawer.Screen name="Users" component={UsersScreen} />
            <Drawer.Screen name="Reviews" component={ReviewsScreen} />
            <Drawer.Screen name="Species" component={SpeciesScreen} />
            <Drawer.Screen name="IoT" component={IoTScreen} />
            <Drawer.Screen name="Map" component={MapScreen} />
            <Drawer.Screen name="Analytics" component={AnalyticsScreen} />
            <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
    );
}

export default function RootNavigator() {
    const { user, initializing } = useAuth();

    if (initializing) {
        return null; // or splash screen
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <Stack.Screen name="App" component={AppDrawer} />
            ) : (
                <Stack.Screen name="Login" component={LoginScreen} />
            )}
        </Stack.Navigator>
    );
}
