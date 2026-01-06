import { tablesDB } from "@/libs/appwrite";
import { ID, Query } from "react-native-appwrite";

const CRIC_TALK_DATABASE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_CRIC_TALK_DATABASE_ID!;
const ROOM_MESSAGE_TABLE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_ROOM_MESSAGE_TABLE_ID!;

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

export async function createRoomMessage({
  roomId,
  authorId,
  authorName,
  content,
  isEdited,
}: {
  roomId: string;
  authorId: string;
  authorName: string;
  content: string;
  isEdited: boolean;
}) {
  try {
    return await tablesDB.createRow({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: ROOM_MESSAGE_TABLE_ID,
      rowId: ID.unique(),
      data: {
        roomId,
        authorId,
        authorName,
        content,
        isEdited,
      },
    });
  } catch (error) {
    console.log(`Error while creating the room message ${error}`);
    throw error;
  }
}

export async function updateRoomMessage({
  roomMessageId,
  content,
}: {
  roomMessageId: string;
  content: string;
}) {
  try {
    return await tablesDB.updateRow({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: ROOM_MESSAGE_TABLE_ID,
      rowId: roomMessageId,
      data: {
        content,
      },
    });
  } catch (error) {
    console.log(`Error while updating the room message ${error}`);
    throw error;
  }
}

export async function deleteRoomMessage(roomMessageId: string) {
  try {
    return await tablesDB.deleteRow({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: ROOM_MESSAGE_TABLE_ID,
      rowId: roomMessageId,
    });
  } catch (error) {
    console.log(`Error while deleting the room message ${error}`);
    throw error;
  }
}
