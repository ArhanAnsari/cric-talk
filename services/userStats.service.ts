import { UserStats } from "@/interfaces/UserStats";
import { tablesDB } from "@/libs/appwrite";

const CRIC_TALK_DATABASE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_CRIC_TALK_DATABASE_ID!;
const USERS_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_USERS_TABLE_ID!;

export async function fetchUserStat(userId: string) {
  try {
    await tablesDB.getRow<UserStats>({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: USERS_TABLE_ID,
      rowId: userId,
    });
  } catch (error) {
    console.log(`Error while fetching user message count ${error}`);
    throw error;
  }
}
