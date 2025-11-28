// src/screens/LoginScreen.js
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState("admin@example.com");
    const [password, setPassword] = useState("admin");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit() {
        setError("");
        setLoading(true);
        try {
            await login(email.trim(), password);
        } catch (e) {
            setError(e.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.card}>
                <Text style={styles.logoText}>SMARTPLANT SARAWAK</Text>
                <Text style={styles.title}>Welcome back!</Text>

                <Text style={styles.label}>Email address</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TouchableOpacity
                    style={styles.button}
                    onPress={onSubmit}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Logging in..." : "LOG IN"}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.hint}>
                    Use admin@example.com / admin for the default admin account.
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16
    },
    card: {
        width: "100%",
        maxWidth: 420,
        borderRadius: 24,
        padding: 24,
        backgroundColor: "#ffffff",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 }
    },
    logoText: {
        fontSize: 20,
        fontWeight: "700",
        alignSelf: "center",
        marginBottom: 24
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 16,
        textAlign: "center"
    },
    label: {
        fontSize: 13,
        marginTop: 12,
        marginBottom: 4
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10
    },
    button: {
        marginTop: 24,
        backgroundColor: "#2563eb",
        borderRadius: 999,
        paddingVertical: 12,
        alignItems: "center"
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "600",
        fontSize: 16
    },
    error: {
        marginTop: 8,
        color: "#b91c1c"
    },
    hint: {
        marginTop: 12,
        fontSize: 11,
        color: "#6b7280",
        textAlign: "center"
    }
});
