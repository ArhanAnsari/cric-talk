import { Models } from "react-native-appwrite";
import * as z from "zod";

export const BaseCommentSchema = z.object({
  postId: z.string().min(1, "Invalid post"),
  content: z
    .string()
    .trim()
    .min(1, "Comment can not be empty")
    .max(500, "Comment can not be more than 500 characters"),
});

export const CreateCommentSchema = BaseCommentSchema;
export const UpdateCommentSchema = BaseCommentSchema.extend({
  postId: BaseCommentSchema.shape.postId.optional(),
});

export const CommentSchema = BaseCommentSchema.extend({
  authorId: z.string(),
  isEdited: z.boolean(),
});

export type CommentType = Models.Row & z.infer<typeof CommentSchema>;
