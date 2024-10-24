import { Tabs, router } from 'expo-router';
import React, { useState } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';

export default function Onboarding() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleSignUp = () => {
    if (!name || !address) {
      Alert.alert('Error', 'Please enter both a name and address.');
    } 
    else {
      Alert.alert('Success', 'Sign Up successfully!');
      router.push('../(tabs)/home');
    }

    // Example login logic (replace with real authentication logic)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Provide Information</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize='words'
      />
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
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        autoCapitalize='words'
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Optional: Adds background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff', // Optional: Adds background color to input
  },
});