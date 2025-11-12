import React from "react";
import { TextInput, View, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header({ activeTab, onSearchChange }) {
    // Only show search for Home, Chef, or Recipe tabs
    const showSearch = activeTab === "home" || activeTab === "chef" || activeTab === "recipe";

    return (
        <View style={styles.headerContainer}>
            <Image
                source={require("../assets/logo/tastybites second logo.png")}
                style={styles.headerLogo}
            />

            {showSearch && (
                <View style={styles.searchWrapper}>
                    <Ionicons
                        name="search"
                        size={18}
                        color="#A0A0A0"
                        style={styles.searchIcon}
                    />
                    <TextInput
                        placeholder={
                            activeTab === "home" || activeTab === "recipe"
                                ? "Search recipes..."
                                : "Search chefs..."
                        }
                        placeholderTextColor="#A0A0A0"
                        style={styles.searchInput}
                        onChangeText={onSearchChange}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: "100%",
        height: 100,
        backgroundColor: "white",
        paddingTop: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
    },
    headerLogo: {
        width: 130,
        height: 40,
        resizeMode: "contain",
    },
    searchWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F2F2",
        borderRadius: 25,
        paddingHorizontal: 10,
        height: 40,
        flex: 1,
        marginLeft: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2, // subtle shadow for Android
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "#333",
        paddingVertical: 5,
    },
});
