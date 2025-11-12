import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import YoutubePlayer from "react-native-youtube-iframe";
import { Ionicons } from "@expo/vector-icons";

export default function RecipeDetails({ recipe, onBack, onBuyRecipe }) {
    if (!recipe) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No recipe selected</Text>
            </View>
        );
    }

    const imageSource = recipe.image_url
        ? { uri: recipe.image_url }
        : require("../assets/icon/recipes.png");

    const isFree = recipe.is_free === "free";
    const isPurchased = recipe.is_purchased === true;
    const isPending = recipe.purchase?.status === "pending";

    const showFullDetails = isFree || isPurchased;

    const extractVideoId = (url) => {
        if (!url) return null;
        const regExp =
            /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = extractVideoId(recipe.video_path);

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Back Button */}
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#2C3E50" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            {/* Recipe Image */}
            <View style={styles.imageContainer}>
                <Image source={imageSource} style={styles.recipeImage} resizeMode="cover" />
                <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.4)"]}
                    style={styles.imageGradient}
                />
                <View style={styles.imageOverlay}>
                    <Text style={styles.recipeNameOverlay}>{recipe.recipeName}</Text>
                    <Text style={styles.cuisineTypeOverlay}>{recipe.cuisineType}</Text>
                </View>
            </View>

            <View style={styles.infoCard}>
                {/* Price & Status */}
                <View style={styles.metaRow}>
                    <View style={styles.priceBadge}>
                        <Text style={styles.priceText}>
                            {isFree ? "FREE" : `₱${recipe.price}`}
                        </Text>
                    </View>
                    <Text style={styles.statusText}>
                        {recipe.status || "Available"}
                    </Text>
                </View>

                {/* Description */}
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>
                    {recipe.description || "No description available."}
                </Text>

                {/* Conditional Display */}
                {isPending ? (
                    <View style={styles.pendingContainer}>
                        <Ionicons name="time-outline" size={48} color="#FFA500" />
                        <Text style={styles.pendingTitle}>Purchase Pending</Text>
                        <Text style={styles.pendingText}>
                            Your payment is awaiting confirmation. You’ll get access once verified.
                        </Text>
                    </View>
                ) : !showFullDetails ? (
                    <TouchableOpacity
                        style={styles.buyButton}
                        activeOpacity={0.8}
                        onPress={() => onBuyRecipe(recipe)}
                    >
                        <Text style={styles.buyText}>Buy Recipe Now</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.fullDetails}>
                        {/* Ingredients */}
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        {recipe.ingredient && recipe.ingredient.length > 0 ? (
                            recipe.ingredient.map((item, index) => (
                                <View key={index} style={styles.ingredientRow}>
                                    <View style={styles.bullet} />
                                    <Text style={styles.ingredientText}>
                                        {item.ingredientName}
                                        {item.quantity ? ` – ${item.quantity}` : ""}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyDetail}>No ingredients listed.</Text>
                        )}

                        {/* Procedure */}
                        <Text style={styles.sectionTitle}>Procedure</Text>
                        {recipe.procedure && recipe.procedure.length > 0 ? (
                            recipe.procedure.map((step, index) => (
                                <View key={index} style={styles.stepRow}>
                                    <View style={styles.stepNumber}>
                                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                                    </View>
                                    <Text style={styles.stepText}>{step.instruction}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyDetail}>No procedure available.</Text>
                        )}

                        {/* Tutorial Video */}
                        <Text style={styles.sectionTitle}>Tutorial Video</Text>
                        {videoId ? (
                            <View style={styles.videoContainer}>
                                <YoutubePlayer
                                    height={220}
                                    play={false}
                                    videoId={videoId}
                                    webViewStyle={{ borderRadius: 16 }}
                                />
                            </View>
                        ) : (
                            <View style={styles.videoPlaceholder}>
                                <Ionicons name="play-circle-outline" size={48} color="#BBB" />
                                <Text style={styles.placeholderText}>No video available</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
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
    emptyText: {
        fontSize: 16,
        color: "#7F8C8D",
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: "#E8F4FD",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        marginBottom: 16,
        ...Platform.select({
            ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
            android: { elevation: 3 },
        }),
    },
    backText: {
        marginLeft: 6,
        fontSize: 16,
        fontWeight: "600",
        color: "#2C3E50",
    },
    imageContainer: {
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 16,
        height: 240,
    },
    recipeImage: { width: "100%", height: "100%" },
    imageGradient: { ...StyleSheet.absoluteFillObject },
    imageOverlay: { position: "absolute", bottom: 16, left: 16, right: 16 },
    recipeNameOverlay: {
        fontSize: 26,
        fontWeight: "800",
        color: "#FFFFFF",
        textShadowColor: "rgba(0,0,0,0.4)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    cuisineTypeOverlay: {
        fontSize: 15,
        color: "#FFFFFF",
        marginTop: 4,
        fontWeight: "600",
        textShadowColor: "rgba(0,0,0,0.4)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    infoCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 10,
    },
    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    priceBadge: {
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    priceText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1E8449",
    },
    statusText: { fontSize: 14, color: "#7F8C8D" },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2C3E50",
        marginTop: 16,
        marginBottom: 8,
    },
    descriptionText: { fontSize: 15, color: "#555", lineHeight: 23 },
    buyButton: {
        backgroundColor: "#28A745",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 20,
        ...Platform.select({
            ios: { shadowColor: "#28A745", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
            android: { elevation: 6 },
        }),
    },
    buyText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
    fullDetails: { marginTop: 16 },
    ingredientRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#3498DB",
        marginTop: 7,
        marginRight: 10,
    },
    ingredientText: { flex: 1, fontSize: 15, color: "#444", lineHeight: 22 },
    stepRow: { flexDirection: "row", marginBottom: 12 },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#3498DB",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    stepNumberText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
    stepText: { flex: 1, fontSize: 15, color: "#444", lineHeight: 22 },
    emptyDetail: { fontSize: 14, color: "#999", fontStyle: "italic", marginBottom: 8 },
    videoContainer: { borderRadius: 16, overflow: "hidden", marginTop: 8 },
    videoPlaceholder: {
        height: 220,
        backgroundColor: "#F0F0F0",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
    },
    placeholderText: { marginTop: 12, fontSize: 15, color: "#999" },
    pendingContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 30,
        backgroundColor: "#FFF8E1",
        borderRadius: 16,
        marginTop: 20,
    },
    pendingTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#E67E22",
        marginTop: 12,
    },
    pendingText: {
        fontSize: 15,
        color: "#A67C00",
        textAlign: "center",
        marginTop: 6,
        lineHeight: 22,
    },
});
