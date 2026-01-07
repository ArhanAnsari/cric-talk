import { functions, tablesDB } from "@/libs/appwrite";
import { Query } from "react-native-appwrite";

const CRIC_TALK_DATABASE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_CRIC_TALK_DATABASE_ID!;
const ROOM_MESSAGE_TABLE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_ROOM_MESSAGE_TABLE_ID!;
const ROOM_MESSAGE_GUARD_FUNCTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_ROOM_MESSAGE_GUARD_FUNCTION_ID!;

export async function fetchRoomMessages(roomId: string) {
  try {
    return await tablesDB.listRows({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: ROOM_MESSAGE_TABLE_ID,
      queries: [
        Query.equal("roomId", roomId),
        Query.orderDesc("$createdAt"),
        Query.limit(50),
      ],
    });
  } catch (error) {
    console.log(`Error while fetching room messages ${error}`);
    throw error;
  }
}

export async function executeRoomMessage({
  roomId,
  content,
  roomMessageId,
  action,
}: {
  action: "create" | "update" | "delete";
  roomId: string;
  content?: string;
  roomMessageId?: string;
}) {
  try {
    return await functions.createExecution({
      functionId: ROOM_MESSAGE_GUARD_FUNCTION_ID,
      body: JSON.stringify({ roomId, content, roomMessageId, action }),
      async: false,
    });
  } catch (error) {
    console.log(`Error while executing room message ${action} action ${error}`);
    throw error;
  }
}
