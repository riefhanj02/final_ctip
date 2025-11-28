import React from "react";
import { Text, View } from "react-native";
import AdminShell from "../components/AdminShell";

export default function ReviewsScreen() {
    return (
        <AdminShell title="Reviews" subtitle="Manage SmartPlant reviews">
            <View>
                <Text>Reviews page - add content here.</Text>
            </View>
        </AdminShell>
    );
}