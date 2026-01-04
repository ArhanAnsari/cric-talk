import { Models } from "react-native-appwrite";

export interface Room extends Models.Row {
  teams: string[];
  status: "upcoming" | "live" | "finished";

  startTime: string;
  endTime?: string;

  matchType: "ODI" | "TEST" | "T20";
}
