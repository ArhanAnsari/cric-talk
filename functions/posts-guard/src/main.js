import {
  Client,
  ID,
  TablesDB,
  Users,
  Query,
  Role,
  Permission,
} from 'node-appwrite';

export default async ({ req, res }) => {
  try {
    const userId = req.headers['x-appwrite-user-id'];

    if (!userId) {
      throw new Error(`Unauthorized: User is not authorized`);
    }

    const { action, postId, content, images } = req.bodyJson;

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key']);

    const tablesDB = new TablesDB(client);
    const users = new Users(client);

    const CRIC_TALK_DATABASE_ID = process.env.APPWRITE_CRIC_TALK_DATABASE_ID;
    const POSTS_TABLE_ID = process.env.APPWRITE_POSTS_TABLE_ID;
    const RATE_LIMIT_TABLE_ID = process.env.APPWRITE_RATE_LIMIT_TABLE_ID;

    const user = await users.get(userId);
    const authorName = user.name || user.email.split('@')[0];

    async function rateLimitCheck(activity) {
      // implement rate limit
      // 10 request per minute per user

      // get windowKey and userActivity
      const windowKey = Math.floor(Date.now() / 60000);
      const userActivity = await tablesDB.listRows({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: RATE_LIMIT_TABLE_ID,
        queries: [
          Query.equal('userId', userId),
          Query.equal('activity', activity),
          Query.equal('windowKey', windowKey),
          Query.limit(1),
        ],
      });

      // if userActivity doesn't exists create one
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

      // check rate limit of the user
      const row = userActivity.rows[0];
      if (row.activityCount >= 10) {
        throw new Error(
          'Rate limit exceeded: Too many requests in a short period.'
        );
      }

      // increase activityCount if limit not exceeded
      await tablesDB.incrementRowColumn({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: RATE_LIMIT_TABLE_ID,
        rowId: row.$id,
        column: 'activityCount',
        value: 1,
      });
    }

    async function createPost() {
      // implement rate limit check
      await rateLimitCheck('create_post');

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
        permissions: [
          Permission.read(Role.users()),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId)),
        ],
      });
    }

    async function updatePost() {
      // implement rate limit check
      await rateLimitCheck('update_post');

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
      // implement rate limit check
      await rateLimitCheck('delete_post');

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

      return { deleted: true, postId };
    }

    async function likePost() {
      const post = await tablesDB.getRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: POSTS_TABLE_ID,
        rowId: postId,
      });

      const likes = post.likes || 0;
      const likedBy = post.likedBy || [];

      const hasLiked = likedBy.includes(userId);

      const updatedLikes = hasLiked ? likes - 1 : likes + 1;
      const updatedLikedBy = hasLiked
        ? likedBy.filter((id) => id !== userId)
        : [...likedBy, userId];

      return await tablesDB.updateRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: POSTS_TABLE_ID,
        rowId: postId,
        data: { likes: updatedLikes, likedBy: updatedLikedBy },
      });
    }

    async function viewPost() {
      const post = await tablesDB.getRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: POSTS_TABLE_ID,
        rowId: postId,
      });

      const views = post.views;
      const viewedBy = post.viewedBy;

      if (viewedBy.includes(userId)) return;

      return await tablesDB.updateRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: POSTS_TABLE_ID,
        rowId: postId,
        data: { views: views + 1 },
      });
    }

    let result;

    switch (action) {
      case 'create':
        result = await createPost();
        break;
      case 'update':
        result = await updatePost();
        break;
      case 'delete':
        result = await deletePost();
        break;
      case 'like':
        result = await likePost();
        break;
      case 'view':
        result = await viewPost();
        break;
      default:
        throw new Error('Invalid action');
    }

    return res.json({ success: true, data: result });
  } catch (error) {
    throw new Error(`Unable to process query ${error}`);
  }
};
