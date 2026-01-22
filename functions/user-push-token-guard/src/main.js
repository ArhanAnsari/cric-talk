import { Client, TablesDB, Users } from 'node-appwrite';

export default async ({ req, res }) => {
  try {
    const userId = req.headers['x-appwrite-user-id'];
    if (!userId) {
      throw new Error(
        'Unauthorized: The user is not authorized to perform this action'
      );
    }

    const { action, pushToken } = req.bodyJson;

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key']);
    const tablesDB = new TablesDB(client);
    const users = new Users(client);

    const CRIC_TALK_DATABASE_ID = process.env.APPWRITE_CRIC_TALK_DATABASE_ID;
    const USERS_TABLE_ID = process.env.APPWRITE_USERS_TABLE_ID;

    const data = await tablesDB.getRow({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: USERS_TABLE_ID,
      rowId: userId,
    });

    async function sendPushToken() {
      let updatedPushTokens;

      if (data.pushTokens.includes(pushToken)) {
        updatedPushTokens = data.pushTokens;
      } else {
        updatedPushTokens = [...data.pushTokens, pushToken];
      }

      return await tablesDB.upsertRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: USERS_TABLE_ID,
        rowId: userId,
        data: {
          username: data.username,
          messageCount: data.messageCount,
          pushTokens: updatedPushTokens,
        },
      });
    }

    async function deletePushToken() {
      const updatedPushTokens = data.pushTokens.filter((t) => t !== pushToken);

      await tablesDB.updateRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: USERS_TABLE_ID,
        rowId: userId,
        data: { pushTokens: updatedPushTokens },
      });

      return { deleted: true, userId };
    }

    let result;

    switch (action) {
      case 'send':
        result = await sendPushToken();
        break;
      case 'delete':
        result = await deletePushToken();
        break;
      default:
        throw new Error('Invalid actione');
    }

    return res.json({ success: true, data: result });
  } catch (error) {
    throw new Error(`Unable to process query: ${error}`);
  }
};
