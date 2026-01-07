import { Client, ID, TablesDB, Users } from 'node-appwrite';

export default async ({ req, res }) => {
  try {
    const userId = req.headers['x-appwrite-user-id'];

    if (!userId) {
      throw new Error('Unauthorized: User not authenticated');
    }

    const { roomId, content, roomMessageId, action } = req.bodyJson;

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key']);

    const CRIC_TALK_DATABASE_ID = process.env.CRIC_TALK_DATABASE_ID;
    const ROOMS_TABLE_ID = process.env.ROOMS_TABLE_ID;
    const ROOM_MESSAGE_TABLE_ID = process.env.ROOM_MESSAGE_TABLE_ID;

    const tablesDB = new TablesDB(client);
    const users = new Users(client);

    const user = await users.get(userId);
    const username = user.name || user.email.split('@')[0];

    async function createRoomMessage() {
      const room = await tablesDB.getRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: ROOMS_TABLE_ID,
        rowId: roomId,
      });

      if (room.status !== 'live') {
        throw new Error('Unauthorized: room is not live');
      }

      await tablesDB.createRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: ROOM_MESSAGE_TABLE_ID,
        rowId: ID.unique(),
        data: {
          roomId,
          authorId: userId,
          authorName: username,
          content,
          isEdited: false,
        },
      });
    }

    async function updateRoomMessage() {
      const room = await tablesDB.getRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: ROOMS_TABLE_ID,
        rowId: roomId,
      });

      if (room.status !== 'live') {
        throw new Error('Unauthorized: room is not live');
      }

      await tablesDB.updateRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: ROOM_MESSAGE_TABLE_ID,
        rowId: roomMessageId,
        data: {
          content,
        },
      });
    }

    async function deleteRoomMessage() {
      const room = await tablesDB.getRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: ROOMS_TABLE_ID,
        rowId: roomId,
      });

      if (room.status !== 'live') {
        throw new Error('Unauthorized: room is not live');
      }

      await tablesDB.deleteRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: ROOM_MESSAGE_TABLE_ID,
        rowId: roomMessageId,
      });
    }

    switch (action) {
      case 'create':
        await createRoomMessage();
        break;
      case 'update':
        await updateRoomMessage();
        break;
      case 'delete':
        await deleteRoomMessage();
        break;
      default:
        throw new Error('Invalid action');
    }

    return res.json({ success: true });
  } catch (error) {
    throw new Error(error.message);
  }
};
