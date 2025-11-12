import React from "react";
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BASE_URL from "../apiConfig";

const getInitials = (name) => {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
};

export default function ChefCard({ chef, onPress }) {
    const baseServerURL = BASE_URL.replace(/\/api$/, "");

    const profilePath = chef.user_info?.profilePath;
    const hasProfileImage = profilePath && profilePath.trim() !== "";

    const avatarSource = hasProfileImage
        ? { uri: `${baseServerURL}/storage/${profilePath}` }
        : null;

    const fallbackBgColor = chef.user_info?.gender === "female" ? "#F8C8DC" : "#A7C7E7";
    const initials = getInitials(chef.user_info?.fullName);

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
            <View style={styles.avatarContainer}>
                {avatarSource ? (
                    <Image source={avatarSource} style={styles.avatarImage} resizeMode="cover" />
                ) : (
                    <View style={[styles.avatarFallback, { backgroundColor: fallbackBgColor }]}>
                        <Text style={styles.initialsText}>{initials}</Text>
                    </View>
                )}
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.nameText} numberOfLines={1}>
                    {chef.user_info?.fullName || "Unknown Chef"}
                </Text>
                <Text style={styles.emailText} numberOfLines={1}>
                    {chef.email}
                </Text>
                <Text style={styles.roleText}>Professional Chef</Text>

            </View>

            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.02)"]}
                style={styles.gradientOverlay}
                pointerEvents="none"
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "90%",
        height: 130,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        marginVertical: 10,
        flexDirection: "row",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 8,
        position: "relative",
        alignSelf: "center",
    },
    avatarContainer: {
        width: "35%",
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: "#FFF",
    },
    avatarFallback: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#E0E0E0",
    },
    initialsText: {
        fontSize: 24,
        fontWeight: "700",
        color: "#2C3E50",
    },
    infoContainer: {
        flex: 1,
        paddingVertical: 16,
        paddingRight: 16,
        justifyContent: "center",
    },
    nameText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2C3E50",
        marginBottom: 4,
    },
    emailText: {
        fontSize: 14,
        color: "#7F8C8D",
        marginBottom: 6,
    },
    roleText: {
        fontSize: 13,
        color: "#3498DB",
        fontWeight: "600",
        marginBottom: 10,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    viewButton: {
        alignSelf: "flex-end",
        backgroundColor: "#3498DB",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        ...Platform.select({
            ios: {
                shadowColor: "#3498DB",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    viewButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 20,
    },
});