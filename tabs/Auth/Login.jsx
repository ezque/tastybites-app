import {
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { router } from "expo-router";

import BASE_URL from "../../apiConfig";

const api_URL = `${BASE_URL}/login`;

export default function Login({ changeTab }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("123456");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const toggleShowPassword = () => setShowPassword(!showPassword);

    const emailErrorTimeoutRef = useRef(null);
    const passwordErrorTimeoutRef = useRef(null);

    const handleLogin = async () => {
        if (emailErrorTimeoutRef.current) clearTimeout(emailErrorTimeoutRef.current);
        if (passwordErrorTimeoutRef.current) clearTimeout(passwordErrorTimeoutRef.current);

        setEmailError('');
        setPasswordError('');

        if (!email || !password) {
            if (!email) {
                setEmailError('Please enter your email.');
                emailErrorTimeoutRef.current = setTimeout(() => setEmailError(''), 5000);
            }
            if (!password) {
                setPasswordError('Please enter your password.');
                passwordErrorTimeoutRef.current = setTimeout(() => setPasswordError(''), 5000);
            }
            return;
        }

        try {
            console.log("Sending to:", api_URL);
            console.log("Payload:", { email, password });
            const response = await axios.post(api_URL, { email, password });
            const { access_token, role, id } = response.data;

            if (id) {
                await AsyncStorage.setItem('access_token', access_token);
                await AsyncStorage.setItem('user_role', role);
                await AsyncStorage.setItem('user_id', id.toString());
            } else {
                setEmailError("Login failed: User ID missing.");
                emailErrorTimeoutRef.current = setTimeout(() => setEmailError(''), 5000);
                return;
            }
            router.push('/User');
        } catch (error) {
            if (error.response) {
                const data = error.response.data;
                const status = error.response.status;

                if (status === 401) {
                    setPasswordError(data.message || "Incorrect email or password.");
                    passwordErrorTimeoutRef.current = setTimeout(() => setPasswordError(''), 5000);
                } else if (status === 404) {
                    setEmailError(data.message || "Email not registered.");
                    emailErrorTimeoutRef.current = setTimeout(() => setEmailError(''), 5000);
                } else {
                    console.log("Backend responded with error:", data);
                }
            } else if (error.request) {
                console.log("No response received. Request details:", error.request);
            } else {
                console.log("Error setting up request:", error.message);
            }
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <Image source={require("../../assets/logo/tastybites icon.png")} style={styles.logo} />
                    <Text style={styles.welcomeText}>Welcome Back!</Text>

                    <View style={styles.inputs}>

                        {/* Email Error Message */}
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="email-outline" style={styles.inputIcon} />
                            <TextInput
                                style={{ flex: 1, marginLeft: 5 }}
                                placeholder="Email"
                                placeholderTextColor={"#AFADAD"}
                                keyboardType={"email-address"}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize={"none"}
                            />
                        </View>

                        {/* Password Error Message */}
                        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="lock-outline" style={styles.inputIcon} />
                            <TextInput
                                style={{ flex: 1, marginLeft: 5 }}
                                placeholder="Password"
                                placeholderTextColor={"#AFADAD"}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                autoCapitalize={"none"}
                            />
                            <TouchableOpacity style={styles.eyeIconButton} onPress={toggleShowPassword}>
                                <MaterialCommunityIcons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    style={styles.eyeIcon}
                                />
                            </TouchableOpacity>
                        </View>

                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>LOGIN</Text>
                    </TouchableOpacity>

                    <View style={styles.beforefooter}>
                        <Text style={styles.beforefooterText}>Don't Have an Account? </Text>
                        <TouchableOpacity onPress={() => changeTab(false)}>
                            <Text style={styles.regBttn}>Register</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Image source={require("../../assets/logo/tastybites second logo.png")} style={styles.footerLogo} />
                        <Text style={styles.footerText}>©Tastybites. All rights reserved.</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 30 },
    inner: { justifyContent: "flex-end", alignItems: "center", flexDirection: "column", paddingTop: 40 },
    logo: { width: 400, height: 400 },
    welcomeText: { fontFamily: "RougeScript-Regular", fontSize: 50, bottom: 30, fontWeight: "200", paddingHorizontal: 10 },
    inputs: { width: "100%", gap: 10 },
    inputIcon: { fontSize: 20, color: "#AFADAD" },
    eyeIconButton: { fontSize: 20, color: "#AFADAD", position: "absolute", right: 10 },
    eyeIcon: { fontSize: 20, color: "#AFADAD" },
    inputContainer: { width: "100%", borderWidth: 0.5, padding: 10, paddingVertical: 5, flexDirection: "row", alignItems: "center", borderRadius: 10, backgroundColor: "white", elevation: 4, borderColor: 'white' },
    button: { width: "100%", paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 30, backgroundColor: "#435F77", marginTop: 20 },
    buttonText: { color: "white", fontSize: 18, fontWeight: "bold", fontFamily: "Roboto-Bold" },
    beforefooter: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 5 },
    beforefooterText: { color: "black", fontSize: 16, fontWeight: "regular" },
    footer: { alignItems: "center", justifyContent: "center", flexDirection: "column", top: 55, gap: 5 },
    footerLogo: { width: 90, height: 30 },
    footerText: { fontSize: 15 },
    regBttn: { color: 'blue' },
    errorText: { color: "#D64545", marginBottom: 5, alignSelf: "flex-start", marginLeft: 5 }
});
