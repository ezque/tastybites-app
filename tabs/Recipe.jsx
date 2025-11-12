import React, { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import RecipeCard from "../Components/RecipeCard";
import BASE_URL from "../apiConfig";
import Ionicons from 'react-native-vector-icons/Ionicons';

const api_URL = `${BASE_URL}/recipes/saved/purchase`;

export default function Recipe({ onViewRecipe, searchQuery }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [activeTab, setActiveTab] = useState("saved");

    const tabIcons = {
        saved: 'bookmark-outline',
        hidden: 'eye-off-outline',
        purchased: 'cart-outline',
    };
    const activeTabIcons = {
        saved: 'bookmark',
        hidden: 'eye-off',
        purchased: 'cart',
    };

    const fetchRecipes = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("access_token");
            const response = await axios.get(`${api_URL}?page=${pageNumber}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const newRecipes = response.data.data;
            if (pageNumber === 1) {
                setRecipes(newRecipes);
            } else {
                setRecipes((prev) => [...prev, ...newRecipes]);
            }

            setHasMore(response.data.next_page_url !== null);
        } catch (error) {
            console.log("Fetch recipes error:", error.response?.data || error.message);
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

    const switchTab = (tab) => {
        setActiveTab(tab);
    };

    // 🔹 Filter recipes based on active tab
    const filteredByTab = recipes.filter((recipe) => {
        if (activeTab === "saved") return recipe.is_saved;
        if (activeTab === "hidden") return recipe.is_hidden;
        if (activeTab === "purchased") return recipe.is_purchased;
        return true;
    });

    // 🔹 Filter recipes further based on search query
    const filteredRecipes = filteredByTab.filter((recipe) => {
        if (!searchQuery || searchQuery.trim() === "") return true;
        return recipe.recipeName?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    useEffect(() => {
        fetchRecipes(page);
    }, [page]);

    if (loading && page === 1) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
                {["saved", "hidden", "purchased"].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tabButton,
                            activeTab === tab && styles.activeTabButton,
                        ]}
                        onPress={() => switchTab(tab)}
                    >
                        <Ionicons
                            name={activeTab === tab ? activeTabIcons[tab] : tabIcons[tab]}
                            size={20}
                            color={activeTab === tab ? styles.activeTabText.color : styles.tabText.color}
                            style={styles.tabIcon}
                        />
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                            ]}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

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
        </View>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#fff",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    tabButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
        marginHorizontal: 4,
        minWidth: 100,
        justifyContent: 'center',
    },
    activeTabButton: {
        backgroundColor: "#FF6347",
        shadowColor: "#FF6347",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    tabText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#555",
        marginLeft: 6,
    },
    activeTabText: {
        color: "#fff",
        fontWeight: "700",
    },
    tabIcon: {},
    listContainer: {
        padding: 10,
    },
    cardContainer: {
        flex: 1,
        margin: 5,
    },
});
