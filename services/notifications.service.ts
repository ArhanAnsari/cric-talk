import { functions } from "@/libs/appwrite";

const NOTIFICATIONS_GUARD_FUNCTION_ID =
  process.env.EXPO_PUBLIC_NOTIFICATIONS_GUARD_FUNCTION_ID!;

export async function executeNotification({
  action,
}: {
  action: "fetchByUserId";
}) {
  try {
    const execution = await functions.createExecution({
      functionId: NOTIFICATIONS_GUARD_FUNCTION_ID,
      body: JSON.stringify({ action }),
      async: false,
    });

    if (execution.status === "failed") {
      throw new Error("Notification execution failed");
    }

    return execution;
  } catch (error) {
    console.log(`Error while executing notification ${action} action`);
    throw error;
  }
}
