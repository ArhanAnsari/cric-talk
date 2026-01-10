import { Models } from "react-native-appwrite";

export interface UserStats extends Models.Row {
  messageCount: number;
}
