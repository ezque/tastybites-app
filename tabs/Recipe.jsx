import React, { useEffect, useState } from "react";
import {
    View,
    FlatList,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RecipeCard from "../Components/RecipeCard";
import BASE_URL from "../apiConfig";

const api_URL = `${BASE_URL}/recipes/saved/purchase`;

export default function Recipe() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchRecipes = async (pageNumber = 1) => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            const response = await axios.get(`${api_URL}?page=${pageNumber}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const newRecipes = response.data.data; // ✅ paginated data
            if (pageNumber === 1) {
                setRecipes(newRecipes);
            } else {
                setRecipes((prev) => [...prev, ...newRecipes]);
            }

            setHasMore(response.data.next_page_url !== null);
        } catch (error) {
            console.log("Fetch recipes error:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to fetch recipes");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            setLoadingMore(true);
            setPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        fetchRecipes(page);
    }, [page]);

    if (loading && page === 1) {
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
