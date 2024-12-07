import { GeoPoint } from "firebase/firestore";

export interface User {
    chats: [Chat];
    createdOn: Date;
    email: string;
    location: GeoPoint;
    name: string;
    posts: [Post];
    uid: string;
}

export interface Chat {
    chatId: string;
    user1: string;
    user2: string;
    postId: string;
    messages: [Message];
 }

export interface Message {
  msg: string;
  owner: string;
  timestamp: Date;
}

export interface Post {
    title: string;
    imageUrl: string;
    postId: string;
    postCreationDate: Date;
    description: string;
    location: GeoPoint;
    creatorUid: string;
    creatorName: string;
    distanceFromUser: number;
  }