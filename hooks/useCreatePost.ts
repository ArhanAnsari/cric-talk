import { Post } from "@/interfaces/Post";
import { createPost } from "@/services/posts.service";
import { usePosts } from "@/store/usePosts";

const useCreatePost = () => {
  const addPost = usePosts((s) => s.addPost);

  async function createNewPost({
    content,
    userId,
  }: {
    content: string;
    userId: string;
  }) {
    const newPost: Post = await createPost({ content, authorId: userId });
    addPost(newPost);
    return newPost;
  }

  return { createNewPost };
};

export default useCreatePost;
