import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import BASE_URL from "../apiConfig";

export default function Profile() {
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [gender, setGender] = useState("");
    const [profilePath, setProfilePath] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch profile data
    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            const response = await axios.get(`${BASE_URL}/user-profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const userInfo = response.data.user.user_info;
            if (userInfo) {
                setFullName(userInfo.fullName || "");
                setUserName(userInfo.userName || "");
                setGender(userInfo.gender || "");
                setProfilePath(userInfo.profilePath || null);
            }
        } catch (error) {
            console.log("Fetch profile error:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    };

    // Pick image from gallery
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission denied", "We need access to your photos.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setProfilePath(result.assets[0].uri);
        }
    };

    // Save profile
    const saveProfile = async () => {
        setSaving(true);
        try {
            const token = await AsyncStorage.getItem("access_token");
            const formData = new FormData();

            if (fullName) formData.append("fullName", fullName);
            if (userName) formData.append("userName", userName);
            if (gender === "Male" || gender === "Female" || gender === "Other") {
                formData.append("gender", gender);
            }

            if (profilePath && !profilePath.startsWith("http")) {
                const fileName = profilePath.split("/").pop();
                const fileType = `image/${fileName.split(".").pop()}`;
                formData.append("profilePath", {
                    uri: profilePath.startsWith("file://") ? profilePath : "file://" + profilePath,
                    name: fileName,
                    type: fileType,
                });
            }

            const response = await axios.post(`${BASE_URL}/edit-profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                Alert.alert("Success", response.data.message);
            } else {
                Alert.alert("Error", response.data.message || "Failed to update profile");
            }
        } catch (error) {
            console.log("Save profile error:", error.response?.data || error.message);
            Alert.alert("Error", "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };



    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    return (
        <View style={styles.container}>
            {/* Clickable Profile Image */}
            <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
                {profilePath ? (
                    <Image
                        source={{
                            uri: profilePath.startsWith("http") ? profilePath : profilePath,
                        }}
                        style={styles.profileImage}
                    />
                ) : (
                    <Ionicons name="person-circle" size={100} color="#ccc" />
                )}
            </TouchableOpacity>

            {/* Full Name */}
            <View style={styles.inputCard}>
                <Ionicons name="person" size={20} color="#555" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Full Name"
                />
            </View>

            {/* Username */}
            <View style={styles.inputCard}>
                <Ionicons name="at" size={20} color="#555" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    value={userName}
                    onChangeText={setUserName}
                    placeholder="Username"
                />
            </View>

            {/* Gender Dropdown */}
            <View style={styles.inputCard}>
                <Ionicons name="male-female" size={20} color="#555" style={styles.icon} />
                <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue) => setGender(itemValue)}
                    style={{ flex: 1 }}
                    mode="dropdown"
                >
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="Other" />
                </Picker>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.button} onPress={saveProfile} disabled={saving}>
                <Text style={styles.buttonText}>{saving ? "Saving..." : "Save Changes"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    profileImageContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    inputCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#2196F3",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
