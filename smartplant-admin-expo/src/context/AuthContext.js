// contexts/AuthContext.tsx
import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

interface User {
    id: number;
    email: string;
    real_name: string;
    is_admin: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    login: async () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("admin_user");
        if (saved) setUser(JSON.parse(saved));
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const res = await api("login.php", {
            method: "POST",
            body: { email, password },
        });

        if (!res.is_admin) throw new Error("You are not an admin.");

        setUser(res);
        localStorage.setItem("admin_user", JSON.stringify(res));
        router.replace("/dashboard");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("admin_user");
        router.replace("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
