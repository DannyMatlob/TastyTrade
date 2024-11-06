import { Image, StyleSheet, View, Button, Text } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useState, useEffect } from 'react';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, router } from 'expo-router';

//Auth
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth"
import { auth } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function App() {

  const [userInfo, setUserInfo] = React.useState();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    webClientId:process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    redirectUri:"com.tasty.tastytrade:/(onboarding)/start"
  });
  console.log(request?.redirectUri);

  // Function to handle login submission
  React.useEffect(() => {
    if (response?.type == "success") {
      console.log("Success!, signing in");
      const {id_token} = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
    }
  }, [response]);
  
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(JSON.stringify(user, null, 2));
        setUserInfo(user);
        await AsyncStorage.setItem("@user", JSON.stringify(user));
      } else {
        console.log("User is not authenticated");
      }
    });
  
    return () => unsub();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: 'rgba(255, 255, 255, 0.5)', dark: 'rgba(0, 0, 0, 0)' }}
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
        <Button title="Sign In with Google" onPress={() => promptAsync()} />
      </View>
    </ParallaxScrollView>
  );
}

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
