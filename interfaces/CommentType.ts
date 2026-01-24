import { Models } from "react-native-appwrite";

export interface CommentType extends Models.Row {
  postId: string;
  authorId: string;
  content: string;
  isEdited: boolean;
}
