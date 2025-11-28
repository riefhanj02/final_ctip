import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import AdminShell from "../components/AdminShell";
import COLORS from "../src/theme/colors";

// ✅ FIXED: Correct API base URL without nested string
const API_BASE = "http://localhost/SMARTPLANT-ADMIN-EXPO/backend";
// If testing on physical device, replace 'localhost' with your computer's IP address
// Example: const API_BASE = "http://192.168.1.100/SMARTPLANT-ADMIN-EXPO/backend";

async function apiGet(path: string) {
    const url = path.startsWith("http")
        ? path
        : `${API_BASE}/${path.replace(/^\/+/, "")}`;

    console.log("IoT API GET:", url);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const text = await res.text();
        console.log("IoT API Response:", res.status, text.substring(0, 200));

        let data: any = {};
        try {
            data = text ? JSON.parse(text) : {};
        } catch (e) {
            console.error("JSON Parse Error:", text);
            throw new Error("Invalid JSON: " + text.substring(0, 100));
        }

        if (!res.ok) {
            const errorMsg = data.error || data.message || `HTTP ${res.status}`;
            console.error("IoT API Error Response:", {
                status: res.status,
                statusText: res.statusText,
                url: url,
                error: errorMsg,
                response: text.substring(0, 500)
            });
            throw new Error(errorMsg + ` (Status: ${res.status})`);
        }

        if (data.error) {
            console.error("IoT API Error in response:", data.error);
            throw new Error(data.error);
        }

        return data;
    } catch (e: any) {
        console.error("IoT API Error:", e);
        throw e;
    }
}

async function apiPut(path: string) {
    const url = path.startsWith("http")
        ? path
        : `${API_BASE}/${path.replace(/^\/+/, "")}`;

    console.log("IoT API PUT:", url);

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const text = await res.text();
        console.log("IoT API PUT Response:", res.status, text.substring(0, 200));

        let data: any = {};
        try {
            data = text ? JSON.parse(text) : {};
        } catch (e) {
            console.error("JSON Parse Error:", text);
            throw new Error("Invalid JSON: " + text.substring(0, 100));
        }

        if (!res.ok) {
            throw new Error(data.error || data.message || `HTTP ${res.status}: ${text.substring(0, 100)}`);
        }

        if (data.error) {
            throw new Error(data.error);
        }

        return data;
    } catch (e: any) {
        console.error("IoT API PUT Error:", e);
        throw e;
    }
}

type SensorReading = {
    id: number;
    temperature: number | null;
    humidity: number | null;
    gps_latitude: number | null;
    gps_longitude: number | null;
    gps_altitude: number | null;
    created_at: string;
};

type MotionAlert = {
    id: number;
    alert_type: string;
    gps_latitude: number;
    gps_longitude: number;
    gps_altitude: number | null;
    gps_address: string | null;
    confidence_score: number | null;
    is_read: boolean;
    created_at: string;
};

type IoTStats = {
    latest_reading: SensorReading | null;
    total_readings: number;
    total_alerts: number;
    unread_alerts: number;
};

