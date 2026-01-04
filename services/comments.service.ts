import { CommentType } from "@/interfaces/Post";
import { tablesDB } from "@/libs/appwrite";
import { ID, Query } from "react-native-appwrite";

const CRIC_TALK_DATABASE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_CRIC_TALK_DATABASE_ID!;
const COMMENTS_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_COMMENTS_TABLE_ID!;

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

export async function addComment(
  postId: string,
  authorId: string,
  content: string
) {
  try {
    return await tablesDB.createRow<CommentType>({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: COMMENTS_TABLE_ID,
      rowId: ID.unique(),
      data: {
        postId,
        authorId,
        content,
        isEdited: false,
      },
    });
  } catch (error) {
    console.log(`Error while adding the comment ${error}`);
    throw error;
  }
}

export async function deleteComment(commentId: string) {
  try {
    return await tablesDB.deleteRow({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: COMMENTS_TABLE_ID,
      rowId: commentId,
    });
  } catch (error) {
    console.log(`Error while deleting the comment ${error}`);
    throw error;
  }
}
