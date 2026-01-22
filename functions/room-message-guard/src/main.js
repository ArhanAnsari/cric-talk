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
    const USERS_TABLE_ID = process.env.USERS_TABLE_ID;
    const NOTIFICATIONS_TABLE_ID = process.env.APPWRITE_NOTIFICATIONS_TABLE_ID;

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

      async function executePushNotification() {
        if (room.authorId === userId) return;

        // find the room author in users table for sending push notifications
        const userData = await tablesDB.getRow({
          databaseId: CRIC_TALK_DATABASE_ID,
          tableId: USERS_TABLE_ID,
          rowId: room.authorId,
        });
        const authorPushTokens = userData.pushTokens;

        let pushMessage = {
          to: token,
          sound: 'default',
          title: 'New message',
          body: `You have a new message in your ${room.teams[0]} vs ${room.teams[1]} room. Tap to check.`,
        };

        // send push notification to all tokens associated with the room author
        authorPushTokens.forEach(async (token) => {
          // send push notification
          try {
            await fetch('https://exp.host/--/api/v2/push/send', {
              method: 'post',
              headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflated',
                'Content-type': 'application/json',
              },
              body: JSON.stringify(pushMessage),
            });
          } catch (error) {
            throw new Error('Error while sending push notifications');
          }
        });

        // store notification in db
        await tablesDB.createRow({
          databaseId: CRIC_TALK_DATABASE_ID,
          tableId: NOTIFICATIONS_TABLE_ID,
          rowId: ID.unique(),
          data: {
            userId,
            title: pushMessage.title,
            content: pushMessage.body,
          },
        });
      }
      executePushNotification();

      await tablesDB.incrementRowColumn({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: USERS_TABLE_ID,
        rowId: userId,
        column: 'messageCount',
        value: 1,
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
