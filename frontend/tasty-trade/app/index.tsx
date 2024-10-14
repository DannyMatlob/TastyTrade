import { Image, StyleSheet, Platform, Text, TextInput, View, Button} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import React, { useState } from 'react';


export default function App() {

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
        <HelloWave />
      </View>
      <View style={styles.titleContainer}>
        <Link href="/(auth)/login" style={styles.loginContainer}>Login or Sign Up</Link>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 300,
    width: 300,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    color: 'white',
    textDecorationLine: 'underline',
  }
});
