import { Post } from "@/interfaces/Post";
import { showToast } from "@/libs/showToast";
import { executePost } from "@/services/posts.service";
import { usePosts } from "@/store/usePosts";

const useLikePost = () => {
  const posts = usePosts((s) => s.posts);
  const updatePostState = usePosts((s) => s.updatePost);

  async function likePost({ postId }: { postId: string }) {
    const post = posts.find((p) => p.$id === postId);
    if (!post) return;

    try {
      const execution = await executePost({ action: "like", postId });
      const parsed = JSON.parse(execution.responseBody);

      const updatedPost: Post = parsed.data;
      updatePostState(updatedPost);
    } catch (error) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "Could not like. Please try again later.",
      });
      updatePostState(post);
    }
  }

  return { likePost };
};

export default useLikePost;
