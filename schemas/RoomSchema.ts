import { Models } from "react-native-appwrite";
import * as z from "zod";

export const RoomSchema = z.object({
  teams: z.array(
    z
      .string()
      .min(3, "Team name must be at least 3 characters.")
      .max(8, "Team name can not be more than 8 characters"),
  ),
  status: z.string().min(1, "Invalid room status."),

  startTime: z.string().min(1, "Invalid room start time."),
  endTime: z.string().min(1, "Invalid room end time.").optional(),

  matchType: z
    .enum(["ODI", "TEST", "T20"], "Match type must be ODI, TEST or T20.")
    .transform((t) => t.toLowerCase()),

  isLocked: z.boolean("Invalid chat lock option."),
});

export type RoomInput = z.infer<typeof RoomSchema>;

// Room received from db
export interface Room extends Models.Row {
  teams: string[];
  status: "upcoming" | "live" | "finished";

  authorId: string;
  authorName: string;

  startTime: string;
  endTime?: string;

  matchType: "ODI" | "TEST" | "T20";

  isLocked: boolean;
}
