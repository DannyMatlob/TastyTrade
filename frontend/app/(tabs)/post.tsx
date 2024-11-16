import Ionicons from '@expo/vector-icons/Ionicons';
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import React, {useEffect, useState} from 'react';
import {router} from 'expo-router';
import {Post} from "@/app/Post";
import {useUser} from '../UserContext';

import {doc, getDoc} from "firebase/firestore";
import {db} from "@/firebaseConfig";

/** Accepts a postID as a parameter. Sends the argument to editPost.tsx for processing. */
const handleDetails = (args: string) => {
  router.push({
    pathname: '../(posts)/editPost',
    params: { args }
  });
}

// 'Item' visual element requires a wrapper for Post.
type ItemProps = {
  post: Post;
}

// Represents a displayable "Post" visual element.
const Item = ({ post }: ItemProps) => (
  <View style={styles.item}>
    <Image source={{ uri: post.imageUrl }} style={styles.image} />
    <View style={styles.info}>
      <Text style={styles.title}>{post.title}</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleDetails(post.postId)}>
        <Text style={styles.buttonText}>Edit Post</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function MyPost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useUser();

  // Grabs all the current user's posts to display in the post tab.
  useEffect(() => {
    // Wait for the current user's information to be loaded.
    if (user === undefined || user === null || !user.uid) { return; }

    try {
      retrievePostsForCurrentUser(user.uid);
    } catch (error) {
      console.log(`Error fetching user posts: ${error}`);
    }
  }, [user]);

  /** Given a user's UID, retrieve all postIDs in the 'users' database and use setPosts() to return all posts. */
  const retrievePostsForCurrentUser = async (userUid: string) => {
    if (!userUid) {
      console.error("User ID is null...");
      return;
    }

    const userDocRef = doc(db, "users", userUid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const postIds = userDocSnap.data().posts;

      if (postIds) {
        // (Inner function): For each post, retrieve the data from the "posts" database and return as a Post object.
        const postPromises = postIds.map(async (postId: string) => {
          const postDocRef = doc(db, "posts", postId);
          const postDocSnap = await getDoc(postDocRef);

          if (postDocSnap.exists()) {
            return postDocSnap.data() as Post;
          } else {
            return null;
          }
        });

        const postsData = await Promise.all(postPromises);
        const validPostsData = postsData.filter((post) => post !== null) as Post[];
        setPosts(validPostsData);
      } else {
        // Handle the case where there are no retrievable posts.
        setPosts([]);
      }
    } else {
      console.error("Fatal error: current user could not be retrieved from the database.");
    }
  }

  const renderItem = ({ item }: { item: Post }) => (<Item post={item}></Item>);
    
  return (<View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tasty Trade</Text>
          <TouchableOpacity onPress={() => router.push('../(profile)/profile')}>
            <Ionicons name="person-circle-outline" size={40} color="black" />
          </TouchableOpacity>
        </View>

        <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={item => item.postId}
        />

        <View>
          <TouchableOpacity onPress={() => router.push('../(posts)/createPost')} style={styles.createButton}>
            <Feather name="plus-circle" size={30} color="black" />
          </TouchableOpacity>
        </View>
  </View>);
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
            backgroundColor: '#4CAF50', 
            paddingVertical: 10,
            paddingHorizontal: 20, 
            borderRadius: 5,
            alignItems: 'center',
          },
        buttonText: {
            color: 'white', // Customize text color
            fontSize: 18, // Customize font size
            fontWeight: 'bold',
          },
        createButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 15,
        },
      });