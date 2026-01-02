const API_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_API_ENDPOINT!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;

import { Account, Client } from "react-native-appwrite";

const client = new Client().setEndpoint(API_ENDPOINT).setProject(PROJECT_ID);

export const account = new Account(client);
