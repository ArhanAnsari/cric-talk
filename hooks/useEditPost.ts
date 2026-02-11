import { Post, PostSchema } from "@/schemas/PostSchema";
import { showToast } from "@/libs/showToast";
import { executePost } from "@/services/posts.service";
import { usePosts } from "@/store/usePosts";

type handleEditPostProps = {
  content: string;
  initialContent: string;
  onClose: () => void;
};

const useEditPost = ({ postId }: { postId: string }) => {
  const updatePostState = usePosts((s) => s.updatePost);

  async function handleEditPost({
    content,
    initialContent,
    onClose,
  }: handleEditPostProps) {
    const trimmedContent: string = content.trim();

    const result = PostSchema.safeParse({ content: trimmedContent });

    if (!result.success) {
      showToast({
        type: "error",
        text1: "Error",
        text2: result.error.issues[0].message,
      });
      return;
    }

    if (initialContent.trim() === trimmedContent) {
      onClose();

      showToast({
        type: "info",
        text1: "Nothing to edit",
        text2: "You haven't made any changes yet.",
      });

      return;
    }

    try {
      const execution = await executePost({
        action: "update",
        postId,
        content: trimmedContent,
      });
      const parsed = JSON.parse(execution.responseBody);

      const post: Post = parsed.data;
      updatePostState(post);
      onClose();
      showToast({ type: "success", text1: "Post edited successfully" });
    } catch (error) {
      onClose();
      showToast({
        type: "error",
        text1: "Failed editing the post",
        text2: "Please try again later.",
      });
    }
  }

  return { handleEditPost };
};

export default useEditPost;
