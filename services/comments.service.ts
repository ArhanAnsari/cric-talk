import { CommentType } from "@/schemas/CommentSchema";
import { functions, tablesDB } from "@/libs/appwrite";
import { Query } from "react-native-appwrite";

const CRIC_TALK_DATABASE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_CRIC_TALK_DATABASE_ID!;
const COMMENTS_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_COMMENTS_TABLE_ID!;
const COMMENTS_GUARD_FUNCTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_COMMENTS_GUARD_FUNCTION_ID!;

export async function fetchComments(postId: string) {
  try {
    return await tablesDB.listRows<CommentType>({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: COMMENTS_TABLE_ID,
      queries: [Query.equal("postId", postId), Query.orderDesc("$createdAt")],
    });
  } catch (error) {
    console.log(`Error while fetching the comments ${error}`);
    throw error;
  }
}

export async function executeComment({
  action,
  postId,
  commentId,
  content,
}: {
  action: "add" | "update" | "delete";
  postId?: string;
  commentId?: string;
  content?: string;
}) {
  try {
    return await functions.createExecution({
      functionId: COMMENTS_GUARD_FUNCTION_ID,
      body: JSON.stringify({ action, postId, commentId, content }),
      async: false,
    });
  } catch (error) {
    console.log(`Error while executing comment ${action} action`);
    throw error;
  }
}
