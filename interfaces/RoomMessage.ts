import { Models } from "react-native-appwrite";

export interface RoomMessage extends Models.Row {
  roomId: string;

  authorId: string;
  authorName: string;

  content: string;

  isEdited: boolean;
}
