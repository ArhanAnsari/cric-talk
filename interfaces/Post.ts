import { Models } from "react-native-appwrite";

export interface CommentType extends Models.Row {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  isEdited: boolean;
  createdAt: string;
}

export interface Post extends Models.Row {
  content: string;
  image?: string[];
  authorId: string;

  likes: number;
  likedBy: string[];

  views: number;
  viewedBy: string[];
}
