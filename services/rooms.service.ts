import { tablesDB } from "@/libs/appwrite";
import { ID, Query } from "react-native-appwrite";

const CRIC_TALK_DATABASE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_CRIC_TALK_DATABASE_ID!;
const ROOMS_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_COMMENTS_TABLE_ID!;

export async function fetchRooms() {
  try {
    return await tablesDB.listRows({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: ROOMS_TABLE_ID,
      queries: [Query.orderDesc("startTime"), Query.limit(20)],
    });
  } catch (error) {
    console.log(`Error while fetching rhe rooms ${error}`);
    throw error;
  }
}

export async function createRoom(
  teams: string[],
  status: "upcoming" | "live" | "finished",
  startTime: string,
  matchType: "ODI" | "TEST" | "T20",
  endTime?: string
) {
  try {
    return await tablesDB.createRow({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: ROOMS_TABLE_ID,
      rowId: ID.unique(),
      data: {
        teams,
        status,
        startTime,
        endTime,
        matchType,
      },
    });
  } catch (error) {
    console.log(`Error while creating room ${error}`);
  }
}

export async function deleteRoom(roomId: string) {
  try {
    await tablesDB.deleteRow({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: ROOMS_TABLE_ID,
      rowId: roomId,
    });
  } catch (error) {
    console.log(`Error while deleting the room ${error}`);
  }
}
