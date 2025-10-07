import {
    Text,
    TouchableOpacity,
    View,
    Alert
} from "react-native";
import axios from "axios";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BASE_URL from "../apiConfig";

const api_URL = `${BASE_URL}/logout`;
export default function Menu(){
    const logout = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            if (!token) {
                Alert.alert("Error", "No token found");
                return;
            }

            await axios.post(
                api_URL,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await AsyncStorage.removeItem("access_token");

            Alert.alert("Success", "Logged out successfully");
            router.replace("/");
        } catch (error) {
            console.log("Logout error:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to logout");
        }
    }
    return (
        <View>
            <TouchableOpacity onPress={logout}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}