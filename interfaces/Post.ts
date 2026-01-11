import { Models } from "react-native-appwrite";

export interface CommentType extends Models.Row {
  postId: string;
  authorId: string;
  content: string;
  isEdited: boolean;
}

export interface Post extends Models.Row {
  content: string;
  image?: string[];

  authorId: string;
  authorName: string;

  likes: number;
  likedBy: string[];

  views: number;
  viewedBy: string[];

  commentCount: number;
}
