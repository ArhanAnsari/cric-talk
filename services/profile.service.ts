import { account } from "@/libs/appwrite";

export async function updateUsername(username: string) {
  try {
    return await account.updateName({ name: username });
  } catch (error) {
    console.log(`Error while updating username ${error}`);
    throw error;
  }
}

export async function updateEmail(email: string, password: string) {
  try {
    return await account.updateEmail({ email, password });
  } catch (error) {
    console.log(`Error while updating email ${error}`);
    throw error;
  }
}
