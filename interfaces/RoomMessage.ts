import { Models } from "react-native-appwrite";

export interface RoomMessage extends Models.Row {
  roomId: string;
  authorId: string;
  content: string;
}
