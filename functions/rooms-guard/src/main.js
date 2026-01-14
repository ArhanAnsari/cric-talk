import { Client, TablesDB, Users } from "node-appwrite";
import { ID } from "react-native-appwrite";

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

    const CRIC_TALK_DATABASE_ID = process.env.APPWRITE_CRIC_TALK_DATABASE_ID;
    const ROOMS_TABLE_ID = process.env.APPWRITE_ROOMS_TABLE_ID;

    const user = users.get(userId);
    const authorName = user.name || user.email.split("@")[0];

    async function createRoom() {
      const result = await tablesDB.createRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: ROOMS_TABLE_ID,
        rowId: ID.unique(),
        data: {
          teams,
          status,
          authorId: userId,
          authorName,
          startTime,
          endTime,
          matchType,
          isLocked,
        },
      });
      return res.json(result);
    }

    async function deleteRoom() {
      const result = await tablesDB.deleteRow({
        databaseId: CRIC_TALK_DATABASE_ID,
        tableId: ROOMS_TABLE_ID,
        rowId: roomId,
      });
      return res.json(result);
    }

    switch (action) {
      case "create":
        await createRoom();
        break;
      case "delete":
        await deleteRoom();
        break;
      default: 
        throw new Error('Invalid action')
    }
  } catch (error) {
    throw new Error("Unable to process query");
  }
};
