import { tablesDB } from "@/libs/appwrite";
import { ID, Query } from "react-native-appwrite";

const CRIC_TALK_DATABASE_ID =
  process.env.EXPO_PUBLIC_APPWRITE_CRIC_TALK_DATABASE_ID!;
const POSTS_TABLES_ID = process.env.EXPO_PUBLIC_APPWRITE_POSTS_TABLE_ID!;

export async function fetchPosts() {
  try {
    return await tablesDB.listRows({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: POSTS_TABLES_ID,
      queries: [
        Query.orderDesc("views"),
        Query.orderDesc("likes"),
        Query.orderDesc("$createdAt"),
      ],
    });
  } catch (error) {
    console.log(`Error while fetching posts ${error}`);
    throw error;
  }
}

export async function createPost({
  content,
  image = [],
  authorId,
}: {
  content: string;
  image?: string[];
  authorId: string;
}) {
  try {
    return await tablesDB.createRow({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: POSTS_TABLES_ID,
      rowId: ID.unique(),
      data: {
        content,
        image,
        authorId,
        likes: 0,
        likedBy: [],
        views: 0,
        viewedBy: [],
        comments: [],
      },
    });
  } catch (error) {
    console.log(`Error while creating post ${error}`);
    throw error;
  }
}
