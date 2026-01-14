import { Room } from "@/interfaces/Room";
import { tablesDB } from "@/libs/appwrite";
import { ID, Query } from "react-native-appwrite";

const CRIC_TALK_DATABASE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_CRIC_TALK_DATABASE_ID!;
const ROOMS_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_ROOMS_TABLE_ID!;

export async function fetchRooms() {
  try {
    return await tablesDB.listRows<Room>({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: ROOMS_TABLE_ID,
      queries: [Query.orderDesc("startTime"), Query.limit(20)],
    });
  } catch (error) {
    console.log(`Error while fetching rhe rooms ${error}`);
    throw error;
  }
}

export async function createRoom({
  teams,
  status,
  authorId,
  authorName,
  startTime,
  matchType,
  isLocked,
  endTime,
}: {
  teams: string[];
  status: "upcoming" | "live" | "finished";
  authorId: string;
  authorName: string;
  startTime: string;
  matchType: "ODI" | "TEST" | "T20";
  isLocked: boolean;
  endTime?: string;
}) {
  try {
    return await tablesDB.createRow<Room>({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: ROOMS_TABLE_ID,
      rowId: ID.unique(),
      data: {
        teams,
        status,
        authorId,
        authorName,
        startTime,
        endTime,
        matchType,
        isLocked,
      },
    });
  } catch (error) {
    console.log(`Error while creating room ${error}`);
    throw error;
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
    throw error;
  }
}
