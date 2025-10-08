import React, { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    View,
    ActivityIndicator,
    Alert,
    Text
} from "react-native";
import RecipeCard from "../Components/RecipeCard";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BASE_URL from "../apiConfig";

const api_URL = `${BASE_URL}/recipes`;

export default function Home() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecipes = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token");

            const response = await axios.get(api_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setRecipes(response.data);
        } catch (error) {
            console.log("Fetch recipes error:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to fetch recipes");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchRecipes();
    }, []);
    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    return (
        <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                    <RecipeCard recipe={item} />
                </View>
            )}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 10,
    },
    cardContainer: {
        flex: 1,
        margin: 5,
    },
});