export default function IoTScreen() {
    const [stats, setStats] = useState<IoTStats | null>(null);
    const [alerts, setAlerts] = useState<MotionAlert[]>([]);
    const [readings, setReadings] = useState<SensorReading[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string>("");

    const loadData = async () => {
        try {
            setError("");

            // Load stats (includes latest reading)
            const statsData = await apiGet("iot.php?mode=stats");
            setStats(statsData);

            // Load recent alerts
            const alertsData = await apiGet("iot.php?mode=alerts&page=1&page_size=10&unread_only=1");
            setAlerts(alertsData.alerts || []);

            // Load recent sensor readings
            const readingsData = await apiGet("iot.php?mode=readings&page=1&page_size=20");
            setReadings(readingsData.readings || []);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to load IoT data");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();

        // Auto-refresh every 10 seconds
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAlertRead = async (alertId: number) => {
        try {
            await apiPut(`iot.php?id=${alertId}`);
            // Reload alerts
            const alertsData = await apiGet("iot.php?mode=alerts&page=1&page_size=10&unread_only=1");
            setAlerts(alertsData.alerts || []);
            // Update stats
            const statsData = await apiGet("iot.php?mode=stats");
            setStats(statsData);
        } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to mark alert as read");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await apiPut("iot.php?mode=mark_all_read");
            // Reload data
            loadData();
        } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to mark all alerts as read");
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const formatGPS = (lat: number | null, lng: number | null) => {
        if (lat === null || lng === null) return "N/A";
        return `${Number(lat).toFixed(6)}, ${Number(lng).toFixed(6)}`;
    };

    if (loading) {
        return (
            <AdminShell title="IoT" subtitle="Monitor SmartPlant IoT devices">
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading IoT data...</Text>
                </View>
            </AdminShell>
        );
    }

    return (
        <AdminShell title="IoT" subtitle="Monitor SmartPlant IoT devices">
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => {
                        setRefreshing(true);
                        loadData();
                    }} />
                }
            >
                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>⚠️ {error}</Text>
                    </View>
                ) : null}

                {/* Stats Section */}
                {stats && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📊 Statistics</Text>
                        <View style={styles.statsGrid}>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{stats.total_readings}</Text>
                                <Text style={styles.statLabel}>Total Readings</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{stats.total_alerts}</Text>
                                <Text style={styles.statLabel}>Total Alerts</Text>
                            </View>
                            <View style={[styles.statCard, stats.unread_alerts > 0 && styles.alertCard]}>
                                <Text style={[styles.statValue, stats.unread_alerts > 0 && styles.alertValue]}>
                                    {stats.unread_alerts}
                                </Text>
                                <Text style={styles.statLabel}>Unread Alerts</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Latest Sensor Reading */}
                {stats?.latest_reading && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🌡️ Latest Sensor Reading</Text>
                        <View style={styles.readingCard}>
                            <View style={styles.readingRow}>
                                <Text style={styles.readingLabel}>Temperature:</Text>
                                <Text style={styles.readingValue}>
                                    {stats.latest_reading.temperature !== null
                                        ? `${Number(stats.latest_reading.temperature).toFixed(1)} °C`
                                        : "N/A"}
                                </Text>
                            </View>
                            <View style={styles.readingRow}>
                                <Text style={styles.readingLabel}>Humidity:</Text>
                                <Text style={styles.readingValue}>
                                    {stats.latest_reading.humidity !== null
                                        ? `${Number(stats.latest_reading.humidity).toFixed(1)} %`
                                        : "N/A"}
                                </Text>
                            </View>
                            <View style={styles.readingRow}>
                                <Text style={styles.readingLabel}>GPS Location:</Text>
                                <Text style={styles.readingValue}>
                                    {formatGPS(stats.latest_reading.gps_latitude, stats.latest_reading.gps_longitude)}
                                </Text>
                            </View>
                            <Text style={styles.readingTime}>
                                {formatDateTime(stats.latest_reading.created_at)}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Motion Alerts */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>🚨 Motion Alerts</Text>
                        {alerts.length > 0 && (
                            <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllButton}>
                                <Text style={styles.markAllText}>Mark All Read</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {alerts.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No unread alerts</Text>
                        </View>
                    ) : (
                        alerts.map((alert) => (
                            <TouchableOpacity
                                key={alert.id}
                                style={[styles.alertCard, !alert.is_read && styles.unreadAlert]}
                                onPress={() => !alert.is_read && handleMarkAlertRead(alert.id)}
                            >
                                <View style={styles.alertHeader}>
                                    <Text style={styles.alertType}>
                                        {alert.alert_type === "person_detected" ? "👤 Person Detected" : "⚠️ Alert"}
                                    </Text>
                                    {!alert.is_read && (
                                        <View style={styles.unreadBadge}>
                                            <Text style={styles.unreadBadgeText}>NEW</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.alertRow}>
                                    <Text style={styles.alertLabel}>📍 GPS:</Text>
                                    <Text style={styles.alertValue}>
                                        {formatGPS(alert.gps_latitude, alert.gps_longitude)}
                                    </Text>
                                </View>
                                {alert.gps_address && (
                                    <View style={styles.alertRow}>
                                        <Text style={styles.alertLabel}>🏠 Address:</Text>
                                        <Text style={styles.alertAddress}>{alert.gps_address}</Text>
                                    </View>
                                )}
                                {alert.gps_altitude !== null && (
                                    <View style={styles.alertRow}>
                                        <Text style={styles.alertLabel}>Altitude:</Text>
                                        <Text style={styles.alertValue}>{Number(alert.gps_altitude).toFixed(1)} m</Text>
                                    </View>
                                )}
                                <Text style={styles.alertTime}>{formatDateTime(alert.created_at)}</Text>
                                {!alert.is_read && (
                                    <Text style={styles.tapToRead}>Tap to mark as read</Text>
                                )}
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                {/* Recent Sensor Readings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📈 Recent Sensor Readings</Text>
                    {readings.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No sensor readings available</Text>
                        </View>
                    ) : (
                        readings.slice(0, 10).map((reading) => (
                            <View key={reading.id} style={styles.readingItem}>
                                <View style={styles.readingItemRow}>
                                    <Text style={styles.readingItemLabel}>🌡️ {reading.temperature !== null ? Number(reading.temperature).toFixed(1) : "N/A"} °C</Text>
                                    <Text style={styles.readingItemLabel}>💧 {reading.humidity !== null ? Number(reading.humidity).toFixed(1) : "N/A"} %</Text>
                                </View>
                                <Text style={styles.readingItemTime}>{formatDateTime(reading.created_at)}</Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </AdminShell>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#666",
    },
    errorContainer: {
        backgroundColor: "#fee",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: "#c00",
        fontSize: 14,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
        color: COLORS.text,
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    statCard: {
        flex: 1,
        minWidth: "30%",
        backgroundColor: COLORS.primary + "30",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    alertCard: {
        backgroundColor: "#fff3cd",
        borderColor: "#ff9800",
    },
    statValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.text,
    },
    alertValue: {
        color: "#ff9800",
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.muted,
        marginTop: 4,
    },
    readingCard: {
        backgroundColor: COLORS.primary + "20",
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    readingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    readingLabel: {
        fontSize: 14,
        color: COLORS.muted,
    },
    readingValue: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.text,
    },
    readingTime: {
        fontSize: 12,
        color: COLORS.muted,
        marginTop: 8,
        fontStyle: "italic",
    },
    unreadAlert: {
        backgroundColor: "#fff3cd",
        borderColor: "#ff9800",
        borderWidth: 2,
    },
    alertHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    alertType: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.text,
    },
    unreadBadge: {
        backgroundColor: COLORS.error,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    unreadBadgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: "bold",
    },
    alertRow: {
        flexDirection: "row",
        marginBottom: 6,
        flexWrap: "wrap",
    },
    alertLabel: {
        fontSize: 14,
        color: COLORS.muted,
        marginRight: 8,
    },
    alertAddress: {
        fontSize: 14,
        color: COLORS.text,
        flex: 1,
    },
    alertTime: {
        fontSize: 12,
        color: COLORS.muted,
        marginTop: 8,
        fontStyle: "italic",
    },
    tapToRead: {
        fontSize: 12,
        color: "#ff9800",
        marginTop: 4,
        fontStyle: "italic",
    },
    markAllButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    markAllText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: "600",
    },
    readingItem: {
        backgroundColor: COLORS.primary + "20",
        padding: 12,
        borderRadius: 6,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    readingItemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    readingItemLabel: {
        fontSize: 14,
        color: COLORS.text,
    },
    readingItemTime: {
        fontSize: 12,
        color: COLORS.muted,
    },
    emptyContainer: {
        padding: 24,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.muted,
        fontStyle: "italic",
    },
});