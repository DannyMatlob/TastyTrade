import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, View, Text, TextInput, Button, Alert, TouchableOpacity} from 'react-native';

import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { postStyles, pickImage } from './createPost';

import { db, storage } from '@/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function editPost(postId: string) {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

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
      }};
  
    const handleShare = async () => {
      if (!imageUri || !title || !description) {
        Alert.alert('Error', 'Please complete all fields.');
        return;
      }

      try {
        const newImageUri = await uploadImage(postId);

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

    const uploadImage = async (postId: string) => {
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
  
    return (
      <View style={postStyles.container}>
        <View style={postStyles.header}>
          <Text style={postStyles.headerTitle}>Tasty Trade</Text>
          <TouchableOpacity onPress={() => router.push('../(profile)/profile')}>
            <Ionicons name="person-circle-outline" size={40} color="black" />
          </TouchableOpacity>
        </View>
  
        <Text style={postStyles.subTitle}>Edit Post</Text>
  
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={postStyles.image} />
        ) : (
          <View style={postStyles.imagePlaceholder}>
            <Text>No image selected</Text>
          </View>
        )}
  
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

        <Button title="Finish" color='#4CAF50' onPress={handleShare}/>
        <View style={{ marginTop: 10 }}>
          <Button title="Cancel" color="#FF0000" onPress={() => router.push('../(tabs)/post')} />
        </View>
      </View>
    );
  }