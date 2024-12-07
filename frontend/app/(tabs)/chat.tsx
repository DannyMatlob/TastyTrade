import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, View, Text, TouchableOpacity, FlatList, Alert, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useUser } from '../UserContext';
import { Post, User, Chat } from '../interfaces';

const ChatItem = ({ preview } : {preview: Preview}) => {
  return (
    <View style={styles.item}>
      <Image source={{uri: preview.postImg}} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{preview.name}</Text>
        <Text style={styles.lastMessage}>{preview.lastMessage}</Text>
      </View>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push({
          pathname: ("../(chatroom)/chatroom/[id]"),
          params: { id: preview.chatId }
        })}
      >
        <Ionicons name="chatbox-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

 //In order to make it presentable, we must filter the raw chats data into the opposite user and an image of the food item
 interface Preview {
    userId: string;
    chatId: string;
    name: string;
    lastMessage: string;
    postImg: string; 
 }

export default function MyChats() {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const { user } = useUser();
  
  //Business Logic
  /** Given a user's UID, retrieve all chatIds in the 'users' database */
  const retrieveListOfChats = async (userUid: string) => {
    console.log("\n\nRetrieving list of chats\n\n");
    if (!userUid) {
      console.error("User ID is null...");
      return;
    }

    const userDocRef = doc(db, "users", userUid);
    const userDocSnap = await getDoc(userDocRef);
    //Handle the case where there's no user retrieved from db
    if (!userDocSnap.exists()) {
      console.error("Fatal error: current user could not be retrieved from the database.");
      return;
    }

    const chatIds = userDocSnap.data().chats;
    // Handle the case where there are no retrievable posts.
    if (!chatIds || chatIds.length == 0) {
      setPreviews([]);
      return;
    }

    // For each chat, retrieve the data from the "chat" database and return as a chat object.
    const chatPromises = chatIds.map(async (chatId: string) => {
      const chatDocRef = doc(db, "chats", chatId);
      const chatDocSnap = await getDoc(chatDocRef);

      if (chatDocSnap.exists()) {
        console.log()
        return chatDocSnap.data() as Chat;
      } else {
        return null;
      }
    });

    const chatsData = await Promise.all(chatPromises);
    const validChatsData = chatsData.filter((chat) => chat !== null) as Chat[];

    //Take the raw chats data and convert it into a previews array
    const previewsData : Preview[] = [];
    for (const chat of validChatsData) {
      console.log("Processing chat:", chat.chatId);

      const preview: Preview = {
        chatId: chat.chatId,
        userId: "",
        name: "Failed to load user name",
        lastMessage: "Failed to load last message",
        postImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-k83MyoiH43lpI6Y-TY17A2JCPudD_7Av9A&s",
      };

      // Determine the other user's ID
      preview.userId = chat.user1 === userUid ? chat.user2 : chat.user1;

      // Retrieve the other user's name
      try {
        const user2Ref = doc(db, "users", preview.userId);
        const user2Snap = await getDoc(user2Ref);
        preview.name = (user2Snap.data() as User)?.name || "Failed to load user name";
      } catch (e) {
        console.error("Failed to retrieve user:", preview.userId, e);
      }

      // Retrieve the post image
      try {
        const postRef = doc(db, "posts", chat.postId);
        const postSnap = await getDoc(postRef);
        preview.postImg = (postSnap.data() as Post)?.imageUrl || preview.postImg;
      } catch (e) {
        console.error("Failed to retrieve post:", preview.userId, e);
      }

      // Set the last message
      preview.lastMessage = chat.messages[chat.messages.length - 1]?.msg || "No messages";

      // Add the preview to the array
      previewsData.push(preview);
    }

    setPreviews(previewsData);
  };

  useEffect(() => {
    // Wait for the current user's information to be loaded.
    if (user === undefined || user === null || !user.uid) { console.error("Returning, no user"); return; }

    try {
      retrieveListOfChats(user.uid);
    } catch (error) {
      console.error(`Error fetching user chats: ${error}`);
    }
  }, [user]);

  //Rendering Logic
  const renderItem = ({ item }: { item: Preview }) => (
    <ChatItem 
      preview={item}
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
        data={previews}
        renderItem={renderItem}
        keyExtractor={item => item.chatId}
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