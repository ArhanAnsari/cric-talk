import { Client, ID, TablesDB, Users } from 'node-appwrite';

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

    const user = await users.get(userId);
    const authorName = user.name || user.email.split('@')[0];

    async function createRoom() {
      return await tablesDB.createRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: ROOMS_TABLE_ID,
        rowId: ID.unique(),
        data: {
          teams,
          authorId: userId,
          authorName,
          startTime,
          endTime,
          matchType,
          isLocked,
        },
      });
    }

    async function updateRoom() {
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
