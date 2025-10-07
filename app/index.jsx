import {
    StyleSheet,
    View,
    Image,
    ActivityIndicator,
    Text
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";

import Login from "../tabs/Auth/Login";
import Register from "../tabs/Auth/Register";

export default function Index() {
    const [showLogin, setShowLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const checkLocalToken = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const role = await AsyncStorage.getItem('user_role');

            if (token && role) {
                console.log("Found token. Redirecting...");
                if (role === "chef") {
                    router.replace('/Chef');
                } else if (role === "user") {
                    router.replace('/User');
                }
            }
        } catch (e) {
            console.error("Failed to read token from AsyncStorage", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkLocalToken();
    }, []);

    const changeTab = (showLoginTab) => {
        setShowLogin(showLoginTab);
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6347" />
                <Text style={styles.loadingText}>Loading session...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/logo/backGround.jpg')}
                style={styles.imageBackgroound}
            />
            {showLogin ? <Login changeTab={changeTab} /> : <Register changeTab={changeTab}/>}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    imageBackgroound: {
        width: 250,
        height: 250,
        position: "absolute",
        right: 0,
        top: 0,
    }
});
