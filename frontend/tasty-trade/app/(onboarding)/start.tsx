import { Tabs, router } from 'expo-router';
import React, { useState } from 'react';

import * as Location from 'expo-location';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';

import {app, auth} from '../../firebaseConfig'

export default function Onboarding() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<String | null>(null);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
    console.log(location);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please enable location services</Text>
      
      <Button title="Next" disabled={location?false:true} onPress={() => console.log("next")} />
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