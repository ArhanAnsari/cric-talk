import { Room } from "@/interfaces/Room";
import { functions, tablesDB } from "@/libs/appwrite";
import { Query } from "react-native-appwrite";

const CRIC_TALK_DATABASE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_CRIC_TALK_DATABASE_ID!;
const ROOMS_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_ROOMS_TABLE_ID!;
const ROOMS_GUARD_FUNCTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_ROOMS_GUARD_FUNCTION_ID!;

export async function fetchRooms() {
  try {
    const data = await tablesDB.listRows<Room>({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: ROOMS_TABLE_ID,
      queries: [Query.orderDesc("startTime"), Query.limit(20)],
    });

    const rooms: Room[] = data.rows;
    const iteratedRooms: Room[] = [];

    rooms.forEach((item: Room) => {
      let status: "upcoming" | "live" | "finished" = "upcoming";
      const now = Date.now();
      const start = new Date(item.startTime).getTime();
      const end = new Date(item.endTime || "").getTime();

      if (end < now) {
        status = "finished";
      } else if (start > now) {
        status = "upcoming";
      } else {
        status = "live";
      }

      item.status = status;

      iteratedRooms.push(item);
    });

    return iteratedRooms;
  } catch (error) {
    console.log(`Error while fetching rhe rooms ${error}`);
    throw error;
  }
}

export async function executeRoom({
  action,
  roomId,
  teams,
  status,
  startTime,
  endTime,
  matchType,
  isLocked,
}: {
  action: "create" | "update" | "delete";
  teams: string[];
  status: "upcoming" | "live" | "finished";
  startTime: string;
  matchType: "ODI" | "TEST" | "T20";
  isLocked: boolean;
  roomId?: string;
  endTime?: string;
}) {
  try {
    const execution = await functions.createExecution({
      functionId: ROOMS_GUARD_FUNCTION_ID,
      body: JSON.stringify({
        action,
        roomId,
        teams,
        status,
        startTime,
        endTime,
        matchType,
        isLocked,
      }),
      async: false,
    });

    if (execution.status === "failed") {
      throw new Error(execution.errors);
    }

    return execution;
  } catch (error) {
    console.log(`Error while executing room ${action} action ${error}`);
    throw error;
  }
}
