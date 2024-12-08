import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Pressable } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { signOut } from "firebase/auth"
import { auth } from "@/firebaseConfig";

import { useUser } from "../UserContext";
import { router } from "expo-router";

export default function HomeScreen() {
    const { setUser, user } = useUser();
    const name = user?.name ?? "(Unknown)";
    const email = user?.email ?? "No email detected.";
    const uid = user?.uid ?? "No unique ID detected.";

    // Sign out and redirect to log-in page.
    // TODO: Fix log-out procedure. Signing in with another account currently does not work.
    const handleSignOut = async () => {
        router.push('/');

        // Adds a delay to backend sign-out process to delay animation text changes.
        setTimeout(async () => {
            try {
                await signOut(auth).then(() => {
                    setUser(null);
                });
            } catch (error) {
                console.log("Fatal error signing out: ", error);
            }
        }, 1000)
    }

    return (
        <ParallaxScrollView
          headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
          headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" >Hello, {name}!</ThemedText>
          </ThemedView>
          <ThemedText>Email: {email}</ThemedText>
          <ThemedText>Unique ID: {uid}</ThemedText>
          <Pressable style={styles.signOutButton} onPress={() => handleSignOut()}>
              <ThemedText style={styles.signOutButtonText}>(Currently Broken) Sign Out!</ThemedText>
          </Pressable>
        </ParallaxScrollView>
      );
}

const styles = StyleSheet.create({
    headerImage: {
      color: '#808080',
      bottom: -90,
      left: -35,
      position: 'absolute',
    },
    titleContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    signOutButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    signOutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
  });