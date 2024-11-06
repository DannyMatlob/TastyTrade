import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, Text, TextInput, Button, Alert, TouchableOpacity, FlatList} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import { Tabs, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const DATA = [
    {
      id: '1',
      title: '5 Cans of Tomato Sauce',
      distance: '5 miles away',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ2XlgvvxZmisH4kdrPJudfZTUAKLURXilbQ&s',
      description: "blahblahblah",
    },
    {
      id: '2',
      title: 'Leftover Grilled Corn',
      distance: '8 miles away',
      image: 'https://assets.bonappetit.com/photos/6283b5cd59cc9bcfbef829b1/1:1/w_2560%2Cc_limit/Grilled-Corn-With-Chaat-Masala.png',
      description: "blahblahblah",
    },
    {
      id: '3',
      title: 'Bread Loaf',
      distance: '12 miles away',
      image: 'data:image/jpeg;base64,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',
      description: "blahblahblah",
    },
    {
        id: '4',
        title: '1 Sack of Potatoes',
        distance: '5 miles away',
        image: 'https://cdn.mos.cms.futurecdn.net/iC7HBvohbJqExqvbKcV3pP-1200-80.jpg',
        description: "blahblahblah",
      },
      {
        id: '5',
        title: 'Leftover Grilled Fish',
        distance: '8 miles away',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLzY8x_-ePWVNjBXIFNAhvc-Cb1MbkWzWZ6A&s',
        description: "blahblahblah",
      },
      {
        id: '6',
        title: '10 cups of Yogurt',
        distance: '12 miles away',
        image: 'https://www.yoplait.com/_next/image?url=https%3A%2F%2Fprodcontent.yoplait.com%2Fwp-content%2Fuploads%2F2020%2F12%2Fyoplait-original-vanilla-tub-460x460-1.png&w=1400&q=75',
        description: "blahblahblah",
      },
  ];

  const handleDetails = (arg) => {
    router.push('../(posts)/editPost', arg)
  }

  const Item = ({id,  title, distance, image, description }) => (
    <View style={styles.item}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.info}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.distance}>{distance}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleDetails(id)}>
                <Text style={styles.buttonText}>Edit Details</Text>
            </TouchableOpacity>
        </View>
    </View>
  );

export default function MyPost() {    
    const renderItem = ({ item }) => (
        <Item 
            title={item.title}
            distance={item.distance}
            image={item.image}
            description={item.description}
        />
      );
    
      return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tasty Trade</Text>
                <TouchableOpacity onPress={() => router.push('../(profile)/profile')}>
                    <Ionicons name="person-circle-outline" size={40} color="black" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <View>
                <TouchableOpacity onPress={() => router.push('../(posts)/createPost')} style={styles.createButton}>
                    <Feather name="plus-circle" size={30} color="black" />
                </TouchableOpacity>
            </View>
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