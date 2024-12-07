import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

const DATA = [
  {
    id: '1',
    title: '5 Cans of Tomato Sauce',
    distance: '5 miles away',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ2XlgvvxZmisH4kdrPJudfZTUAKLURXilbQ&s',
  },
  {
    id: '3',
    title: 'Bread Loaf',
    distance: '12 miles away', 
    image: 'https://assets.bonappetit.com/photos/5c62e4a3e81bbf522a9579ce/16:9/w_2580,c_limit/milk-bread.jpg',
  }
];
interface Chat {
  user1: String
}
const POST_MESSAGES = {
  '1': [ // Tomato sauce chat
    { id: '1', text: 'Hey, I saw your tomato sauce post', sender: 'other' },
    { id: '2', text: "Yes, I have 5 extra cans", sender: 'user' },
    { id: '3', text: 'Great! Would you like to trade?', sender: 'other' },
  ],
  '3': [ // Bread chat
    { id: '1', text: 'Hi! Is your bread still available?', sender: 'other' },
    { id: '2', text: 'Yes it is! Fresh baked today', sender: 'user' },
    { id: '3', text: 'Would you like to trade for some bread?', sender: 'other' },
  ],
};

export default function ChatRoom() {
  const params = useLocalSearchParams();
  const { name, avatar, postId } = params;
  const [message, setMessage] = useState('');
  
  const foodPost = DATA.find(item => item.id === postId);
  const chatMessages = POST_MESSAGES[postId];

  //Rendering Logic
  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'user' ? styles.userMessage : styles.otherMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender === 'user' ? styles.userMessageText : styles.otherMessageText
      ]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: avatar as string }} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.foodPostContainer}>
        <Image source={{ uri: foodPost.image }} style={styles.foodImage} />
        <View style={styles.foodInfo}>
          <Text style={styles.foodTitle}>{foodPost.title}</Text>
          <Text style={styles.foodDistance}>{foodPost.distance}</Text>
        </View>
      </View>
      
      <FlatList
        data={chatMessages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={() => {
            // Will be implemented with backend
            setMessage('');
          }}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 15,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodPostContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  foodImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  foodInfo: {
    flex: 1,
  },
  foodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  foodDistance: {
    fontSize: 14,
    color: '#666',
  },
});
