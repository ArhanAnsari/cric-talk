import { Client, ID, TablesDB, Users } from "node-appwrite";

export default async ({ req, res }) => {
  try {
    const userId = req.headers["x-appwrite-user-id"];

    if (!userId) {
      throw new Error(`Unauthorized: User is not authorized`);
    }

    const { action, postId, content, images } = req.bodyJson;

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(req.headers["x-appwrite-key"]);

    const tablesDB = new TablesDB(client);
    const users = new Users(client);

    const CRIC_TALK_DATABASE_ID = process.env.APPWRITE_CRIC_TALK_DATABASE_ID;
    const POSTS_TABLE_ID = process.env.APPWRITE_POSTS_TABLE_ID;

    const user = await users.get(userId);
    const authorName = user.name || user.email.split("@")[0];

    async function createPost() {
     return await tablesDB.createRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: POSTS_TABLE_ID,
        rowId: ID.unique(),
        data: {
          content,
          images,
          authorId: userId,
          authorName,
          likes: 0,
          likedBy: [],
          views: 0,
          viewedBy: [],
          commentCount: 0,
        },
      });
    }

    async function updatePost() {
      const post = await tablesDB.getRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: POSTS_TABLE_ID,
        rowId: postId,
      });

      if (post.authorId !== userId) {
        throw new Error("Forbidden: You aren't author of this post");
      }

      return await tablesDB.updateRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: POSTS_TABLE_ID,
        rowId: postId,
        data: {
          content,
          images,
        },
      });
    }

    async function deletePost() {
      const post = await tablesDB.getRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: POSTS_TABLE_ID,
        rowId: postId,
      });

      if (post.authorId !== userId) {
        throw new Error("Forbidden: You aren't author of this post");
      }

      await tablesDB.deleteRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: POSTS_TABLE_ID,
        rowId: postId,
      });

      return {deleted: true, postId}
    }

    let result;

    switch (action) {
      case "create":
        result = await createPost();
        break;
      case "update":
        result = await updatePost();
        break;
      case "delete":
        await deletePost();
        break;
      default:
        throw new Error("Invalid action");
    }

    return res.json({ success: true, data: result });
  } catch (error) {
    throw new Error(`Unable to process query ${error}`);
  }
};
