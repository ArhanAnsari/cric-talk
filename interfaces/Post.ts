import { Models } from "react-native-appwrite";

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
