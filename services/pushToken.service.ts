import { functions } from "@/libs/appwrite";

const USER_PUSH_TOKEN_GUARD_FUNCTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_USER_PUSH_TOKEN_GUARD_FUNCTION_ID!;

export async function executePushToken({
  action,
  pushToken,
}: {
  action: "send" | "delete";
  pushToken: string;
}) {
  try {
    return await functions.createExecution({
      functionId: USER_PUSH_TOKEN_GUARD_FUNCTION_ID,
      body: JSON.stringify({ action, pushToken }),
      async: false,
    });
  } catch (error) {
    console.log(`Error while executing user push token ${action} action`);
    throw error;
  }
}
