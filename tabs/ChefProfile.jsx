import React, { useEffect, useState } from "react";
import {
    View,
    Image,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../apiConfig";
import RecipeCard from "../Components/RecipeCard";

const getInitials = (name) => {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
};

export default function ChefProfile({ chef, onViewRecipe }) {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // "premium" | "free" | "all"
    const [openMenuId, setOpenMenuId] = useState(null);

    if (!chef) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No chef selected</Text>
            </View>
        );
    }

    const baseServerURL = BASE_URL.replace(/\/api$/, "");
    const profilePath = chef.user_info?.profilePath;
    const hasProfileImage = profilePath && profilePath.trim() !== "";

    const avatarSource = hasProfileImage
        ? { uri: `${baseServerURL}/storage/${profilePath}` }
        : null;

    const fallbackBgColor =
        chef.user_info?.gender === "female" ? "#F8C8DC" : "#A7C7E7";
    const initials = getInitials(chef.user_info?.fullName);

    // ✅ Fetch all recipes by this chef
    useEffect(() => {
        const fetchChefRecipes = async () => {
            try {
                const token = await AsyncStorage.getItem("access_token");
                const response = await axios.get(
                    `${BASE_URL}/recipes/chef/${chef.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }
                );
                const recipeList = response.data.data || [];
                setRecipes(recipeList);
                setFilteredRecipes(recipeList);
            } catch (error) {
                console.error("Error fetching chef recipes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChefRecipes();
    }, [chef.id]);

    // ✅ Filter recipes when user changes filter
    useEffect(() => {
        if (filter === "all") {
            setFilteredRecipes(recipes);
        } else {
            setFilteredRecipes(recipes.filter((r) => r.is_free === filter));
        }
    }, [filter, recipes]);

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Main Chef Card */}
            <View style={styles.card}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    {avatarSource ? (
                        <Image
                            source={avatarSource}
                            style={styles.avatarImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View
                            style={[
                                styles.avatarFallback,
                                { backgroundColor: fallbackBgColor },
                            ]}
                        >
                            <Text style={styles.initialsText}>{initials}</Text>
                        </View>
                    )}
                </View>

                {/* Info Section */}
                <View style={styles.infoSection}>
                    <Text style={styles.nameText}>
                        {chef.user_info?.fullName || "Unknown Chef"}
                    </Text>
                    <Text style={styles.emailText}>{chef.email}</Text>
                    <Text style={styles.roleText}>Professional Chef</Text>

                    {chef.user_info?.experience && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Experience:</Text>
                            <Text style={styles.detailValue}>
                                {chef.user_info.experience} years
                            </Text>
                        </View>
                    )}

                    {chef.user_info?.bio && (
                        <Text style={styles.bioText}>{chef.user_info.bio}</Text>
                    )}
                </View>

                {/* ✅ Filter Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            filter === "premium" && styles.activeFilter,
                        ]}
                        onPress={() => setFilter("premium")}
                    >
                        <Image
                            source={require("../assets/icon/premium-icon.png")}
                            style={[
                                styles.buttonIcon,
                                filter === "premium" && styles.activeIcon,
                            ]}
                        />
                        <Text
                            style={[
                                styles.filterLabel,
                                filter === "premium" && styles.activeLabel,
                            ]}
                        >
                            Premium
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            filter === "free" && styles.activeFilter,
                        ]}
                        onPress={() => setFilter("free")}
                    >
                        <Image
                            source={require("../assets/icon/checkIcon.png")}
                            style={[
                                styles.buttonIcon,
                                filter === "free" && styles.activeIcon,
                            ]}
                        />
                        <Text
                            style={[
                                styles.filterLabel,
                                filter === "free" && styles.activeLabel,
                            ]}
                        >
                            Free
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            filter === "all" && styles.activeFilter,
                        ]}
                        onPress={() => setFilter("all")}
                    >
                        <Image
                            source={require("../assets/icon/recipes.png")}
                            style={[
                                styles.buttonIcon,
                                filter === "all" && styles.activeIcon,
                            ]}
                        />
                        <Text
                            style={[
                                styles.filterLabel,
                                filter === "all" && styles.activeLabel,
                            ]}
                        >
                            All
                        </Text>
                    </TouchableOpacity>
                </View>

                <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.03)"]}
                    style={styles.gradientOverlay}
                    pointerEvents="none"
                />
            </View>

            {/* 🧁 Chef’s Recipes Section */}
            <Text style={styles.sectionTitle}>Chef’s Recipes</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#3498DB" />
            ) : filteredRecipes.length > 0 ? (
                <View style={styles.recipeGrid}>
                    {filteredRecipes.map((recipe) => (
                        <View key={recipe.id} style={styles.recipeCardWrapper}>
                            <RecipeCard
                                recipe={recipe}
                                onViewRecipe={onViewRecipe}
                                isMenuOpen={openMenuId === recipe.id}
                                onToggleMenu={() =>
                                    setOpenMenuId(
                                        openMenuId === recipe.id ? null : recipe.id
                                    )
                                }
                            />
                        </View>
                    ))}
                </View>
            ) : (
                <Text style={styles.emptyText}>No recipes found</Text>
            )}
        </ScrollView>
    );
}

/* ------------------------------------------------------------------ */
/*                           STYLES                                   */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: "#F5F7FA",
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F7FA",
    },
    emptyText: { fontSize: 16, color: "#7F8C8D" },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        overflow: "hidden",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 12,
        position: "relative",
    },

    avatarContainer: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 10,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: "#FFFFFF",
        backgroundColor: "#f0f0f0",
    },
    avatarFallback: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#E0E0E0",
    },
    initialsText: { fontSize: 28, fontWeight: "700", color: "#2C3E50" },

    infoSection: {
        marginLeft: 130,
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    nameText: {
        fontSize: 24,
        fontWeight: "800",
        color: "#2C3E50",
        marginBottom: 4,
    },
    emailText: { fontSize: 15, color: "#7F8C8D", marginBottom: 6 },
    roleText: {
        fontSize: 13,
        color: "#3498DB",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 12,
    },
    detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    detailLabel: { fontSize: 14, color: "#555", marginRight: 6 },
    detailValue: { fontSize: 14, fontWeight: "600", color: "#2C3E50" },
    bioText: { fontSize: 14, color: "#555", lineHeight: 22, marginTop: 8 },

    /* ✅ Filter Buttons */
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: "#F8FAFD",
        borderTopWidth: 1,
        borderTopColor: "#E8ECEF",
    },
    filterButton: {
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D6DBDF",
        shadowColor: "transparent",
    },
    activeFilter: {
        backgroundColor: "#D6EAF8",
        borderColor: "#3498DB",
        shadowColor: "#3498DB",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonIcon: {
        width: 32,
        height: 32,
        marginBottom: 4,
        tintColor: "#7F8C8D",
    },
    activeIcon: {
        tintColor: "#2E86C1",
    },
    filterLabel: {
        fontSize: 12,
        color: "#7F8C8D",
        fontWeight: "600",
    },
    activeLabel: {
        color: "#2E86C1",
        fontWeight: "700",
    },

    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2C3E50",
        marginVertical: 12,
    },

    /* ✅ Grid Layout for Recipes */
    recipeGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingBottom: 20,
    },
    recipeCardWrapper: {
        width: "48%", // 2 per row
        marginBottom: 16,
    },
});
