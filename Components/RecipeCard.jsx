import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BASE_URL from "../apiConfig";

// API endpoints
const api_getCounts = (id) => `${BASE_URL}/recipes/${id}/reactions`;
const api_react = (id) => `${BASE_URL}/recipes/${id}/react`;

export default function RecipeCard({ recipe }) {
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);

    // Fetch reaction counts when component mounts
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
                { reaction_type }, // backend expects this
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await refreshCounts();
        } catch (error) {
            console.log("Reaction error:", error.response?.data || error.message);
            Alert.alert("Error", "Something went wrong while updating reaction.");
        }
    };

    const toggleLike = () => {
        if (liked) {
            handleReaction(3); // undo like
        } else {
            handleReaction(1); // like
        }
    };

    const toggleDislike = () => {
        if (disliked) {
            handleReaction(3); // undo dislike
        } else {
            handleReaction(2); // dislike
        }
    };


    return (
        <View style={styles.card}>
            {/* Image Section */}
            <View style={styles.imageContainer}>
                {recipe.image_url && (
                    <Image
                        source={{ uri: recipe.image_url }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}
            </View>

            {/* Text Section */}
            <View style={styles.textContainer}>
                <Text style={styles.recipeName}>{recipe.recipeName}</Text>
                <Text style={styles.recipeCuisine}>{recipe.cuisineType}</Text>
                <Text style={styles.recipeChef}>
                    By {recipe.user?.userInfo?.name || "Unknown"}
                </Text>
            </View>

            {/* Buttons Section */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.viewButton]}>
                    <Text style={styles.buttonText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.likeButton]}
                    onPress={toggleLike}
                >
                    <MaterialIcons
                        name={liked ? "favorite" : "favorite-border"}
                        size={20}
                        color="#fff"
                    />
                    <Text style={styles.buttonText}>{likeCount}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.dislikeButton]}
                    onPress={toggleDislike}
                >
                    <MaterialIcons
                        name={disliked ? "thumb-down" : "thumb-down-off-alt"}
                        size={20}
                        color="#fff"
                    />
                    <Text style={styles.buttonText}>{dislikeCount}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

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
        height: 280,
        marginBottom: 12,
    },
    imageContainer: {
        width: "100%",
        height: 120,
        marginBottom: 8,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
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
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    viewButton: {
        backgroundColor: "#4A90E2",
    },
    likeButton: {
        backgroundColor: "#27ae60",
    },
    dislikeButton: {
        backgroundColor: "#e74c3c",
    },
    buttonText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 4,
    },
});
