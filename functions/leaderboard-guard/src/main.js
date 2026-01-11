import { Client, Query, TablesDB } from "node-appwrite";

export default async ({ req, res }) => {
  const userId = req.headers["x-appwrite-user-id"];

  if (!userId) throw new Error("Unauthorized: User is not authenticated");

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(req.headers["x-appwrite-key"]);

  const tablesDb = new TablesDB(client);

  const CRIC_TALK_DATABASE_ID = process.env.APPWRITE_CRIC_TALK_DATABASE_ID;
  const USERS_TABLE_ID = process.env.APPWRITE_USERS_TABLE_ID;

  const LIMIT = 10;

  try {
    const data = await tablesDb.listRows({
      databaseId: CRIC_TALK_DATABASE_ID,
      tableId: USERS_TABLE_ID,
      queries: [Query.limit(LIMIT)],
    });

    return res.json(data);
  } catch (error) {
    throw new Error(`Error occured: ${error}`);
  }
};
