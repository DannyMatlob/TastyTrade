import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { arrayRemove, arrayUnion, deleteDoc, doc, GeoPoint, getDoc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Chat, Message, Post, User } from '@/app/interfaces';
import { useUser } from '@/app/UserContext';
import * as geolib from 'geolib';

interface FoodPost {
  title: string;
  image: string;
  distance: string;
}
interface ChatBubble {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
}
export default function ChatRoom() {
  const [name, setName] = useState<string>('Loading...');
  const [bubbles, setBubbles] = useState<ChatBubble[]>([]);
  const [foodPost, setFoodPost] = useState<FoodPost>();
  const [newMessage, setNewMessage] = useState<string>('');
  const { user } = useUser();
  const { id } = useLocalSearchParams();

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
          {latitude: postGeoPoint.latitude, longitude: postGeoPoint.longitude},
          {latitude: userGeoPoint.latitude, longitude: userGeoPoint.longitude});

      const distanceInMiles = geolib.convertDistance(distanceBetweenPostAndUser, 'mi');
      return parseFloat(distanceInMiles.toFixed(2));
    } else {
      return -1;
    }
  }

  //Logic to retrieve all information
  const retrieveChat = async () => {
    if (!user) {console.error("No user defined"); return;}
    const chatRef = doc(db, "chats", id as string);
    const chatSnap = await getDoc(chatRef);
    const chat = chatSnap.data() as Chat;

    const otherUserId = chat.user1 == user.uid ? chat.user2 : chat.user1;
    // Retrieve other user and calculate distance and set name
    let distance = -1;
    try {
      const user2Ref = doc(db, "users", otherUserId);
      const user2Snap = await getDoc(user2Ref);
      const otherUser = user2Snap.data() as User || "Failed to load other user";
      distance = await calculateDistanceFromPostToUser(otherUser.location);

      setName(otherUser.name);
    } catch (e) {
      console.error(e);
    }

    //Retrieve post image
    try {
      const postRef = doc(db, "posts", chat.postId);
      const postSnap = await getDoc(postRef);
      const post = (postSnap.data() as Post);
      const foodPostData : FoodPost = {
        title: post.title,
        image: post.imageUrl,
        distance: distance.toString()
      }
      setFoodPost(foodPostData);
    } catch (e) {
      console.error(e);
    }

    // Retrieve messages and format them as chat bubbles
    const bubblesData : ChatBubble[] = [];
    let curId = 0;
    for (const message of chat.messages) {
      const date = new Date(message.timestamp.seconds * 1000)
        const bubble : ChatBubble = {
          id: curId,
          text: message.msg,
          sender: message.owner == user.uid ? "self" : "other",
          timestamp: date.toLocaleDateString()
        }
        curId++;
        bubblesData.push(bubble);
    }
    setBubbles(bubblesData);
  }

  //Logic to send message to firebase
  const sendMessage = async () => {
    if (!user || !id) {console.error("this shouldn't happen"); return;}

    const msgObject = {
      msg: newMessage,
      owner: user.uid as string,
      timestamp: new Date()
    }

    const chatRef = doc(db, "chats", id as string);
    await updateDoc(chatRef, {
      messages: arrayUnion(msgObject)
    });
    setNewMessage('');
  }

  //Logic to delete the chat from firebase
  const deleteChatFromDatabase = async () => {
    try {
      const chatRef = doc(db, "chats", id as string);
      const chatSnap = (await getDoc(chatRef)).data() as Chat;
      const user1Ref = doc(db, "users", chatSnap.user1);
      const user2Ref = doc(db, "users", chatSnap.user2)

      // Remove the chat from the chats array in Firestore
      await updateDoc(user1Ref, {
        chats: arrayRemove(id),
      });
      await updateDoc(user2Ref, {
        chats: arrayRemove(id),
      });

      //Delete the chat document from firebase (NOT ENABLED)
      //await deleteDoc(chatRef);
      console.log("Chat deleted successfully");
      router.back();
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", id as string), (doc) => {
      const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
      console.log("NEW TEXT DETECTED");
      retrieveChat();
    });
  }, [])

  //Rendering Logic
  const renderMessage = ({ item } : {item: ChatBubble}) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'self' ? styles.userMessage : styles.otherMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender === 'self' ? styles.userMessageText : styles.otherMessageText
      ]}>
        {item.text}
      </Text>
    </View>
  );

  const deleteChat = () => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this chat?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Code to delete the chat
            console.log(`Deleting chat with ID: ${id}`);
            // Example: Firebase deletion code
            deleteChatFromDatabase();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
    {foodPost ? (
    <View style={styles.container}>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{"Chat with " + name}</Text>
        <TouchableOpacity 
          style={{ paddingVertical: 5, paddingHorizontal: 10, backgroundColor: 'red', borderRadius: 5 }}
          onPress={() => deleteChat()}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete Chat</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.foodPostContainer}>
        <Image source={{ uri: foodPost?.image}} style={styles.foodImage} />
        <View style={styles.foodInfo}>
          <Text style={styles.foodTitle}>{foodPost?.title}</Text>
          <Text style={styles.foodDistance}>{foodPost?.distance}</Text>
        </View>
      </View>
      
      <FlatList
        data={bubbles}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={() => {
            sendMessage();
          }}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
    ):
    (<View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.name}>{"Loading..."}</Text>
      </View>
    </View>)
    }
    </>
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

