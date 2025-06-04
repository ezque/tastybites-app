import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';


export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        'RougeScript-Regular': require('../assets/fonts/RougeScript-Regular.ttf'),
    });

    useEffect(() => {
        if (fontError) {
            console.error('Font loading error:', fontError);
        }
    }, [fontError]);

    return <Stack screenOptions={{ headerShown: false }} />;
}
