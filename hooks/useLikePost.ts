import { Post } from "@/interfaces/Post";
import { showToast } from "@/libs/showToast";
import { executePost } from "@/services/posts.service";
import { usePosts } from "@/store/usePosts";

const useLikePost = () => {
  const posts = usePosts((s) => s.posts);
  const updatePostState = usePosts((s) => s.updatePost);

  async function likePost({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }) {
    const post = posts.find((p) => p.$id === postId);
    if (!post) return;

    const hasLiked: boolean = post.likedBy.includes(userId);

    const optimisticPost: Post = {
      ...post,
      likes: hasLiked ? post.likes - 1 : post.likes + 1,
      likedBy: hasLiked
        ? post.likedBy.filter((id) => id !== userId)
        : [...post.likedBy, userId],
    };

    updatePostState(optimisticPost);

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
