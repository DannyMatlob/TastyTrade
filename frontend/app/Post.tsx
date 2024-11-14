import { GeoPoint } from "firebase/firestore";

export interface Post {
  title: string;
  imageUrl: string;
  postId: string;
  postCreationDate: Date;
  description: string;
  location: GeoPoint;
  creatorUid: string;
  creatorName: string;
}

export const createPost = (
    title: string,
    imageUrl: string,
    postId: string,
    postCreationDate: Date,
    description: string,
    location: GeoPoint,
    creatorUid: string,
    creatorName: string
): Post => {
  return {
    title,
    imageUrl,
    postId,
    postCreationDate,
    description,
    location,
    creatorUid,
    creatorName,
  };
};