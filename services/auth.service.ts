import { account } from "@/libs/appwrite";
import { ID } from "react-native-appwrite";

export async function createUserWithEmailAndPassword(
  email: string,
  password: string,
) {
  try {
    await account.create({
      userId: ID.unique(),
      email,
      password,
    });
  } catch (error) {
    console.log(`Error occurred while creating the user ${error}`);
    throw error;
  }
}

export async function loginUserWithEmailAndPassword(
  email: string,
  password: string,
) {
  try {
    await account.createEmailPasswordSession({ email, password });
  } catch (error) {
    console.log(`Error occurred while logging in the user ${error}`);
    throw error;
  }
}
