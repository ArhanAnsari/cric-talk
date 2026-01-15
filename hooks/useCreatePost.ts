import { Post } from "@/interfaces/Post";
import { executePost } from "@/services/posts.service";
import { usePosts } from "@/store/usePosts";

const useCreatePost = () => {
  const addPost = usePosts((s) => s.addPost);

  async function createNewPost({ content }: { content: string }) {
    const execution = await executePost({ action: "create", content });
    const parsed = JSON.parse(execution.responseBody);

    const newPost: Post = parsed.data;

    addPost(newPost);
    return newPost;
  }

  return { createNewPost };
};

export default useCreatePost;
