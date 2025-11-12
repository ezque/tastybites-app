import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../apiConfig"; // your backend URL

export default function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            const response = await axios.get(`${BASE_URL}/display-notification`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(response.data);
        } catch (error) {
            console.log("Error fetching notifications:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    const renderItem = ({ item }) => {
        return (
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.sender}>
                        {item.sender?.user_info?.userName || "Unknown Sender"}
                    </Text>
                    <Text style={styles.date}>
                        {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
                    </Text>
                </View>
                <Text style={styles.message}>{item.message || "No message"}</Text>
            </View>
        );
    };

    return (
        <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<Text style={styles.emptyText}>No notifications</Text>}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 10,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5, // for Android shadow
        borderLeftWidth: 5,
        borderLeftColor: "#4caf50", // accent color for the card
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    sender: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#333",
    },
    date: {
        fontSize: 12,
        color: "#999",
    },
    message: {
        fontSize: 14,
        color: "#555",
        lineHeight: 20,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 20,
        color: "#666",
        fontSize: 16,
    },
});
