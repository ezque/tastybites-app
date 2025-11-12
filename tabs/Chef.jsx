import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChefCard from "../Components/ChefCard";
import BASE_URL from "../apiConfig";

const api_URL = `${BASE_URL}/all/chefs-information`;

export default function Chef({ onSelectChef, searchQuery }) {
    const [chefs, setChefs] = useState([]);
    const [filteredChefs, setFilteredChefs] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Fetch chefs from backend
    const fetchChefs = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            const response = await axios.get(api_URL, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setChefs(response.data);
            setFilteredChefs(response.data);
        } catch (error) {
            console.log("Error fetching chefs:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to fetch chefs");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Filter chefs whenever searchQuery changes
    useEffect(() => {
        if (!searchQuery || searchQuery.trim() === "") {
            setFilteredChefs(chefs);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = chefs.filter((chef) => {
                // Adjust the property names based on your API response
                const name = chef.user_info?.userName || chef.name || "";
                return name.toLowerCase().includes(lowerQuery);
            });
            setFilteredChefs(filtered);
        }
    }, [searchQuery, chefs]);

    // 🔹 Fetch data on mount
    useEffect(() => {
        fetchChefs();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {filteredChefs.map((chef) => (
                <ChefCard
                    key={chef.id}
                    chef={chef}
                    onPress={() => onSelectChef(chef)}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: 10,
    },
});
