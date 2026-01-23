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
      if (typeof content !== 'string' || !content.trim())
        throw new Error("Error: Comment can't be empty");
      if (typeof postId !== 'string' || !postId.trim())
        throw new Error('Error: Post ID is required to add comment');

      const cleanedContent = content.trim();
      const cleanedPostId = postId.trim();

      return await tablesDB.createRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: COMMENTS_TABLE_ID,
        rowId: ID.unique(),
        data: {
          postId: cleanedPostId,
          authorId: userId,
          content: cleanedContent,
          isEdited: false,
        },
      });
    }

    async function updateComment() {
      if (typeof content !== 'string' || !content.trim())
        throw new Error("Error: Comment can't be empty to update");
      if (typeof commentId !== 'string' || !commentId.trim())
        throw new Error("Error: Comment ID can't be empty to update");

      const cleanedContent = content.trim();
      const cleanedCommentId = commentId.trim();

      const comment = await tablesDB.getRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: COMMENTS_TABLE_ID,
        rowId: cleanedCommentId,
      });

      if (comment.authorId !== userId)
        throw new Error("Forbidden: You aren't owner of this comment");

      return await tablesDB.updateRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: COMMENTS_TABLE_ID,
        rowId: cleanedCommentId,
        data: {
          postId: comment.postId,
          authorId: comment.authorId,
          content: cleanedContent,
          isEdited: comment.isEdited,
        },
      });
    }

    async function deleteComment() {
      if (typeof commentId !== 'string' || !commentId.trim())
        throw new Error('Error: Comment ID is required to delete a comment');
      const cleanedCommentId = commentId.trim();

      const comment = await tablesDB.getRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: COMMENTS_TABLE_ID,
        rowId: cleanedCommentId,
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
      case 'update':
        result = await updateComment();
        break;
      default:
        throw new Error('Invalid action');
    }

    return res.json({ success: true, data: result });
  } catch (error) {
    throw new Error(`Unable to process query: ${error}`);
  }
};
