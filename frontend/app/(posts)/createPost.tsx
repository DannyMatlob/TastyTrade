import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, View, Text, TextInput, Button, Alert, TouchableOpacity} from 'react-native';

import React, { useState } from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

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
    const [image, setImage] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleShare = () => {
      if (!image || !title || !description) {
        Alert.alert('Error', 'Please complete all fields.');
        return;
      }
      // Logic for sharing the post (e.g., upload to backend)
      Alert.alert('Success', 'Post shared successfully!');
      router.push('../(tabs)/home')
    };

    const handleCancel = () => {
        Alert.alert('Canceled Post Creation', 'Post has been canceled, returned to homepage');
        router.push('../(tabs)/home')
      };

    const handleImageCancel = () => {
        if (image) {
            setImage(null);
        }
    };

    return (
      <View style={postStyles.container}>
        <View style={postStyles.header}>
          <Text style={postStyles.headerTitle}>Tasty Trade</Text>
          <TouchableOpacity onPress={() => router.push('../(profile)/profile')}>
            <Ionicons name="person-circle-outline" size={40} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleImageCancel}>
          <Text style={postStyles.cancel}>Cancel Image</Text>
        </TouchableOpacity>

        <Text style={postStyles.subTitle}>New Post</Text>

        {image ? (
          <Image source={{ uri: image }} style={postStyles.image} />
        ) : (
          <View style={postStyles.imagePlaceholder}>
            <Text>No image selected</Text>
          </View>
        )}

        <TouchableOpacity onPress={async () => {
          const imageURI = await pickImage();
          if (imageURI != null) { setImage(imageURI); }
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

        <Button title="Share" color='#4CAF50' onPress={handleShare}/>
        <Button title="Cancel" color='#4CAF50' onPress={handleCancel}/>
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
      fontSize: 24,
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