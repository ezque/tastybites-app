import {
    View,
    StyleSheet,
    Platform,
    Image,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as DocumentPicker from 'expo-document-picker';
import axios from "axios";
import { Picker } from '@react-native-picker/picker';

import BASE_URL from "../../apiConfig";
const api_URL = `${BASE_URL}/register`;

export default function Register({ changeTab }) {
    const [userName, setuserName] = useState('');
    const [fullName, setfullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [gender, setGender] = useState('male'); // gender state
    const [password, setPassword] = useState('123456');
    const [confirmPassword, setConfirmPassword] = useState('123456');
    const [experience, setExperience] = useState('');
    const [certificate, setCertificate] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ],
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                setCertificate(file);
            } else {
                console.log('Document pick cancelled');
            }
        } catch (err) {
            console.error('Error picking document:', err);
        }
    };

    const handleRegister = async () => {
        if (!role) {
            alert("Please select a role");
            return;
        }
        if (!gender) {
            alert("Please select a gender");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('userName', userName);
        formData.append('fullName', fullName);
        formData.append('password', password);
        formData.append('password_confirmation', confirmPassword);
        formData.append('role', role);
        formData.append('gender', gender); // send gender

        if (role === 'chef') {
            formData.append('experience', experience || '');
            if (certificate) {
                formData.append('credentials', {
                    uri: certificate.uri,
                    type: certificate.mimeType || 'application/pdf',
                    name: certificate.name,
                });
            }
        }

        try {
            console.log("Sending to:", api_URL);
            console.log("Payload:", { email });
            const response = await axios.post(api_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert(response.data.message);
            changeTab(true);
        } catch (error) {
            console.log(error.response?.data || error.message);
            alert('Registration failed. Please check your inputs.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAwareScrollView
                    style={styles.container}
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    extraScrollHeight={Platform.OS === 'ios' ? 100 : 50}
                    enableOnAndroid={true}
                    enableAutomaticScroll={true}
                    resetScrollToCoords={{ x: 0, y: 0 }}
                >
                    <View style={styles.inner}>
                        <Image source={require('../../assets/logo/tastybites icon.png')} style={styles.logo} />
                        <Text style={styles.registerText}>Join Us Now!</Text>

                        <View style={styles.buttonCon}>
                            <TouchableOpacity
                                style={[styles.topButton, role === 'user' ? styles.topButtonActive : null]}
                                onPress={() => setRole('user')}
                            >
                                <MaterialCommunityIcons name="account-outline" style={styles.topButtonText} />
                                <Text style={styles.topButtonText}>USER</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.topButton, role === 'chef' ? styles.topButtonActive : null]}
                                onPress={() => setRole('chef')}
                            >
                                <MaterialCommunityIcons name="chef-hat" style={styles.topButtonText} />
                                <Text style={styles.topButtonText}>CHEF</Text>
                            </TouchableOpacity>
                        </View>



                        {/* Input fields */}
                        <View style={styles.inputContainer}>
                            {role === 'chef' && (
                                <>
                                    <View style={styles.inputGroup}>
                                        <MaterialCommunityIcons name={"briefcase-outline"} style={styles.inputIcon}/>
                                        <TextInput
                                            placeholder="Experience"
                                            style={styles.inputText}
                                            placeholderTextColor={'#AFADAD'}
                                            value={experience}
                                            onChangeText={setExperience}
                                        />
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <TextInput
                                            placeholder="Certificate"
                                            editable={false}
                                            value={certificate?.name || ''}
                                            style={styles.inputText}
                                        />
                                        <TouchableOpacity style={styles.attachButton} onPress={pickFile}>
                                            <Text style={styles.attachText}>Attach</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}

                            <View style={styles.inputGroup}>
                                <MaterialCommunityIcons name="email-outline" style={styles.inputIcon} />
                                <TextInput
                                    placeholder="Email"
                                    style={styles.inputText}
                                    placeholderTextColor={'#AFADAD'}
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <MaterialCommunityIcons name="account-outline" style={styles.inputIcon} />
                                <TextInput
                                    placeholder="userName"
                                    style={styles.inputText}
                                    placeholderTextColor={'#AFADAD'}
                                    value={userName}
                                    onChangeText={setuserName}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <MaterialCommunityIcons name="account-outline" style={styles.inputIcon} />
                                <TextInput
                                    placeholder="fullName"
                                    style={styles.inputText}
                                    placeholderTextColor={'#AFADAD'}
                                    value={fullName}
                                    onChangeText={setfullName}
                                />
                            </View>

                            {/* Gender dropdown */}
                            <View style={styles.inputGroup}>
                                <MaterialCommunityIcons name="gender-male-female" style={styles.inputIcon} />
                                <Picker
                                    selectedValue={gender}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => setGender(itemValue)}
                                >
                                    <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" />
                                </Picker>
                            </View>

                            <View style={styles.inputGroup}>
                                <MaterialCommunityIcons name="lock-outline" style={styles.inputIcon} />
                                <TextInput
                                    placeholder="Password"
                                    style={styles.inputText}
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                    autoCapitalize="none"
                                    placeholderTextColor={'#AFADAD'}
                                />
                                <TouchableOpacity style={styles.eyeIconButton} onPress={toggleShowPassword}>
                                    <MaterialCommunityIcons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        style={styles.eyeIcon}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputGroup}>
                                <MaterialCommunityIcons name="lock-outline" style={styles.inputIcon} />
                                <TextInput
                                    placeholder="Confirm Password"
                                    style={styles.inputText}
                                    secureTextEntry={!showConfirmPassword}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    autoCapitalize="none"
                                    placeholderTextColor={'#AFADAD'}
                                />
                                <TouchableOpacity style={styles.eyeIconButton} onPress={toggleShowConfirmPassword}>
                                    <MaterialCommunityIcons
                                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                        style={styles.eyeIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Register button */}
                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
                            <Text style={styles.buttonText}>REGISTER</Text>
                        </TouchableOpacity>

                        {/* Login link */}
                        <View style={styles.beforefooter}>
                            <Text style={styles.beforefooterText}>Already Have an Account? Click Here to </Text>
                            <TouchableOpacity onPress={() => changeTab(true)}>
                                <Text style={styles.regBttn}>Login</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Image
                                source={require('../../assets/logo/tastybites second logo.png')}
                                style={styles.footerLogo}
                            />
                            <Text style={styles.footerText}>©Tastybites. All rights reserved.</Text>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea:
        { flex: 1 },
    container:
        { flex: 1, paddingHorizontal: 30 },
    scrollContainer:
        { paddingBottom: 5 },
    inner:
        { alignItems: 'center', paddingTop: 10 },
    logo:
        { top: 30, width: 250, height: 250 },
    registerText:
        { fontFamily: 'RougeScript-Regular', fontSize: 50, bottom: 10, fontWeight: '200', paddingHorizontal: 10 },
    buttonCon:
        { width: '100%', gap: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', padding: 10 },
    topButton:
        { paddingHorizontal: 30, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#435F77', borderRadius: 10, gap: 5 },
    topButtonText:
        { color: 'white', fontSize: 18, fontWeight: 'bold' },
    topButtonActive:
        { backgroundColor: '#FFA500' },
    inputContainer:
        { width: '100%', gap: 10, backgroundColor: '#E0E7FF', padding: 20, borderRadius: 20 },
    inputGroup:
        { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: 'white', borderRadius: 15, paddingHorizontal: 20, paddingVertical: 3, gap: 5, borderColor: 'white', elevation: 4 },
    inputIcon:
        { fontSize: 18, color: '#AFADAD' },
    inputText:
        { fontSize: 18, flex: 1, color: '#AFADAD' },
    picker:
        { flex: 1, height: 50, color: '#AFADAD' }, // <-- added picker style
    eyeIconButton:
        { position: 'absolute', right: 15 },
    eyeIcon:
        { fontSize: 20, color: '#AFADAD' },
    button:
        { width: '60%', paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: '#435F77', marginTop: 20 },
    buttonText:
        { color: 'white', fontSize: 18, fontWeight: 'bold' },
    beforefooter:
        { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5 },
    beforefooterText:
        { color: 'black', fontSize: 16, fontWeight: 'regular' },
    footer:
        { alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 5, marginTop: 50 },
    footerLogo:
        { width: 90, height: 30 },
    footerText:
        { fontSize: 15 },
    regBttn:
        { color: 'blue' },
    attachButton:
        { backgroundColor: 'blue', paddingVertical: 9, paddingHorizontal: 20, alignItems: "center", justifyContent: "center", borderRadius: 10 },
    attachText:
        { color: 'white', fontWeight: "bold" },
});
