import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../apiConfig";

const api_getCounts = (id) => `${BASE_URL}/recipes/${id}/reactions`;
const api_react = (id) => `${BASE_URL}/recipes/${id}/react`;

export default function RecipeCard({ recipe, onViewRecipe, isMenuOpen, onToggleMenu }) {
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likeCount, setLikeCount] = useState(recipe.total_likes || 0);
    const [dislikeCount, setDislikeCount] = useState(recipe.total_dislikes || 0);

    // Determine free or premium
    const isPremium = recipe.is_free === 'premium';

    // Get image (remove /api from BASE_URL)
    const imageURI = recipe.image_url
        ? recipe.image_url.replace("/api", "")
        : `${BASE_URL.replace("/api", "")}/images/default-recipe.png`;

    useEffect(() => {
        refreshCounts();
    }, []);

    const refreshCounts = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            const response = await axios.get(api_getCounts(recipe.id), {
                headers: { Authorization: `Bearer ${token}` },
            });

            setLikeCount(response.data.total_likes);
            setDislikeCount(response.data.total_dislikes);

            if (response.data.user_reaction === 1) {
                setLiked(true);
                setDisliked(false);
            } else if (response.data.user_reaction === 2) {
                setLiked(false);
                setDisliked(true);
            } else {
                setLiked(false);
                setDisliked(false);
            }
        } catch (err) {
            console.log("refreshCounts error:", err.response?.data || err.message);
        }
    };

    const handleReaction = async (reaction_type) => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            await axios.post(
                api_react(recipe.id),
                { reaction_type },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await refreshCounts();
        } catch (error) {
            console.log("Reaction error:", error.response?.data || error.message);
            Alert.alert("Error", "Something went wrong while updating reaction.");
        }
    };

    const toggleLike = () => handleReaction(liked ? 3 : 1);
    const toggleDislike = () => handleReaction(disliked ? 3 : 2);

    const handleMenuAction = (action) => {
        onToggleMenu(); // close menu
        Alert.alert("Action", `${action} clicked!`);
    };
    const saveUnsaveRecipe = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            const response = await axios.post(
                `${BASE_URL}/save-unsave-recipe/${recipe.id}`,
                {}, // no body needed
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state
            const newStatus = response.data.save_status === 1;
            recipe.is_saved = newStatus;
            Alert.alert("Success", newStatus ? "Recipe saved!" : "Recipe removed from saved!");
        } catch (error) {
            console.log("Save/Unsave error:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to save recipe.");
        }
    };

    const hideUnhideRecipe = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            const response = await axios.post(
                `${BASE_URL}/hide-unhide-recipe/${recipe.id}`,
                {}, // no body needed
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state
            const newStatus = response.data.hide.is_hidden === "1" || response.data.hide.is_hidden === 1;
            recipe.is_hidden = newStatus;

            Alert.alert(
                "Success",
                newStatus ? "Recipe hidden!" : "Recipe is now visible!"
            );
        } catch (error) {
            console.log("Hide/Unhide error:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to update recipe visibility.");
        }
    };



    return (
        <View style={styles.card}>
            {/* Premium Badge */}
            {isPremium && (
                <Image
                    source={require("../assets/icon/premium-icon.png")}
                    style={styles.premiumIcon}
                />
            )}

            {/* Menu Button */}
            <TouchableOpacity style={styles.menuButton} onPress={onToggleMenu}>
                <MaterialIcons name="more-vert" size={22} color="#333" />
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={saveUnsaveRecipe}
                    >
                        <Ionicons name={recipe.is_saved ? "bookmark" : "bookmark-outline"} size={18} color="#2C3E50" />
                        <Text style={styles.menuText}>{recipe.is_saved ? "Unsave" : "Save"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={hideUnhideRecipe}
                    >
                        <Ionicons
                            name={recipe.is_hidden ? "eye-outline" : "eye-off-outline"}
                            size={18}
                            color="#2C3E50"
                        />
                        <Text style={styles.menuText}>
                            {recipe.is_hidden ? "Unhide" : "Hide"}
                        </Text>
                    </TouchableOpacity>


                    <View style={styles.menuDivider} />

                    <TouchableOpacity
                        style={[styles.menuItem, styles.dangerItem]}
                        onPress={() => handleMenuAction("Report")}
                    >
                        <Ionicons name="flag-outline" size={18} color="#E74C3C" />
                        <Text style={[styles.menuText, styles.dangerText]}>Report</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Recipe Image */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageURI }} style={styles.image} resizeMode="cover" />
            </View>

            {/* Text Info */}
            <View style={styles.textContainer}>
                <Text style={styles.recipeName} numberOfLines={1}>
                    {recipe.recipeName}
                </Text>
                <Text style={styles.recipeCuisine} numberOfLines={1}>
                    Cuisine: {recipe.cuisineType || "N/A"}
                </Text>
                <Text style={styles.recipeChef}>
                    Chef: @{recipe.user?.user_info?.userName || "Unknown"}
                </Text>
            </View>

            {/* Actions */}
            <View style={styles.buttonContainer}>
                <View style={styles.viewButtonMain}>
                    <TouchableOpacity
                        style={styles.viewButton}
                        onPress={() => onViewRecipe(recipe)}
                    >
                        <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.reactionMain}>
                    <View style={styles.reactionContainer}>
                        <TouchableOpacity style={styles.likeButton} onPress={toggleLike}>
                            <MaterialIcons
                                name={liked ? "favorite" : "favorite-border"}
                                size={20}
                                color={liked ? "red" : "black"}
                            />
                        </TouchableOpacity>
                        <Text style={styles.buttonText}>{likeCount}</Text>
                    </View>

                    <View style={styles.reactionContainer}>
                        <TouchableOpacity
                            style={styles.dislikeButton}
                            onPress={toggleDislike}
                        >
                            <MaterialIcons
                                name={disliked ? "thumb-down" : "thumb-down-off-alt"}
                                size={20}
                                color={disliked ? "red" : "black"}
                            />
                        </TouchableOpacity>
                        <Text style={styles.buttonText}>{dislikeCount}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

