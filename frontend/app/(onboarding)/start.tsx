import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import * as Location from 'expo-location';
import { StyleSheet, Text, View, Button } from 'react-native';

import { useUser } from "../UserContext";
import { db } from "@/firebaseConfig";
import { doc, updateDoc, GeoPoint } from 'firebase/firestore';

export default function Onboarding() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<String | null>(null);
  const { user } = useUser();

  // Stores location data to a user's firestore document.
  const addLocationToUserDB = async (location: Location.LocationObject) => {
    const userUID = user?.uid;
    if (!userUID) {
      console.error("User should be defined here... Fatal Error.");
      return;
    }

    // Add the location geo-position to a user's DB file.
    try {
      await updateDoc(doc(db, "users", userUID), {
        location: new GeoPoint(location.coords.latitude, location.coords.longitude)
      });
    } catch (error) {
      console.log("Fatal error updating user location: ", error);
    }
  }

  useEffect(() => {
    // User is not yet loaded... wait.
    if (user === undefined || user === null) {
      return;
    }

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      await addLocationToUserDB(location);
    })();
  }, [user]); // Adding user to deps here means function will rerun when user is loaded in.

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please enable location services</Text>
      
      <Button title="Next" disabled={!location} onPress={() => router.push('../(tabs)/home')} />
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