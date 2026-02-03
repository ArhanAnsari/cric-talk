import { Post } from "@/schemas/PostSchema";
import { create } from "zustand";

type PostsType = {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (post: Partial<Post>) => void;
  deletePost: (postId: string) => void;
};

export const usePosts = create<PostsType>((set) => ({
  posts: [],
  setPosts: (posts) => {
    const sortedPosts = posts.sort(
      (a, b) =>
        new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime(),
    );

    set({ posts: sortedPosts });
  },
  addPost: (post) => set((s) => ({ posts: [post, ...s.posts] })),
  updatePost: (postData) =>
    set((s) => ({
      posts: s.posts.map((p) =>
        p.$id === postData.$id ? { ...p, ...postData } : p,
      ),
    })),
  deletePost: (postId) =>
    set((s) => ({ posts: s.posts.filter((p) => p.$id !== postId) })),
}));
