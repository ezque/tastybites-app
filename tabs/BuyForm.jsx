import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import BASE_URL from "../apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BuyForm({ recipe, onBack }) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [amount, setAmount] = useState(recipe?.price?.toString() || "");
    const [reference, setReference] = useState("");
    const [proof, setProof] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pick proof of payment image
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setProof(result.assets[0]);
        }
    };

    // Submit purchase form
    const handleSubmit = async () => {
        if (!phoneNumber || !amount || !reference || !proof) {
            Alert.alert("Incomplete Form", "Please fill in all fields and upload proof.");
            return;
        }

        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append("recipeID", recipe.id);
            formData.append("phone_number", phoneNumber);
            formData.append("amount", amount);
            formData.append("reference", reference);
            formData.append("proof", {
                uri: proof.uri,
                name: "proof.jpg",
                type: "image/jpeg",
            });

            const token = await AsyncStorage.getItem("access_token");

            const response = await axios.post(`${BASE_URL}/buy-recipe`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                Alert.alert("Success", response.data.message);
                onBack?.();
            }
        } catch (error) {
            console.error("Buy Recipe Error:", error.response?.data || error.message);
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Recipe Info */}
            <Text style={styles.title}>Buy Recipe</Text>
            <View style={styles.recipeCard}>
                <Text style={styles.recipeName}>{recipe?.recipeName}</Text>
                <Text style={styles.recipePrice}>₱{recipe?.price}</Text>
            </View>

            {/* Form Fields */}
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />

            <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
            />

            <TextInput
                style={styles.input}
                placeholder="Reference Number"
                value={reference}
                onChangeText={setReference}
            />

            {/* Proof of Payment */}
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {proof ? (
                    <Image source={{ uri: proof.uri }} style={styles.proofImage} />
                ) : (
                    <Text style={styles.imageText}>Upload Proof of Payment</Text>
                )}
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                <Text style={styles.submitText}>
                    {isSubmitting ? "Submitting..." : "Submit Purchase"}
                </Text>
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#F5F7FA",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#2C3E50",
        marginBottom: 20,
        textAlign: "center",
    },
    recipeCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        elevation: 3,
    },
    recipeName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2C3E50",
    },
    recipePrice: {
        fontSize: 16,
        color: "#27AE60",
        marginTop: 4,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        fontSize: 16,
    },
    imagePicker: {
        backgroundColor: "#E8F4FD",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        height: 160,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    imageText: {
        color: "#7F8C8D",
        fontSize: 16,
    },
    proofImage: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
    },
    submitButton: {
        backgroundColor: "#27AE60",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        marginBottom: 16,
    },
    submitText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "700",
    },
    backButton: {
        alignItems: "center",
        paddingVertical: 10,
    },
    backText: {
        fontSize: 16,
        color: "#3498DB",
        fontWeight: "600",
    },
});
