import { Models } from "react-native-appwrite";
import * as z from "zod";

export const BaseRoomMessageSchema = z.object({
  roomId: z.string().min(1, "Invalid room."),
  content: z
    .string()
    .min(1, "Message can not be empty.")
    .max(500, "Message can not be more than 500 characters."),
});

export const CreateRoomMessageSchema = BaseRoomMessageSchema;
export const UpdateRoomMessageSchema = BaseRoomMessageSchema.extend({
  roomId: BaseRoomMessageSchema.shape.roomId.optional(),
  roomMessageId: z.string().min(1, "Invalid message."),
});

export type CreateRoomMessageInput = z.infer<typeof CreateRoomMessageSchema>;
export type UpdateRoomMessageInput = z.infer<typeof UpdateRoomMessageSchema>;

export interface RoomMessage extends Models.Row {
  roomId: string;

  authorId: string;
  authorName: string;

  content: string;

  isEdited: boolean;
}
