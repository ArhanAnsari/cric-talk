import { Client, TablesDB, Users } from "node-appwrite";

export default async ({ req, res }) => {
  const { roomId, content } = req.body;

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRIT_API_KEY!);

  const tablesDB = new TablesDB(client);
  const users = new Users(client);
};
