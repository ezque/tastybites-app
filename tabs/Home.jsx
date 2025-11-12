import React, { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    View,
    ActivityIndicator,
    Alert,
} from "react-native";
import RecipeCard from "../Components/RecipeCard";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../apiConfig";

const api_URL = `${BASE_URL}/recipes`;

export default function Home({ onViewRecipe, searchQuery }) {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);

    // 🔹 Fetch recipes (with pagination)
    const fetchRecipes = async (pageNumber = 1) => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            const response = await axios.get(`${api_URL}?page=${pageNumber}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const newRecipes = response.data.data;

            // Replace or append depending on page number
            const updatedRecipes =
                pageNumber === 1 ? newRecipes : [...recipes, ...newRecipes];

            setRecipes(updatedRecipes);
            setHasMore(response.data.next_page_url !== null);

            // Initial filter (in case searchQuery is not empty)
            applySearchFilter(updatedRecipes, searchQuery);
        } catch (error) {
            console.log("Fetch recipes error:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to fetch recipes");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // 🔹 Filter recipes based on search query
    const applySearchFilter = (data, query) => {
        if (!query || query.trim() === "") {
            setFilteredRecipes(data);
        } else {
            const filtered = data.filter((r) =>
                r.recipeName?.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredRecipes(filtered);
        }
    };

    // 🔹 Handle pagination
    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            setPage((prev) => prev + 1);
        }
    };

    // 🔹 Fetch recipes when page changes
    useEffect(() => {
        fetchRecipes(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    // 🔹 Re-filter recipes when search query changes
    useEffect(() => {
        applySearchFilter(recipes, searchQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    if (loading && page === 1) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    return (
        <FlatList
            data={filteredRecipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                    <RecipeCard
                        recipe={item}
                        onViewRecipe={onViewRecipe}
                        isMenuOpen={openMenuId === item.id}
                        onToggleMenu={() =>
                            setOpenMenuId(openMenuId === item.id ? null : item.id)
                        }
                    />
                </View>
            )}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
                loadingMore ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
            }
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
