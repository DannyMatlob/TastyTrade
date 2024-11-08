import { Image, StyleSheet, View, Button } from 'react-native';
import React, { useEffect } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';

import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential, } from "firebase/auth"
import { auth, db } from "@/firebaseConfig";
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { useUser } from "./UserContext";

export default function App() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
        redirectUri: "com.tasty.tastytrade:/(onboarding)/start"
    });

    // Hook from UserContext to set the current, global user for the application.
    const { setUser } = useUser();

    const registerUserIfAbsent = async (user: { uid: string; name: string | null; email: string | null }) => {
        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            // Create a new user if they do not exist.
            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    email: user.email,
                    name: user.name,
                    uid: user.uid,
                    createdOn: new Date(),
                    chats: {},
                    posts: {},
                });
            }
        } catch (error) {
            console.error("Error with Firestore: ", error);
        }
    }

    // Function to handle login submission.
    useEffect(() => {
        if (response?.type == "success") {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then((result) => {
                    const user = {
                        email: result.user.email,
                        name: result.user.displayName,
                        uid: result.user.uid
                    };

                    // Sets current user to UserContext.
                    setUser(user);

                    registerUserIfAbsent(user);
                })
                .catch((error) => {
                    console.error("Fatal error signing in: ", error);
                });
        }
    }, [response]);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{light: 'rgba(255, 255, 255, 0.5)', dark: 'rgba(0, 0, 0, 0)'}}
            headerImage={
                <Image
                    source={require('@/assets/images/tasty-trade.jpg')}
                    style={styles.reactLogo}
                />
            }>
            <View style={styles.titleContainer}>
                <ThemedText type="title">Welcome! to TastyTrade</ThemedText>
            </View>
            <View style={styles.titleContainer}>
                {/* {error && <Text style={styles.errorText}>{error}</Text>} */}
                <Button title="Sign In with Google" onPress={() => promptAsync()}/>
            </View>
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    reactLogo: {
        height: 200,
        width: 200,
        alignSelf: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});
