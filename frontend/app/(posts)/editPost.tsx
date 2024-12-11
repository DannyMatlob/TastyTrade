import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { postStyles, pickImage } from './createPost';

import { db, storage } from '@/firebaseConfig';
import { arrayRemove, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { useUser } from "../UserContext";

export default function editPost() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useUser();
  let postId = "";

  // Variable name "args" needs to match the variable name in handleDetails() of post.tsx.
  const { args } = useLocalSearchParams();

  if (typeof args === 'string') {
    postId = args;
  }

  if (!args || Array.isArray(args)) {
    console.error("PostID could not be retrieved to edit your post! Too many arguments?");
    router.push('../(tabs)/post');
    return;
  }

  // Retrieve a reference to a post given a postId.
  const docRef = doc(db, "posts", postId);

  /** Retrieve a post and set title, description, and imageUri global values for later usages. */
  const retrieveAndSetInfo = async (id: string) => {
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const item = docSnap.data();
        setTitle(item?.title ?? "No Title Found");
        setImageUri(item?.imageUrl ?? "");
        setDescription(item?.description ?? "No Description Found.");
      } else {
        Alert.alert("Item Not Found", `No item was found with the id: ${id}`);
        console.error(`Post could not be found with given ID: ${id}. Possible matching error?`);
        router.push('../(tabs)/post');
      }
    } catch (error) {
      console.error(`Post retrieval error: ${error}`);
    }
  };

  const handleShare = async () => {
    if (!imageUri || !title || !description) {
      Alert.alert('Error', 'Please complete all fields.');
      return;
    }

    try {
      const newImageUri = await uploadImage();

      if (!newImageUri) {
        console.error("Error with uploadImage() function in editPost.tsx.");
        return;
      }

      await updateDoc(docRef, {
        title: title,
        description: description,
        imageUrl: newImageUri
      });

      Alert.alert('Success', 'Post edited successfully!');
      router.push('../(tabs)/post');
    } catch (error) {
      console.error('Error editing post: ${error}');
      Alert.alert('Error', "Failed to edit the post. Please try again.")
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      throw "Image has not been correctly set!";
    }

    // Do not re-upload the image if the user did not change the image.
    if (imageUri.startsWith("https://firebasestorage.googleapis.com")) {
      return imageUri;
    }

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `images/${postId}`);
      await uploadBytes(storageRef, blob);

      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image to firebase database: ", error);
    }
  }

  useEffect(() => {
    // Automatically call the function when the component mounts.
    retrieveAndSetInfo(postId);
  }, [postId]); // postId added so retrieveAndSetInfo() is only called whenever postId changes (which shouldn't).

  const confirmPostDeletionPrompt = () => {
    Alert.alert('Confirm Post Deletion!', "This will delete all images\nand chats related to the post.", [
      { text: "Confirm", onPress: () => deletePost(), style: "destructive" },
      { text: "Cancel", style: "cancel" }],
      { cancelable: false });
  }

  /** Removes a post from the firebase database.
   *  This means deleting the post from the 'posts' and the postId from a user's document.
   *  Moreover, the image that was uploaded to firebase's storage also needs to be deleted. */
  const deletePost = async () => {
    if (!user || !user.uid) {
      console.error("Current user not found when trying to delete post.");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const imageRef = ref(storage, `images/${postId}`);

    try {
      var userDocSnap = await getDoc(userRef);
      // Create a new user if they do not exist.
      if (!userDocSnap.exists()) {
        return
      }
      const chatIds = userDocSnap.data().chats;
      const chatPromises = chatIds.map(async (chatId: string) => {
        const chatDocRef = doc(db, "chats", chatId);
        const chatDocSnap = await getDoc(chatDocRef);
        if (chatDocSnap.exists()) {
          const chatPostId = chatDocSnap.data().postId;
          if (chatPostId === postId) {
            const user1id = chatDocSnap.data().user1;
            const user2id = chatDocSnap.data().user2;
            var user2DocRef = doc(db, "users", user2id);
            await updateDoc(user2DocRef, {
              chats: arrayRemove(chatId)  // Removes the specified chat ID from the array
            });
            var user1DocRef = doc(db, "users", user1id);
            await updateDoc(user1DocRef, {
              chats: arrayRemove(chatId)  // Removes the specified chat ID from the array
            });
          }
          await deleteDoc(chatDocRef);
        }
      });
      // Delete the post from the 'posts' collection.
      await deleteDoc(docRef);

      // Delete the postId from the current user's database file.
      await updateDoc(userRef, {
        posts: arrayRemove(postId)
      })

      // Delete the image related with the post from firebase storage.
      await deleteObject(imageRef);
    } catch (error) {
      console.error(`Could not delete post: ${error}`);
    }

    router.push('../(tabs)/post');
  }

  return (
    <View style={postStyles.container}>
      <View style={postStyles.header}>
        <Text style={postStyles.headerTitle}>Tasty Trade</Text>
        <TouchableOpacity onPress={() => router.push('../(profile)/profile')}>
          <Ionicons name="person-circle-outline" size={40} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={postStyles.subTitle}>Edit Post</Text>

      {imageUri ?
        (<Image source={{ uri: imageUri }} style={postStyles.image} />) :
        (<View style={postStyles.imagePlaceholder}>
          <Text>No image selected</Text>
        </View>)
      }

      <TouchableOpacity onPress={async () => {
        const imageURI = await pickImage();
        if (imageURI != null) { setImageUri(imageURI); }
      }} style={postStyles.imageButton}>
        <Text style={postStyles.imageButtonText}>Select Image</Text>
        <Ionicons name="create-outline" size={20} color="black" />
      </TouchableOpacity>

      <TextInput
        style={postStyles.input}
        placeholder="Write a title..."
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={postStyles.input}
        placeholder="Write a description..."
        value={description}
        onChangeText={setDescription}
      />

      <View style={{ gap: 10 }}>
        <Button title="Finish" color='#4CAF50' onPress={handleShare} />
        <Button title="Cancel" color='#FFA500' onPress={() => router.push('../(tabs)/post')} />
      </View>

      <View style={{ marginTop: 40 }}>
        <TouchableOpacity onPress={() => {
          confirmPostDeletionPrompt();
        }} style={{
          backgroundColor: '#FF0000',
          padding: 10,
          borderRadius: 5,
          borderWidth: 2,
          alignItems: 'center',
        }}>
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 17 }}>Delete Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}