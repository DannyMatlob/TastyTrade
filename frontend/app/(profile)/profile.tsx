import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Pressable, View, Text, TouchableOpacity, Button } from 'react-native';
import { Post } from "@/app/interfaces";

import { signOut, deleteUser } from "firebase/auth"
import { auth, db } from "@/firebaseConfig";

import { useUser } from "../UserContext";
import { router } from "expo-router";
import { useEffect, useState } from 'react';
import { doc, getDoc, deleteDoc, Timestamp, updateDoc, arrayRemove } from 'firebase/firestore';

type ItemProps = {
  post: Post;
}

export default function HomeScreen() {
  const { setUser, user } = useUser();
  const [posts, setPosts] = useState(0);
  const name = user?.name ?? "(Unknown)";
  const email = user?.email ?? "No email detected.";
  const uid = user?.uid ?? "No unique ID detected.";
  const [createdOn, setCreatedOn] = useState("MM/DD/YYYY");


  useEffect(() => {
    // Wait for the current user's information to be loaded.
    if (user === undefined || user === null || !user.uid) { return; }

    try {
      getNumUserPosts(user.uid);
    } catch (error) {
      console.log(`Error fetching user posts: ${error}`);
    }
  }, [user]);

  const getNumUserPosts = async (userUid: string) => {
    if (!userUid) {
      console.error("User ID is null...");
      return;
    }

    const userDocRef = doc(db, "users", userUid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const postIds = userDocSnap.data().posts;
      if (postIds) {
        setPosts(postIds.length)
      } else {
        console.error("Fatal error: current user could not be retrieved from the database.");
      }
      const ts: Timestamp = userDocSnap.data().createdOn;
      if (ts) {
        const date = new Date(ts.seconds * 1000 + ts.nanoseconds / 1000000);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const d = `${month}/${day}/${year}`
        setCreatedOn(d)
      } else {
        console.error("Fatal error: current user could not be retrieved from the database.");
      }

    }
  }

  // Sign out and redirect to log-in page.
  const handleSignOut = async () => {
    // Adds a delay to backend sign-out process to delay animation text changes.
    setTimeout(async () => {
      try {
        auth.signOut().then(() => {
          console.log("User signed out successfully");
          setUser(null);
        });
      } catch (error) {
        console.log("Fatal error signing out: ", error);
      }
    }, 2000)
    router.push('/');
  }

  const handleDelete = async () => {
    // Adds a delay to backend sign-out process to delay animation text changes.
    setTimeout(async () => {
      try {
        var userDocRef = doc(db, "users", uid);
        var userDocSnap = await getDoc(userDocRef);
        // Create a new user if they do not exist.
        if (!userDocSnap.exists()) {
          return
        }
        const chatIds = userDocSnap.data().chats;
        const chatPromises = chatIds.map(async (chatId: string) => {
          const chatDocRef = doc(db, "chats", chatId);
          const chatDocSnap = await getDoc(chatDocRef);
          if (chatDocSnap.exists()) {
            const user1id = chatDocSnap.data().user1;
            const user2id = chatDocSnap.data().user2;
            if (user1id === uid) {
              var user2DocRef = doc(db, "users", user2id);
              await updateDoc(user2DocRef, {
                chats: arrayRemove(chatId)  // Removes the specified chat ID from the array
              });
            } else {
              var user1DocRef = doc(db, "users", user1id);
              await updateDoc(user1DocRef, {
                chats: arrayRemove(chatId)  // Removes the specified chat ID from the array
              });
            }
            await deleteDoc(chatDocRef);
          }
        });
        const postIds = userDocSnap.data().posts;
        const postPromises = postIds.map(async (postId: string) => {
          const postDocRef = doc(db, "posts", postId);
          const postDocSnap = await getDoc(postDocRef);
          if (postDocSnap.exists()) {
            await deleteDoc(postDocRef);
          }
        });
        await deleteDoc(userDocRef);
        const user = auth.currentUser;
        if (user) {
          await deleteUser(user);
          console.log("User deleted successfully");
          setUser(null);
        }
      } catch (error) {
        console.log("Fatal error deleting user: ", error);
      }
    }, 2000)
    router.push('/');
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.content}>
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>User Information</Text>
        <View style={{ padding: 15, }}>
          <Text style={{ fontSize: 16 }}>Email: {email}</Text>
          <Text style={{ fontSize: 16 }}>Number of Meals Saved: {posts}</Text>
          <Text style={{ fontSize: 16 }}>Saving Meals Since: {createdOn}</Text>
        </View>
      </View>
      <View style={styles.button}>
        <Button title="Sign Out" color='#FF0000' onPress={handleSignOut} />
      </View>
      <View style={styles.button}>
        <Button title="Delete Account" color='#FF0000' onPress={handleDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  content: {
    padding: 20,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  button: {
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 15,
  },
});