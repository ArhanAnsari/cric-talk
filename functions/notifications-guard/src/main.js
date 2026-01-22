import { Client, Query, TablesDB } from 'node-appwrite';

export default async ({ req, res }) => {
  try {
    const userId = req.headers['x-appwrite-user-id'];
    if (!userId) {
      throw new Error(
        'Unauthorized: The user is not authorized to perform this action'
      );
    }

    const { action } = req.bodyJson;

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key']);
    const tablesDB = new TablesDB(client);

    const CRIC_TALK_DATABASE_ID = process.env.CRIC_TALK_DATABASE_ID;
    const NOTIFICATIONS_TABLE_ID = process.env.NOTIFICATIONS_TABLE_ID;

    async function fetchNotificationsByUserId() {
      return await tablesDB.listRows({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: NOTIFICATIONS_TABLE_ID,
        queries: [Query.equal('userId', userId), Query.orderDesc('$createdAt')],
      });
    }

    let result;

    switch (action) {
      case 'fetchByUserId':
        result = await fetchNotificationsByUserId();
        break;
      default:
        throw new Error('Invalid action');
    }

    return res.json({ success: true, data: result });
  } catch (error) {
    throw new Error(`Unable to process query: ${error}`);
  }
};
