import { usePosts } from "@/store/usePosts";
import { executePost } from "@/services/posts.service";

const useViewPost = () => {
  const posts = usePosts((s) => s.posts);
  const updatePostState = usePosts((s) => s.updatePost);

  async function incrementView({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }) {
    const post = posts.find((p) => p.$id === postId);
    if (!post) return;

    if (post.viewedBy.includes(userId)) return;

    const optimisticPost = {
      ...post,
      views: post.views + 1,
      viewedBy: [...post.viewedBy, userId],
    };

    updatePostState(optimisticPost);

    try {
      const execution = await executePost({
        action: "view",
        postId: postId,
      });
      const parsed = JSON.parse(execution.responseBody);

      const updatedPost = parsed.data;
      updatePostState(updatedPost);
    } catch (error) {
      updatePostState(post);
    }
  }

  return { incrementView };
};

export default useViewPost;
