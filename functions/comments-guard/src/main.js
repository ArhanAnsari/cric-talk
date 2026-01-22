import { Client, ID, TablesDB } from 'node-appwrite';

export default async ({ req, res }) => {
  const userId = req.headers['x-appwrite-user-id'];
  if (!userId)
    throw new Error(
      'Unauthorized: The user is not authorized to perform this action.'
    );

  const { action, postId, commentId, content } = req.bodyJson;

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key']);
  const tablesDB = new TablesDB(client);

  const CRIC_TALK_DATABASE_ID = process.env.APPWRITE_CRIC_TALK_DATABASE_ID;
  const COMMENTS_TABLE_ID = process.env.APPWRITE_COMMENTS_TABLE_ID;

  async function addComment() {
    return await tablesDB.createRow({
      datbaseId: CRIC_TALK_DATABASE_ID,
      tableId: COMMENTS_TABLE_ID,
      rowId: ID.unique(),
      data: {
        postId,
        authorId: userId,
        content,
      },
    });
  }

  async function deleteComment() {
    const comment = tablesDB.getRow({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: COMMENTS_TABLE_ID,
      rowId: commentId,
    });

    if (comment.authorId !== userId) {
      throw new Error("Forbidden: You aren't allowed to delete this comment.");
    }

    await tablesDB.deleteRow({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: COMMENTS_TABLE_ID,
      rowId: commentId,
    });

    return { deleted: true, commentId };
  }
};
