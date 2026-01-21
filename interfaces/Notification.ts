import { Models } from "react-native-appwrite";

interface Notification extends Models.Row {
  userId: string;
  title: string;
  content: string;
}
