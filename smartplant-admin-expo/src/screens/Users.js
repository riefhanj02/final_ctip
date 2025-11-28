// src/screens/UsersScreen.js
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {
    apiCreateUser,
    apiDeleteUser,
    apiGetUser,
    apiUpdateUser,
    apiUsersAll,
    apiUsersList
} from "../api";

const TABS = ["find", "all", "add", "edit"];

export default function UsersScreen() {
    const [tab, setTab] = useState("find");

    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loadingList, setLoadingList] = useState(false);

    const [filterName, setFilterName] = useState("");
    const [filterEmail, setFilterEmail] = useState("");
    const [filterAdmin, setFilterAdmin] = useState(""); // "", "1", "0"

    const [formAdd, setFormAdd] = useState({
        real_name: "",
        username: "",
        email: "",
        phone_number: "",
        password: "",
        password2: "",
        email_visible: false,
        is_admin: false
    });
    const [errorAdd, setErrorAdd] = useState("");

    const [formEdit, setFormEdit] = useState({
        id: null,
        real_name: "",
        username: "",
        email: "",
        phone_number: "",
        email_visible: false,
        is_admin: false
    });
    const [editIdInput, setEditIdInput] = useState("");
    const [errorEdit, setErrorEdit] = useState("");

    const [loadingAction, setLoadingAction] = useState(false);

    const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 10)));

    useEffect(() => {
        loadSearch(1);
    }, []);

    async function loadSearch(p = 1) {
        setTab("find");
        setPage(p);
        setLoadingList(true);
        try {
            const r = await apiUsersList({
                mode: "list",
                name: filterName,
                email: filterEmail,
                is_admin: filterAdmin,
                page: p,
                page_size: pageSize
            });
            setItems(r.items || []);
            setTotal(r.total || 0);
        } catch (e) {
            Alert.alert("Error", e.message);
        } finally {
            setLoadingList(false);
        }
    }

    async function loadAll(p = 1) {
        setTab("all");
        setPage(p);
        setLoadingList(true);
        try {
            const r = await apiUsersAll(p, pageSize);
            setItems(r.items || []);
            setTotal(r.total || 0);
        } catch (e) {
            Alert.alert("Error", e.message);
        } finally {
            setLoadingList(false);
        }
    }

    function handlePageChange(p) {
        if (tab === "all") {
            loadAll(p);
        } else {
            loadSearch(p);
        }
    }

    function clearFilter() {
        setFilterName("");
        setFilterEmail("");
        setFilterAdmin("");
        loadSearch(1);
    }

    function selectRow(u) {
        setFormEdit({
            id: u.id,
            real_name: u.real_name || "",
            username: u.username || "",
            email: u.email || "",
            phone_number: u.phone_number || "",
            email_visible: !!u.email_visible,
            is_admin: !!u.is_admin
        });
        setEditIdInput(String(u.id));
        setTab("edit");
    }

    function clearAdd() {
        setFormAdd({
            real_name: "",
            username: "",
            email: "",
            phone_number: "",
            password: "",
            password2: "",
            email_visible: false,
            is_admin: false
        });
        setErrorAdd("");
    }

    async function handleCreate() {
        setErrorAdd("");
        const f = formAdd;
        if (!f.real_name || !f.username || !f.email || !f.password) {
            setErrorAdd("Please fill in required fields.");
            return;
        }
        if (f.password !== f.password2) {
            setErrorAdd("Passwords do not match.");
            return;
        }
        setLoadingAction(true);
        try {
            const payload = { ...f };
            delete payload.password2;
            await apiCreateUser(payload);
            Alert.alert("Success", "User created.");
            clearAdd();
            loadAll(1);
            setTab("all");
        } catch (e) {
            setErrorAdd(e.message);
        } finally {
            setLoadingAction(false);
        }
    }

    async function handleLoadForEdit() {
        if (!editIdInput) {
            return;
        }
        setErrorEdit("");
        setLoadingAction(true);
        try {
            const user = await apiGetUser(editIdInput);
            setFormEdit({
                id: user.id,
                real_name: user.real_name || "",
                username: user.username || "",
                email: user.email || "",
                phone_number: user.phone_number || "",
                email_visible: !!user.email_visible,
                is_admin: !!user.is_admin
            });
            Alert.alert("Loaded", "User " + user.id + " loaded.");
        } catch (e) {
            setErrorEdit(e.message);
        } finally {
            setLoadingAction(false);
        }
    }

    async function handleSaveEdit() {
        const f = formEdit;
        if (!f.id) {
            setErrorEdit("No user selected.");
            return;
        }
        setErrorEdit("");
        setLoadingAction(true);
        try {
            const payload = { ...f };
            await apiUpdateUser(f.id, payload);
            Alert.alert("Saved", "User updated.");
            if (tab === "all") {
                loadAll(page);
            } else {
                loadSearch(page);
            }
        } catch (e) {
            setErrorEdit(e.message);
        } finally {
            setLoadingAction(false);
        }
    }

    async function handleDelete() {
        const f = formEdit;
        if (!f.id) {
            return;
        }
        Alert.alert(
            "Confirm delete",
            "Delete this user?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setLoadingAction(true);
                        try {
                            await apiDeleteUser(f.id);
                            Alert.alert("Deleted", "User deleted.");
                            setFormEdit({
                                id: null,
                                real_name: "",
                                username: "",
                                email: "",
                                phone_number: "",
                                email_visible: false,
                                is_admin: false
                            });
                            loadAll(1);
                            setTab("all");
                        } catch (e) {
                            setErrorEdit(e.message);
                        } finally {
                            setLoadingAction(false);
                        }
                    }
                }
            ]
        );
    }

    function AdminFilterButton({ value, label }) {
        const selected = filterAdmin === value;
        return (
            <TouchableOpacity
                style={[
                    styles.chip,
                    selected && styles.chipSelected
                ]}
                onPress={() => setFilterAdmin(value)}
            >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Users</Text>
            <Text style={styles.subtitle}>Find, list, add, and edit accounts</Text>

            {/* Tabs */}
            <View style={styles.tabRow}>
                {TABS.map((t) => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.tab, tab === t && styles.tabActive]}
                        onPress={() => {
                            setTab(t);
                            if (t === "all") {
                                loadAll(1);
                            }
                        }}
                    >
                        <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                            {t === "find"
                                ? "Find user"
                                : t === "all"
                                ? "All account"
                                : t === "add"
                                ? "Add accounts"
                                : "Edit accounts"}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Filter (Find) */}
            {tab === "find" && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Filter</Text>
                    <View style={styles.filterRow}>
                        <View style={styles.filterCol}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.inputLarge}
                                value={filterName}
                                onChangeText={setFilterName}
                                placeholder="Andrew Salgado"
                            />
                        </View>
                        <View style={styles.filterCol}>
                            <Text style={styles.label}>Email address</Text>
                            <TextInput
                                style={styles.inputLarge}
                                value={filterEmail}
                                onChangeText={setFilterEmail}
                                placeholder="example@mail.com"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.filterAdminRow}>
                        <Text style={styles.label}>Admin</Text>
                        <View style={styles.chipRow}>
                            <AdminFilterButton value="" label="Any" />
                            <AdminFilterButton value="1" label="Yes" />
                            <AdminFilterButton value="0" label="No" />
                        </View>
                    </View>

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.btn} onPress={clearFilter}>
                            <Text>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, styles.btnPrimary]}
                            onPress={() => loadSearch(1)}
                        >
                            <Text style={styles.btnPrimaryText}>Search</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Results (Find / All) */}
            {(tab === "find" || tab === "all") && (
                <View style={styles.card}>
                    <View style={styles.resultsHeader}>
                        <Text>
                            <Text style={{ fontWeight: "700" }}>Found:</Text> {total || 0}
                        </Text>
                    </View>

                    {loadingList ? (
                        <ActivityIndicator style={{ marginTop: 12 }} />
                    ) : (
                        <>
                            {items.map((u) => (
                                <TouchableOpacity
                                    key={u.id}
                                    style={styles.userRow}
                                    onPress={() => selectRow(u)}
                                >
                                    <View style={{ flex: 3 }}>
                                        <Text style={styles.userName}>{u.real_name}</Text>
                                        <Text style={styles.userEmail}>{u.email}</Text>
                                    </View>
                                    <View style={{ flex: 2 }}>
                                        <Text style={styles.userLabel}>Username</Text>
                                        <Text>{u.username}</Text>
                                    </View>
                                    <View style={{ flex: 2 }}>
                                        <Text style={styles.userLabel}>Phone</Text>
                                        <Text>{u.phone_number || "-"}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.userLabel}>Admin</Text>
                                        <Text>{u.is_admin ? "Yes" : "No"}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            {items.length === 0 && (
                                <Text style={styles.muted}>No users to show.</Text>
                            )}
                        </>
                    )}

                    <View style={styles.pager}>
                        <TouchableOpacity
                            style={styles.btn}
                            disabled={page === 1}
                            onPress={() => handlePageChange(page - 1)}
                        >
                            <Text>Previous</Text>
                        </TouchableOpacity>
                        <Text style={styles.muted}>
                            Page {page} / {totalPages}
                        </Text>
                        <TouchableOpacity
                            style={styles.btn}
                            disabled={page === totalPages}
                            onPress={() => handlePageChange(page + 1)}
                        >
                            <Text>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Add */}
            {tab === "add" && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Add a new account</Text>

                    <View style={styles.formRow}>
                        <View style={styles.formCol}>
                            <Text style={styles.label}>Real Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formAdd.real_name}
                                onChangeText={(v) =>
                                    setFormAdd((f) => ({ ...f, real_name: v }))
                                }
                            />
                        </View>
                        <View style={styles.formCol}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                style={styles.input}
                                value={formAdd.username}
                                onChangeText={(v) =>
                                    setFormAdd((f) => ({ ...f, username: v }))
                                }
                            />
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.formCol}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={formAdd.email}
                                onChangeText={(v) =>
                                    setFormAdd((f) => ({ ...f, email: v }))
                                }
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={styles.formCol}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={formAdd.phone_number}
                                onChangeText={(v) =>
                                    setFormAdd((f) => ({ ...f, phone_number: v }))
                                }
                            />
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.formCol}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                value={formAdd.password}
                                onChangeText={(v) =>
                                    setFormAdd((f) => ({ ...f, password: v }))
                                }
                                secureTextEntry
                            />
                        </View>
                        <View style={styles.formCol}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <TextInput
                                style={styles.input}
                                value={formAdd.password2}
                                onChangeText={(v) =>
                                    setFormAdd((f) => ({ ...f, password2: v }))
                                }
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <View style={styles.toggleRow}>
                        <View style={styles.toggleItem}>
                            <Text style={styles.label}>email_visible</Text>
                            <Switch
                                value={formAdd.email_visible}
                                onValueChange={(v) =>
                                    setFormAdd((f) => ({ ...f, email_visible: v }))
                                }
                            />
                        </View>
                        <View style={styles.toggleItem}>
                            <Text style={styles.label}>is_admin</Text>
                            <Switch
                                value={formAdd.is_admin}
                                onValueChange={(v) =>
                                    setFormAdd((f) => ({ ...f, is_admin: v }))
                                }
                            />
                        </View>
                    </View>

                    {errorAdd ? <Text style={styles.error}>{errorAdd}</Text> : null}

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.btn} onPress={clearAdd}>
                            <Text>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, styles.btnPrimary]}
                            onPress={handleCreate}
                            disabled={loadingAction}
                        >
                            <Text style={styles.btnPrimaryText}>
                                {loadingAction ? "Saving..." : "Create"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Edit */}
            {tab === "edit" && (
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Edit account</Text>
                    {!formEdit.id && (
                        <Text style={styles.muted}>
                            Select a row in the list or enter an ID below.
                        </Text>
                    )}

                    <View style={styles.formRow}>
                        <View style={styles.formCol}>
                            <Text style={styles.label}>User ID</Text>
                            <View style={styles.inlineRow}>
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    value={editIdInput}
                                    onChangeText={setEditIdInput}
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity
                                    style={[styles.btn, { marginLeft: 8 }]}
                                    onPress={handleLoadForEdit}
                                >
                                    <Text>Load</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.formCol}>
                            <Text style={styles.label}>Real Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formEdit.real_name}
                                onChangeText={(v) =>
                                    setFormEdit((f) => ({ ...f, real_name: v }))
                                }
                            />
                        </View>
                        <View style={styles.formCol}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                style={styles.input}
                                value={formEdit.username}
                                onChangeText={(v) =>
                                    setFormEdit((f) => ({ ...f, username: v }))
                                }
                            />
                        </View>
                    </View>

                    <View style={styles.formRow}>
                        <View style={styles.formCol}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={formEdit.email}
                                onChangeText={(v) =>
                                    setFormEdit((f) => ({ ...f, email: v }))
                                }
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={styles.formCol}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={formEdit.phone_number}
                                onChangeText={(v) =>
                                    setFormEdit((f) => ({ ...f, phone_number: v }))
                                }
                            />
                        </View>
                    </View>

                    <View style={styles.toggleRow}>
                        <View style={styles.toggleItem}>
                            <Text style={styles.label}>email_visible</Text>
                            <Switch
                                value={formEdit.email_visible}
                                onValueChange={(v) =>
                                    setFormEdit((f) => ({ ...f, email_visible: v }))
                                }
                            />
                        </View>
                        <View style={styles.toggleItem}>
                            <Text style={styles.label}>is_admin</Text>
                            <Switch
                                value={formEdit.is_admin}
                                onValueChange={(v) =>
                                    setFormEdit((f) => ({ ...f, is_admin: v }))
                                }
                            />
                        </View>
                    </View>

                    {errorEdit ? <Text style={styles.error}>{errorEdit}</Text> : null}

                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.btn, { opacity: formEdit.id ? 1 : 0.5 }]}
                            onPress={handleSaveEdit}
                            disabled={!formEdit.id || loadingAction}
                        >
                            <Text>Save changes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.btn,
                                { borderColor: "#b91c1c" }
                            ]}
                            onPress={handleDelete}
                            disabled={!formEdit.id || loadingAction}
                        >
                            <Text style={{ color: "#b91c1c" }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f4f6"
    },
    content: {
        padding: 16,
        paddingBottom: 32
    },
    title: {
        fontSize: 22,
        fontWeight: "700"
    },
    subtitle: {
        marginTop: 4,
        color: "#6b7280"
    },
    tabRow: {
        flexDirection: "row",
        marginTop: 12,
        marginBottom: 8,
        gap: 8
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        alignItems: "center"
    },
    tabActive: {
        borderColor: "#2563eb",
        backgroundColor: "#eff6ff"
    },
    tabText: {
        fontWeight: "600"
    },
    tabTextActive: {
        color: "#2563eb"
    },
    card: {
        marginTop: 8,
        padding: 16,
        backgroundColor: "#ffffff",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb"
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12
    },
    filterRow: {
        flexDirection: "row",
        gap: 12
    },
    filterCol: {
        flex: 1
    },
    filterAdminRow: {
        marginTop: 12
    },
    chipRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 6
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#d1d5db"
    },
    chipSelected: {
        backgroundColor: "#2563eb",
        borderColor: "#2563eb"
    },
    chipText: {
        fontSize: 13
    },
    chipTextSelected: {
        color: "#ffffff"
    },
    label: {
        fontSize: 13,
        marginBottom: 4,
        color: "#374151"
    },
    inputLarge: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10
    },
    actionRow: {
        marginTop: 16,
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 8
    },
    btn: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8
    },
    btnPrimary: {
        backgroundColor: "#2563eb",
        borderColor: "#2563eb"
    },
    btnPrimaryText: {
        color: "#ffffff",
        fontWeight: "600"
    },
    resultsHeader: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    userRow: {
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb"
    },
    userName: {
        fontWeight: "600"
    },
    userEmail: {
        color: "#6b7280",
        fontSize: 12
    },
    userLabel: {
        fontSize: 11,
        color: "#9ca3af"
    },
    muted: {
        marginTop: 8,
        color: "#6b7280"
    },
    pager: {
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    formRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8
    },
    formCol: {
        flex: 1
    },
    toggleRow: {
        flexDirection: "row",
        gap: 20,
        marginTop: 16
    },
    toggleItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    inlineRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    error: {
        marginTop: 8,
        color: "#b91c1c"
    }
});
