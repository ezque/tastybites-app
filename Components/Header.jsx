import React from "react";
import { Text, View, StyleSheet, Image, TextInput } from "react-native";

export default function Header({ activeTab, onSearchChange }) {
    // Only show search for Home or Chef
    const showSearch = activeTab === "home" || activeTab === "chef" || activeTab === "recipe";

    return (
        <View style={styles.headerContainer}>
            <Image
                source={require("../assets/logo/tastybites second logo.png")}
                style={styles.headerLogo}
            />

            {showSearch && (
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder={
                            activeTab === "home" || activeTab === "recipe"
                                ? "Search recipes..."
                                : "Search chefs..."
                        }
                        style={styles.searchBar}
                        placeholderTextColor="#A0A0A0"
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
        paddingHorizontal: 10,
    },
    headerLogo: {
        width: 120,
        height: 40,
        resizeMode: "contain",
    },
    searchContainer: {
        width: 150,
        height: 35,
    },
    searchBar: {
        width: "100%",
        height: "100%",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 14,
    },
});
