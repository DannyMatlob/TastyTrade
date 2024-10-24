import { router } from 'expo-router';
import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from "@firebase/auth";
import { auth } from './google_auth';

import { StyleSheet, Text, TextInput, View, Alert , Pressable } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle login submission
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    if (email === '123' && password === '123') {
      Alert.alert('Success', 'Logged in successfully!');
      router.push('../(tabs)/home')
    } else {
      Alert.alert('Error', 'Invalid email or password.');
    }
  };

  const handleGoogleAuth = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(result => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          const user = result.user;

          // TODO: Need logic to register new user or confirm existing user.
          // Additional documentation: https://firebase.google.com/docs/auth/web/google-signin
          console.log(user.email);
          console.log(user.uid);

          router.push('../(tabs)/home')
        }).catch((error) => {
          let errorMessage = error.code + " | " + error.message + " from " + error.customData.email + ".";
          console.log(errorMessage);
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Page</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Login Button */}
      <Pressable style={[styles.primaryButtons, { backgroundColor: '#90D5FF', marginTop: 30, }]} onPress={handleLogin}>
        <Text style={styles.primaryTexts}>Login</Text>
      </Pressable>

      {/* Sign Up Button */}
      <Pressable style={[styles.primaryButtons, { backgroundColor: '#88E788', }]} onPress={() => router.push('../(onboarding)/start')}>
        <Text style={styles.primaryTexts}>Sign Up</Text>
      </Pressable>

      {/* Sign Up Button */}
      <Pressable style={[styles.primaryButtons]} onPress={handleGoogleAuth}>
        <Text style={styles.primaryTexts}>Google Auth</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center items vertically.
    alignItems: 'center', // Center items horizontally.
    backgroundColor: '#f5f5f5', // Optional: Adds background color
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 50,
    textAlign: 'center',
  },
  input: {
    width: '70%',
    height: '5%',
    borderColor: '#6D6D6D',
    borderWidth: 1.25,
    borderRadius: 5,
    margin: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff', // Optional: Adds background color to input
  },
  primaryButtons: {
    borderRadius: 10,
    margin: 10,
    marginTop: 10,
    width: '50%',
    height: '7%',
    alignItems: 'center', // Centers text horizontally.
    justifyContent: 'center', // Centers text vertically.
    borderWidth: 1.5,
  },
  primaryTexts: {
    fontSize: 26,
    fontWeight: 'bold',
  }
});