import { Image, StyleSheet, View, Button, Text } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import React, { useState, useEffect } from 'react';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, router } from 'expo-router';

export default function App() {
  // const [error, setError] = useState<string | null>(null);
  // const [userInfo, setUserInfo] = useState<any | null>(null);

  // useEffect(() => {
  //   // Configure Google Sign-In
  //   GoogleSignin.configure({
  //     webClientId: "425738190008-p395osri5l34h9geop7egg4eld1j2njh.apps.googleusercontent.com",
  //     // Add other options if needed
  //   });
  // }, []);

  // const signin = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices(); // Check if Google Play Services are available
  //     const user = await GoogleSignin.signIn(); // Sign in the user
  //     setUserInfo(user); // Store user info in state
  //     setError(null); // Reset error
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       setError(e.message || 'An error occurred'); // Set error message
  //     } else {
  //       setError('An unknown error occurred');
  //     }
  //   }
  // };

  // const logout = async () => {
  //   try {
  //     await GoogleSignin.revokeAccess(); // Revoke access if necessary
  //     await GoogleSignin.signOut(); // Sign out the user
  //     setUserInfo(null); // Reset user info
  //     setError(null); // Reset error
  //   } catch (e) {
  //     setError(e.message || 'An error occurred during logout'); // Handle logout errors
  //   }
  // };

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
        <Button title="Start" onPress={() => router.push('../(auth)/login')} />
        {/* {userInfo ? (
          <>
            <Text>{JSON.stringify(userInfo)}</Text>
            <Button title="Logout" onPress={logout} />
          </>
        ) : (
          <GoogleSigninButton size={GoogleSigninButton.Size.Standard} onPress={signin} />
        )} */}
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