/* ------------------------------------------------------------------ */
/*                             STYLES                                 */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
        width: 160,
        height: 250,
        marginBottom: 12,
        position: "relative",
    },
    imageContainer: {
        width: "90%",
        height: 120,
        marginBottom: 8,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 80,
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    recipeName: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 4,
        color: "#333",
    },
    recipeCuisine: {
        fontSize: 13,
        textAlign: "center",
        color: "#666",
    },
    recipeChef: {
        fontSize: 12,
        textAlign: "center",
        color: "#999",
        fontStyle: "italic",
    },
    buttonContainer: {
        width: "100%",
        height: 40,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    viewButtonMain: {
        width: "60%",
        alignItems: "center",
        justifyContent: "center",
    },
    reactionMain: {
        width: "40%",
        flexDirection: "row",
    },
    reactionContainer: {
        width: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    viewButton: {
        backgroundColor: "#4A90E2",
        width: "100%",
        height: "70%",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    likeButton: {
        width: 20,
        height: 20,
    },
    dislikeButton: {
        width: 20,
        height: 20,
    },
    viewButtonText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },
    buttonText: {
        color: "#000",
        fontSize: 12,
        fontWeight: "600",
    },
    premiumIcon: {
        position: "absolute",
        top: 4,
        left: 2,
        width: 24,
        height: 24,
        zIndex: 10,
    },
    menuButton: {
        position: "absolute",
        top: 4,
        right: 4,
        zIndex: 11,
        padding: 4,
    },
    dropdownMenu: {
        position: "absolute",
        top: 32,
        right: 6,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        paddingVertical: 8,
        width: 160,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 12,
        zIndex: 100,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    menuText: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: "600",
        color: "#2C3E50",
    },
    dangerItem: {},
    dangerText: {
        color: "#E74C3C",
    },
    menuDivider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginHorizontal: 12,
        marginVertical: 4,
    },
});
