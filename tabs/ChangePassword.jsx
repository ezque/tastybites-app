import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../apiConfig";

// ✅ Move this OUTSIDE the main component
const PasswordInput = ({ placeholder, value, onChangeText, visible, toggleVisible }) => (
    <View style={styles.passwordContainer}>
        <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder={placeholder}
            secureTextEntry={!visible}
            value={value}
            onChangeText={onChangeText}
        />
        <TouchableOpacity onPress={toggleVisible}>
            <Ionicons
                name={visible ? "eye" : "eye-off"}
                size={22}
                color="#777"
                style={styles.eyeIcon}
            />
        </TouchableOpacity>
    </View>
);

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New password and confirmation do not match.");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("access_token");

            const response = await axios.post(
                `${BASE_URL}/change-password`,
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (response.data.success) {
                Alert.alert("Success", response.data.message);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                Alert.alert("Error", response.data.message || "Something went wrong.");
            }
        } catch (error) {
            console.log("Change password error:", error.response?.data || error.message);
            if (error.response?.status === 422) {
                Alert.alert("Error", error.response.data.message || "Invalid password.");
            } else if (error.response?.status === 401) {
                Alert.alert("Unauthorized", "Please log in again.");
            } else {
                Alert.alert("Error", "Something went wrong. Try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Change Password</Text>

            <PasswordInput
                placeholder="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                visible={showCurrent}
                toggleVisible={() => setShowCurrent(!showCurrent)}
            />

            <PasswordInput
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                visible={showNew}
                toggleVisible={() => setShowNew(!showNew)}
            />

            <PasswordInput
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                visible={showConfirm}
                toggleVisible={() => setShowConfirm(!showConfirm)}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleChangePassword}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Update Password</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 30,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        marginBottom: 15,
        paddingRight: 10,
    },
    input: {
        padding: 12,
        fontSize: 16,
    },
    eyeIcon: {
        paddingHorizontal: 8,
    },
    button: {
        backgroundColor: "#8A2BE2",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
