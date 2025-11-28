import React from "react";
import { Text, View } from "react-native";
import AdminShell from "../components/AdminShell";

export default function SpeciesScreen() {
    return (
        <AdminShell title="Species" subtitle="Manage SmartPlant Species">
            <View>
                <Text>Species page - add content here.</Text>
            </View>
        </AdminShell>
    );
}