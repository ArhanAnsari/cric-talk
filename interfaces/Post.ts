import { Models } from "react-native-appwrite";

type CommentType = {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
};

export interface Post extends Models.Transaction {
  content: string;
  image?: string[];
  authorId: string;

  likes: number;
  likedBy: string[];

  views: number;
  viewedBy: string[];

  comments: CommentType[];
}
