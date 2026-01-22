import { functions } from "@/libs/appwrite";

const NOTIFICATIONS_GUARD_FUNCTION_ID =
  process.env.EXPO_PUBLIC_NOTIFICATIONS_GUARD_FUNCTION_ID!;

export async function executeNotification({
  action,
}: {
  action: "fetchByUserId";
}) {
  try {
    return functions.createExecution({
      functionId: NOTIFICATIONS_GUARD_FUNCTION_ID,
      body: JSON.stringify({ action }),
      async: false,
    });
  } catch (error) {
    console.log(`Error while executing notification ${action} action`);
    throw error;
  }
}
