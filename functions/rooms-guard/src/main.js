import { Client, ID, TablesDB, Users, Query } from 'node-appwrite';

export default async ({ req, res }) => {
  try {
    const userId = req.headers['x-appwrite-user-id'];

    if (!userId) {
      throw new Error('Unauthorized: User is unauthorized');
    }

    const { action, roomId, teams, startTime, endTime, matchType, isLocked } =
      req.bodyJson;

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key']);

    const tablesDB = new TablesDB(client);
    const users = new Users(client);

    const CRIC_TALK_DATABASE_ID = process.env.APPWRITE_CRIC_TALK_DATABASE_ID;
    const ROOMS_TABLE_ID = process.env.APPWRITE_ROOMS_TABLE_ID;
    const RATE_LIMIT_TABLE_ID = process.env.APPWRITE_RATE_LIMIT_TABLE_ID;

    const user = await users.get(userId);
    const authorName = user.name || user.email.split('@')[0];

    async function rateLimitCheck(activity) {
      // implement rate limit
      // 10 requests per minute per user

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

      // check rate limit of user
      const row = userActivity.rows[0];

      if (row.activityCount >= 10) {
        throw new Error(
          'Rate limit exceeded: Too many requests in a short period'
        );
      }

      // increase activityCount if not rate limit exceeded
      await tablesDB.incrementRowColumn({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: RATE_LIMIT_TABLE_ID,
        rowId: row.$id,
        column: 'activityCount',
        value: 1,
      });
    }

    async function createRoom() {
      // implement rate limit check
      await rateLimitCheck('create_room');

      let status;

      const now = Date.now();
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (end < now) {
        status = 'finished';
      } else if (start > now) {
        status = 'upcoming';
      } else {
        status = 'live';
      }

      return await tablesDB.createRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: ROOMS_TABLE_ID,
        rowId: ID.unique(),
        data: {
          teams,
          authorId: userId,
          authorName,
          status,
          startTime,
          endTime,
          matchType,
          isLocked,
        },
      });
    }

    async function updateRoom() {
      // implement rate limit check
      await rateLimitCheck('update_room');

      const room = await tablesDB.getRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: ROOMS_TABLE_ID,
        rowId: roomId,
      });

      if (room.authorId !== userId)
        throw new Error("Forbidden: You aren't the room owner");

      let status;

      const now = Date.now();
      const start = new Date(startTime || room.startTime).getTime();
      const end = new Date(endTime || room.endTime).getTime();

      if (end < now) {
        status = 'finished';
      } else if (start > now) {
        status = 'upcoming';
      } else {
        status = 'live';
      }

      if (status === 'finished')
        throw new Error("Error: Room data can't be updated once its finished");

      return await tablesDB.updateRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: ROOMS_TABLE_ID,
        rowId: roomId,
        data: {
          teams: teams || room.teams,
          startTime: startTime || room.startTime,
          endTime: endTime || room.endTime,
          matchType: matchType || room.matchType,
          isLocked: isLocked ?? room.isLocked,
        },
      });
    }

    async function deleteRoom() {
      // implement rate limit check
      await rateLimitCheck('delete_room');

      const room = await tablesDB.getRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: ROOMS_TABLE_ID,
        rowId: roomId,
      });

      if (room.authorId !== userId) {
        throw new Error("Forbidden: You aren't the author of this room");
      }

      await tablesDB.deleteRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: ROOMS_TABLE_ID,
        rowId: roomId,
      });

      return { deleted: true, roomId };
    }

    let result;

    switch (action) {
      case 'create':
        result = await createRoom();
        break;
      case 'update':
        result = await updateRoom();
        break;
      case 'delete':
        result = await deleteRoom();
        break;
      default:
        throw new Error('Invalid action');
    }

    return res.json({ data: result, success: true });
  } catch (error) {
    throw new Error(`Unable to process query ${error}`);
  }
};
