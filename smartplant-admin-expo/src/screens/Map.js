// src/screens/Map.js
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { apiCreatePlant, apiGetPlants } from "../api";

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default function MapScreen() {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    // Form state
    const [form, setForm] = useState({
        image_url: "",
        latitude: "",
        longitude: "",
        description: ""
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadPlants();
    }, []);

    async function loadPlants() {
        setLoading(true);
        try {
            const res = await apiGetPlants();
            setPlants(res.items || []);
        } catch (e) {
            Alert.alert("Error", "Failed to load plants: " + e.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddPlant() {
        if (!form.latitude || !form.longitude) {
            Alert.alert("Error", "Latitude and Longitude are required.");
            return;
        }
        setSubmitting(true);
        try {
            await apiCreatePlant(form);
            Alert.alert("Success", "Plant added successfully.");
            setModalVisible(false);
            setForm({
                image_url: "",
                latitude: "",
                longitude: "",
                description: ""
            });
            loadPlants();
        } catch (e) {
            Alert.alert("Error", e.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Plant Map</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>+ Add Plant</Text>
                </TouchableOpacity>
            </View>

            {/* Map View */}
            <View style={styles.mapContainer}>
                <MapContainer
                    center={[1.5533, 110.3592]} // Default to Kuching, Sarawak
                    zoom={10}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {plants.map((plant, index) => {
                        const lat = parseFloat(plant.latitude);
                        const lng = parseFloat(plant.longitude);
                        if (isNaN(lat) || isNaN(lng)) return null;

                        return (
                            <Marker key={index} position={[lat, lng]}>
                                <Popup>
                                    <View style={styles.popup}>
                                        <Text style={styles.popupTitle}>
                                            {plant.description || "Unknown Plant"}
                                        </Text>
                                        {plant.image_url ? (
                                            <Image
                                                source={{ uri: plant.image_url }}
                                                style={styles.popupImage}
                                            />
                                        ) : null}
                                        <Text>Lat: {lat.toFixed(4)}</Text>
                                        <Text>Lng: {lng.toFixed(4)}</Text>
                                    </View>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </View>

            {/* List View */}
            <View style={styles.listContainer}>
                <Text style={styles.listTitle}>Recent Uploads</Text>
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <ScrollView>
                        {plants.map((plant, index) => (
                            <View key={index} style={styles.listItem}>
                                {plant.image_url ? (
                                    <Image
                                        source={{ uri: plant.image_url }}
                                        style={styles.listImage}
                                    />
                                ) : (
                                    <View style={styles.placeholderImage}>
                                        <Text style={{ color: "#aaa" }}>No Img</Text>
                                    </View>
                                )}
                                <View style={styles.listInfo}>
                                    <Text style={styles.plantName}>
                                        {plant.description || "Unknown Species"}
                                    </Text>
                                    <Text style={styles.coords}>
                                        Latitude: {plant.latitude}, Longitude: {plant.longitude}
                                    </Text>
                                    <Text style={styles.date}>
                                        {plant.created_at || "Unknown Date"}
                                    </Text>
                                </View>
                            </View>
                        ))}
                        {plants.length === 0 && (
                            <Text style={styles.emptyText}>No plants found.</Text>
                        )}
                    </ScrollView>
                )}
            </View>

            {/* Add Plant Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Plant</Text>

                        <Text style={styles.label}>Description / Species</Text>
                        <TextInput
                            style={styles.input}
                            value={form.description}
                            onChangeText={(v) => setForm({ ...form, description: v })}
                            placeholder="e.g. Fern"
                        />

                        <Text style={styles.label}>Latitude</Text>
                        <TextInput
                            style={styles.input}
                            value={form.latitude}
                            onChangeText={(v) => setForm({ ...form, latitude: v })}
                            placeholder="1.5533"
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Longitude</Text>
                        <TextInput
                            style={styles.input}
                            value={form.longitude}
                            onChangeText={(v) => setForm({ ...form, longitude: v })}
                            placeholder="110.3592"
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Image URL</Text>
                        <TextInput
                            style={styles.input}
                            value={form.image_url}
                            onChangeText={(v) => setForm({ ...form, image_url: v })}
                            placeholder="https://example.com/image.jpg"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.btn, styles.btnCancel]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btn, styles.btnSubmit]}
                                onPress={handleAddPlant}
                                disabled={submitting}
                            >
                                <Text style={[styles.btnText, { color: "#fff" }]}>
                                    {submitting ? "Saving..." : "Save"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f4f6"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb"
    },
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    addButton: {
        backgroundColor: "#2563eb",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "600"
    },
    mapContainer: {
        height: 300,
        width: "100%",
        backgroundColor: "#e5e7eb"
    },
    listContainer: {
        flex: 1,
        padding: 16
    },
    listTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12
    },
    listItem: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        alignItems: "center"
    },
    listImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12
    },
    placeholderImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: "#e5e7eb",
        justifyContent: "center",
        alignItems: "center"
    },
    listInfo: {
        flex: 1
    },
    plantName: {
        fontWeight: "600",
        fontSize: 16
    },
    coords: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 2
    },
    date: {
        fontSize: 12,
        color: "#9ca3af",
        marginTop: 2
    },
    emptyText: {
        textAlign: "center",
        color: "#6b7280",
        marginTop: 20
    },
    popup: {
        alignItems: "center",
        width: 150
    },
    popupTitle: {
        fontWeight: "bold",
        marginBottom: 4
    },
    popupImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginBottom: 4
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16
    },
    modalContent: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center"
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 6,
        marginTop: 10
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        padding: 10,
        fontSize: 16
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 24,
        gap: 12
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#d1d5db"
    },
    btnCancel: {
        backgroundColor: "#fff"
    },
    btnSubmit: {
        backgroundColor: "#2563eb",
        borderColor: "#2563eb"
    },
    btnText: {
        fontWeight: "600"
    }
});
