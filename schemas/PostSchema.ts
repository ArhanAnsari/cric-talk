import { Models } from "react-native-appwrite";
import * as z from "zod";

export const PostSchema = z.object({
  content: z
    .string()
    .min(1, "Post can not be empty.")
    .max(512, "Post can not be more than 512 characters"),
  image: z.array(z.string()).optional(),
});

export type PostInput = z.infer<typeof PostSchema>;

// Post received from db
export interface Post extends Models.Row {
  content: string;
  image?: string[];

  authorId: string;
  authorName: string;

  likes: number;
  likedBy: string[];

  views: number;
  viewedBy: string[];

  commentCount: number;
}
