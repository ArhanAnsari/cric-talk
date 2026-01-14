import { Client, TablesDB, Users } from "node-appwrite";

export default async ({ req, res }) => {
  try {
    const userId = req.headers["x-appwrite-userId"];

    if (!userId) {
      throw new Error("Unauthorized: User is unauthorized");
    }

    const {
      action,
      roomId,
      teams,
      status,
      startTime,
      endTime,
      matchType,
      isLocked,
    } = req.bodyJson;

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(req.headers["x-appwrite-key"]);

    const tablesDB = new TablesDB(client);
    const users = new Users(client);

    const user = users.get(userId);
    const authorName = user.name || user.email.split("@")[0];
  } catch (error) {
    throw new Error("Unable to process query");
  }
};
