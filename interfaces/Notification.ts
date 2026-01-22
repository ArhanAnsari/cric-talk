import { Models } from "react-native-appwrite";

export interface Notification extends Models.Row {
  userId: string;
  title: string;
  content: string;
}
