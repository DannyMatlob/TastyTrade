import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Post } from "@/app/Post";
import { useUser } from "@/app/UserContext";
import * as geolib from 'geolib';

import { collection, doc, GeoPoint, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const handleDetails = (description: string) => {
  Alert.alert('Food Description', description, [
    { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
    { text: "Request", onPress: () => console.log("OK Pressed") }],
    { cancelable: false });
}

// 'Item' visual element requires a wrapper for Post.
type ItemProps = {
  post: Post;
}

export default function MyPost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();

  // Sets posts that should be displayed to the current user.
  useEffect(() => {
    // Wait for the current user's information to be loaded.
    if (user === undefined || user === null) { return; }
    const unsub = onSnapshot(doc(db, "users", user.uid as string), (doc) => {
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      try {
        retrievePosts();
      } catch (error) {
        console.log(`Error fetching user posts: ${error}`);
      }
    });
    return () => unsub();
  }, [user]);

  /** Retrieves every post in the posts firebase database. Also filters posts based on certain rules. */
  const retrievePosts = async () => {
    const postsCollectionRef = collection(db, "posts");
    try {
      const querySnapshot = await getDocs(postsCollectionRef);
      const postsArray: Post[] = [];

      // Add every document, which is really a Post, into an array and set the global posts variable to it.
      querySnapshot.forEach((document) => {
        const postData = document.data();
        postsArray.push(postData as Post);
      });

      // Filter posts and set the 'distanceFromUser' field to the distance between the post and user.
      const filteredPosts = filterPosts(postsArray);
      for (const post of filteredPosts) {
        post.distanceFromUser = await calculateDistanceFromPostToUser(post.location);
      }

      setPosts(filteredPosts);
    } catch (error) {
      console.error(`Could not retrieve posts... ${error}.`);
    }
  };

  /** Filters a given Post[] to certain rules. */
  const filterPosts = (retrievedPosts: Post[]): Post[] => {
    if (!user || !user.uid) {
      console.error("Current user not defined when they should be...");
      return retrievedPosts;
    }

    const userUid = user.uid;

    return retrievedPosts.filter((post) => {
      // Allow posts that were not created by the current user.
      if (post.creatorUid !== userUid) {
        return post;
      }
    });
  };

  const Item = ({ post }: ItemProps) => (
    <View style={styles.item}>
      <Image source={{ uri: post.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{post.title}</Text>
        <Text
          style={styles.distance}>{`About ${post.distanceFromUser} miles away.`}</Text>
        <TouchableOpacity style={styles.button} onPress={() => handleDetails(post.description)}>
          <Text style={styles.buttonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /** Calculates the distance between a given post's GeoPoint and the current user's GeoPoint.
   * Returns a promise of the number (distance) in miles. */
  const calculateDistanceFromPostToUser = async (postGeoPoint: GeoPoint) => {
    if (!user || !user.uid) {
      return -1;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userGeoPoint: GeoPoint = userDocSnap.data().location;

      // Even though a GeoPoint is just {latitude, longitude}, geolib won't accept the GeoPoint raw, hence we unwrap.
      const distanceBetweenPostAndUser = geolib.getDistance(
        { latitude: postGeoPoint.latitude, longitude: postGeoPoint.longitude },
        { latitude: userGeoPoint.latitude, longitude: userGeoPoint.longitude });

      const distanceInMiles = geolib.convertDistance(distanceBetweenPostAndUser, 'mi');
      return parseFloat(distanceInMiles.toFixed(2));
    } else {
      return -1;
    }
  }

  const renderItem = ({ item }: { item: Post }) => (<Item post={item}></Item>);

  const onRefresh = async () => {
    setRefreshing(true);
    await retrievePosts();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasty Trade</Text>
        <TouchableOpacity onPress={() => router.push('../(profile)/profile')}>
          <Ionicons name="person-circle-outline" size={40} color="black" />
        </TouchableOpacity>
      </View>
      {posts.length === 0 && (
        <Text style={styles.noPostsText}>No Posts</Text>
      )}
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.postId}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',          // Ensures the item takes full width of the container
    height: 130,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  info: {
    marginLeft: 10,
    width: '70%',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  distance: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50', // Customize background color
    paddingVertical: 10, // Control height of the button
    paddingHorizontal: 20, // Control width of the button
    borderRadius: 5, // Round the corners
    alignItems: 'center',
  },
  buttonText: {
    color: 'white', // Customize text color
    fontSize: 18, // Customize font size
    fontWeight: 'bold',
  },
  noPostsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});