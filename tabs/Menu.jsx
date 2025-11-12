import React from "react";
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Alert
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BASE_URL from "../apiConfig";

const api_URL = `${BASE_URL}/logout`;

export default function Menu({ onTabChange }) {
    const logout = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            if (!token) {
                Alert.alert("Error", "No token found");
                return;
            }

            await axios.post(
                api_URL,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await AsyncStorage.removeItem("access_token");

            Alert.alert("Success", "Logged out successfully");
            router.replace("/");
        } catch (error) {
            console.log("Logout error:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to logout");
        }
    };

    const MenuItem = ({ title, icon, onPress, bgColor, textColor }) => (
        <TouchableOpacity
            style={[styles.menuCard, { backgroundColor: bgColor || "#fff" }]}
            onPress={onPress}
        >
            <View style={styles.menuContent}>
                <MaterialIcons name={icon} size={24} color={textColor || "#333"} />
                <Text style={[styles.menuText, { color: textColor || "#333" }]}>{title}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <MenuItem
                title="Profile"
                icon="person"
                onPress={() => onTabChange("profile")}
            />
            <MenuItem
                title="Change Password"
                icon="lock"
                onPress={() => onTabChange("changePassword")}
            />
            <MenuItem
                title="Logout"
                icon="logout"
                onPress={logout}
                bgColor="#e53935"
                textColor="#fff"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: "#f2f2f2",
        justifyContent: "flex-start",
    },
    menuCard: {
        padding: 20,
        marginBottom: 15,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
    },
    menuContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    menuText: {
        fontSize: 18,
        fontWeight: "bold",
    },
});
