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
    Keyboard,
    ActivityIndicator, // Import for a loading state
    ScrollView
} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {useRef, useState, useEffect} from "react"; // Import useEffect
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import {router} from "expo-router";

import BASE_URL from "../../apiConfig";

const api_URL = `${BASE_URL}/login`;
export default function Login({changeTab}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("123456");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(true); // New loading state

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    const emailErrorTimeoutRef = useRef(null);
    const passwordErrorTimeoutRef = useRef(null);

    // --- New Code for Auto-Login Check ---

    const checkLocalToken = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const role = await AsyncStorage.getItem('user_role');
            const id = await AsyncStorage.getItem('user_id');

            if (token && role && id) {
                console.log("Found token and user info. Auto-logging in...");
                // Note: You might want an API endpoint to validate the token's expiry/validity
                // before routing, but for simple auto-login, this is a start.

                // The logic here is simplified. If a token exists, assume the user is logged in
                // and navigate them directly.
                router.push('/User');
                // You could re-implement the role check here if needed:
                // if (role === "chef") {
                //     router.replace('/Chef'); // Use replace to prevent back navigation to Login
                // } else if (role === "user") {
                //     router.replace('/User');
                // }

            }
        } catch (e) {
            console.error("Failed to read token from AsyncStorage", e);
            // Optionally clear storage if reading fails catastrophically
            // await AsyncStorage.clear();
        } finally {
            setIsLoading(false); // Stop loading regardless of outcome
        }
    };

    useEffect(() => {
        checkLocalToken();
    }, []); // Run only once on component mount

    // --- End New Code ---

    const handleLogin = async () => {
        // ... (rest of handleLogin function remains the same)
        if (emailErrorTimeoutRef.current) {
            clearTimeout(emailErrorTimeoutRef.current);
        }
        if (passwordErrorTimeoutRef.current) {
            clearTimeout(passwordErrorTimeoutRef.current);
        }
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
            const response = await axios.post(api_URL, {
                email,
                password
            });

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
            // Use router.replace to prevent going back to the login screen
            router.replace('/User');
            // if (role === "chef") {
            //     router.replace('/Chef');
            // } else if (role === "user") {
            //     router.replace('/User');
            // }
        } catch (error) {
            if (error.response) {
                console.log("Backend responded with error:", error.response.data);
            } else if (error.request) {
                console.log("No response received. Request details:", error.request);
            } else {
                console.log("Error setting up request:", error.message);
            }
            // Add UI feedback for general login failure
            if (error.response && error.response.data && error.response.data.message) {
                setEmailError(error.response.data.message);
                emailErrorTimeoutRef.current = setTimeout(() => setEmailError(''), 5000);
            } else {
                setEmailError("Login failed. Please try again.");
                emailErrorTimeoutRef.current = setTimeout(() => setEmailError(''), 5000);
            }
        }
    }

    // --- Display a loading screen while checking the token ---
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6347" />
                <Text style={styles.loadingText}>Checking for stored session...</Text>
            </View>
        );
    }
    // --- End Loading Screen ---

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <Image source={require("../../assets/logo/tastybites icon.png")} style={styles.logo} />
                    <Text style={styles.welcomeText}>Welcome Back!</Text>

                    {/* Error Messages */}
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                    {/* End Error Messages */}

                    <View style={styles.inputs}>
                        {/* ... (Your existing TextInput/InputContainer code) ... */}
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="email-outline" style={styles.inputIcon} />
                            <TextInput
                                style={{ flex: 1, marginLeft: 5 }}
                                placeholder="Username"
                                placeholderTextColor={"#AFADAD"}
                                keyboardType={"email-address"}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize={"none"}
                            />
                        </View>
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
                        <Image source={require("../../assets/logo/tastybites second logo.png")} style={styles.footerLogo}/>
                        <Text style={styles.footerText}>©Tastybites. All rights reserved.</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
    },
    inner: {
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: "column",
        paddingTop: 40,
    },
    logo: {
        width: 400,
        height: 400,
    },
    welcomeText: {
        fontFamily: "RougeScript-Regular",
        fontSize: 50,
        bottom: 30,
        fontWeight: "200",
        paddingHorizontal: 10,
    },
    inputs: {
        width: "100%",
        gap: 10,
    },
    inputIcon: {
        fontSize: 20,
        color: "#AFADAD",
    },
    eyeIconButton: {
        fontSize: 20,
        color: "#AFADAD",
        position: "absolute",
        right: 10,
    },
    eyeIcon: {
        fontSize: 20,
        color: "#AFADAD",
    },
    inputContainer: {
        width: "100%",
        borderWidth: 0.5,
        padding: 10,
        paddingVertical: 5,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "white",
        elevation: 4,
        borderColor: 'white'
    },
    button: {
        width: "100%",
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        backgroundColor: "#435F77",
        marginTop: 20,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Roboto-Bold"
    },
    beforefooter: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
    },
    beforefooterText: {
        color: "black",
        fontSize: 16,
        fontWeight: "regular",
    },
    footer: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        top: 55,
        gap: 5
    },
    footerLogo: {
        width: 90,
        height: 30,
    },
    footerText: {
        fontSize: 15
    },
    regBttn: {
        color: 'blue',
    }
});