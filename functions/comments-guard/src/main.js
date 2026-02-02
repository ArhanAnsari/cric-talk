import { Client, ID, TablesDB, Query } from 'node-appwrite';

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

    // rate limit table
    const RATE_LIMIT_TABLE_ID = process.env.APPWRITE_RATE_LIMIT_TABLE_ID;

    async function rateLimitCheck(activity) {
      // rate limit application
      // 60 comments per 1 min per user

      // create window key
      const windowKey = Math.floor(Date.now() / 60000);
      // get "add_comment" activity for user in current window
      const userActivity = await tablesDB.listRows({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: RATE_LIMIT_TABLE_ID,
        queries: [
          Query.equal('userId', userId),
          Query.equal('windowKey', windowKey),
          Query.equal('activity', activity),
          Query.limit(1),
        ],
      });

      // if user activity doesn't exits create one
      if (userActivity.rows.length === 0) {
        await tablesDB.createRow({
          databaseId: CRIC_TALK_DATABASE_ID,
          tableId: RATE_LIMIT_TABLE_ID,
          rowId: ID.unique(),
          data: {
            userId,
            activity,
            windowKey,
            activityCount: 1,
          },
        });
        return;
      }

      // if user exceeds the limit block the request
      if (userActivity.rows[0].activityCount >= 60)
        throw new Error(
          'Rate limit exceeded: Too many requests. Please try again later.'
        );

      // increase activity count
      await tablesDB.incrementRowColumn({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: RATE_LIMIT_TABLE_ID,
        rowId: userActivity.rows[0].$id,
        column: 'activityCount',
        value: 1,
      });
    }

    async function addComment() {
      // implement rate limit check
      await rateLimitCheck('add_comment');

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
      // implement rate limit check
      await rateLimitCheck('update_comment');

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
          isEdited: true,
        },
      });
    }

    async function deleteComment() {
      // implement rate limit check
      await rateLimitCheck('delete_comment');

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
