import { Models } from "react-native-appwrite";

export interface UserStats extends Models.Row {
  username: string;
  messageCount: number;
}
