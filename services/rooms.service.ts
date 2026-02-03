import { Room } from "@/interfaces/Room";
import { functions, tablesDB } from "@/libs/appwrite";
import { Query } from "react-native-appwrite";

const CRIC_TALK_DATABASE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_CRIC_TALK_DATABASE_ID!;
const ROOMS_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_ROOMS_TABLE_ID!;
const ROOMS_GUARD_FUNCTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_ROOMS_GUARD_FUNCTION_ID!;

export async function fetchRooms(userId?: string) {
  try {
    const queries = [Query.orderDesc("startTime"), Query.limit(20)];

    if (userId) queries.push(Query.equal("authorId", userId));

    const data = await tablesDB.listRows<Room>({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: ROOMS_TABLE_ID,
      queries,
    });

    const rooms: Room[] = data.rows;

    const updatedRooms: Room[] = rooms.map((item: Room) => {
      let status: "upcoming" | "live" | "finished";
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

      return { ...item, status };
    });

    const priority = { live: 0, upcoming: 1, finished: 2 };

    return updatedRooms.sort((a, b) => {
      if (priority[a.status] !== priority[b.status]) {
        return priority[a.status] - priority[b.status];
      }
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });
  } catch (error) {
    console.log(`Error while fetching the rooms ${error}`);
    throw error;
  }
}

export async function executeRoom({
  action,
  roomId,
  teams,
  startTime,
  endTime,
  matchType,
  isLocked,
}: {
  action: "create" | "update" | "delete";
  teams: string[];
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
