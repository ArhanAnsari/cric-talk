import { Models } from "react-native-appwrite";

export interface UserStats extends Models.Row {
  userId: string;
  messageCount: number;
}
