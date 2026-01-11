import { Post } from "@/interfaces/Post";
import { createPost } from "@/services/posts.service";
import { usePosts } from "@/store/usePosts";

const useCreatePost = () => {
  const addPost = usePosts((s) => s.addPost);

  async function createNewPost({
    content,
    userId,
    authorName,
  }: {
    content: string;
    userId: string;
    authorName: string;
  }) {
    const newPost: Post = await createPost({
      content,
      authorId: userId,
      authorName,
    });
    addPost(newPost);
    return newPost;
  }

  return { createNewPost };
};

export default useCreatePost;
