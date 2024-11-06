import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, View, Text, TouchableOpacity, FlatList, Alert, Dimensions } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

// Helper function to get last message
const getLastMessage = (postId) => {
  const messages = POST_MESSAGES[postId];
  return messages[messages.length - 1].text;
};

const CHATS = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Great! Would you like to trade?', // Last message from POST_MESSAGES['1']
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    postId: '1'
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: 'Would you like to trade for some bread?', // Last message from POST_MESSAGES['3']
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    postId: '3'
  },
];

const ChatItem = ({ name, lastMessage, avatar, postId }) => {
  return (
    <View style={styles.item}>
      <Image source={{ uri: avatar }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.lastMessage}>{lastMessage}</Text>
      </View>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push({
          pathname: "../(chatroom)/chatroom", // Add ../ to go up one level
          params: { name, avatar, lastMessage, postId }
        })}
      >
        <Ionicons name="chatbox-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default function MyChats() {
  const renderItem = ({ item }) => (
    <ChatItem 
      name={item.name}
      lastMessage={item.lastMessage}
      avatar={item.avatar}
      postId={item.postId}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity onPress={() => router.push('../(profile)/profile')}>
          <Ionicons name="person-circle-outline" size={40} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={CHATS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  list: {
    width: '100%',
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    height: 130,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  info: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lastMessage: {
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
    marginLeft: 'auto',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});