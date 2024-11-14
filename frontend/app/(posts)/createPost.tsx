import Ionicons from '@expo/vector-icons/Ionicons';
import {Alert, Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import uuid from 'react-native-uuid';

import React, {useState} from 'react';
import {router} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import {useUser} from '../UserContext';
import {db, storage} from '@/firebaseConfig';
import {arrayUnion, doc, setDoc, updateDoc} from 'firebase/firestore';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';

/** Returns the URI (Resource location) for an image so consumers can use setImage(URI) to apply an image. */
export const pickImage = async () => {
  // Ask for permission to access media library.
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    Alert.alert('Permission required', 'Permission to access the camera roll is required!');
    return;
  }

  // Open image picker.
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    // Return the image URI.
    return result.assets[0].uri;
  } else {
    return null;
  }
};

export default function NewPost() {
  const [imageUri, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const { user } = useUser();

  const handleShare = async () => {
    if (!imageUri || !title || !description) {
      Alert.alert('Error', 'Please complete all fields.');
      return;
    }

    if (!user || !user.uid || !user.name) {
      console.error("User is not available... fatal error!");
      return;
    }

    try {
      const postId = uuid.v4();

      const imageUrl = await uploadImage(postId);

      if (imageUrl === undefined) {
        console.error("Image could not be saved in database!");
        return;
      }

      const newPost = {
        postId: postId,
        creatorUid: user.uid,
        creatorName: user.name,
        imageUrl: imageUrl,
        postCreationDate: new Date(),
        title: title,
        description: description
      };

      // Add postId to user in database.
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        posts: arrayUnion(postId)
      });

      // Save the new post to the posts database.
      const postRef = doc(db, 'posts', postId);
      await setDoc(postRef, newPost);

      Alert.alert('Success', 'Post created successfully!');
      router.push('../(tabs)/post');
    } catch (error) {
      console.error('Error creating post: ', error);
      Alert.alert('Error', "Failed to share the post. Please try again.")
    }
  };

  const uploadImage = async (postId: string) => {
    if (!imageUri) {
      throw "Image has not been correctly set!";
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

  return (
      <View style={postStyles.container}>
        <View style={postStyles.header}>
          <Text style={postStyles.headerTitle}>New Post</Text>
          <TouchableOpacity onPress={() => router.push('../(profile)/profile')}>
            <Ionicons name="person-circle-outline" size={40} color="black" />
          </TouchableOpacity>
        </View>

        {imageUri ? (
            <Image source={{ uri: imageUri }} style={postStyles.image} />
        ) : (
            <View style={postStyles.imagePlaceholder}>
              <Text>No image selected</Text>
            </View>
        )}

        <TouchableOpacity onPress={async () => {
          const URI = await pickImage();
          if (URI != null) {
            setImage(URI);
          }
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

export const postStyles = StyleSheet.create({
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
    fontSize: 28,
    fontWeight: 'bold',
  },
  cancel: {
    color: 'black',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageButtonText: {
    marginRight: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});