import { showToast } from "@/libs/showToast";
import { updatePost } from "@/services/posts.service";
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

    const isLiked = post.likedBy.includes(userId);
    const updatedPostData = {
      likes: isLiked ? post.likes - 1 : post.likes + 1,
      likedBy: isLiked
        ? post.likedBy.filter((id) => id !== userId)
        : [...post.likedBy, userId],
    };

    try {
      updatePostState({
        $id: postId,
        ...updatedPostData,
      });
      const updatedPost = await updatePost(postId, updatedPostData);
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
