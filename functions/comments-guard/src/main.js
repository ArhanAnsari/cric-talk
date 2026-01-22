import { Client, ID, TablesDB } from 'node-appwrite';

export default async ({ req, res }) => {
  try {
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
      if (!content) throw new Error("Error: Comment can't be empty");
      if (!postId) throw new Error('Error: Post ID is required to add comment');

      return await tablesDB.createRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: COMMENTS_TABLE_ID,
        rowId: ID.unique(),
        data: {
          postId,
          authorId: userId,
          content,
          isEdited: false,
        },
      });
    }

    async function deleteComment() {
      const comment = await tablesDB.getRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: COMMENTS_TABLE_ID,
        rowId: commentId,
      });

      if (comment.authorId !== userId) {
        throw new Error(
          "Forbidden: You aren't allowed to delete this comment."
        );
      }

      await tablesDB.deleteRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: COMMENTS_TABLE_ID,
        rowId: commentId,
      });

      return { deleted: true, commentId };
    }

    let result;

    switch (action) {
      case 'add':
        result = await addComment();
        break;
      case 'delete':
        result = await deleteComment();
        break;
      default:
        throw new Error('Invalid action');
    }

    return res.json({ success: true, data: result });
  } catch (error) {
    throw new Error(`Unable to process query: ${error}`);
  }
};
