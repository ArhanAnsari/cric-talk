import { tablesDB } from "@/libs/appwrite";
import { Query } from "react-native-appwrite";

const CRIC_TALK_DATABASE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_CRIC_TALK_DATABASE_ID!;
const ROOM_MESSAGE_TABLE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_ROOM_MESSAGE_TABLE_ID!;

export async function fetchRoomMessages(roomId: string) {
  try {
    return await tablesDB.listRows({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: ROOM_MESSAGE_TABLE_ID,
      queries: [Query.equal("roomId", roomId), Query.orderDesc("$createdAt")],
    });
  } catch (error) {
    console.log(`Error while fetching room messages ${error}`);
    throw error;
  }
}
