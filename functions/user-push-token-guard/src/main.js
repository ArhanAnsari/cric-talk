import { Client, TablesDB, Users } from 'node-appwrite';

export default async ({ req, res }) => {
  const userId = req.headers['x-appwrite-user-id'];
  if (!userId) {
    throw new Error(
      'Unauthorized: The user is not authrozied to perform this action'
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
};
