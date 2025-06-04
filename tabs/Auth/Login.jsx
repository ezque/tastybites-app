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
    Keyboard, ScrollView
} from "react-native";
import { MaterialIcons} from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {useState} from "react";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <ScrollView>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Image source={require("../../assets/logo/tastybites icon.png")} style={styles.logo} />
                        <Text style={styles.welcomeText}>Welcome Back!</Text>
                        <View style={styles.inputs}>
                            <View style={styles.inputContainer}>
                                <MaterialCommunityIcons name="email-outline" style={styles.inputIcon} />
                                <TextInput
                                    style={{ flex: 1, marginLeft: 5 }}
                                    placeholder="Username"
                                    placeholderTextColor={"#A17777"}
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
                                    placeholderTextColor={"#A17777"}
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
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                        <View style={styles.beforefooter}>
                            <Text style={styles.beforefooterText}>Don't Have an Account? Click Here to Register</Text>
                        </View>
                        <View style={styles.footer}>
                            <Image source={require("../../assets/logo/tastybites second logo.png")} style={styles.footerLogo}/>
                            <Text style={styles.footerText}>©Tastybites. All rights reserved.</Text>
                        </View>
                    </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E0E7FF",
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
        color: "#A17777",
    },
    eyeIconButton: {
        fontSize: 20,
        color: "#A17777",
        position: "absolute",
        right: 10,
    },
    eyeIcon: {
        fontSize: 20,
        color: "#A17777",
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
        borderColor: "#C55858",
    },
    button: {
        width: "60%",
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
    },
    beforefooter: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
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
        top: 45,
        gap: 5
    },
    footerLogo: {
        width: 90,
        height: 30,
    },
    footerText: {
        fontSize: 15
    }
});