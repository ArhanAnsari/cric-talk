import { CommentType } from "@/interfaces/Post";
import { create } from "zustand";

type CommentsStateType = {
  commentList: CommentType[];
  setComments: (commentList: CommentType[]) => void;
  addComment: (comment: CommentType) => void;
  updateComment: (
    comment: Partial<CommentType> & Pick<CommentType, "$id">,
  ) => void;
  deleteComment: (commentId: string) => void;
};

export const useComments = create<CommentsStateType>((set) => ({
  commentList: [],
  setComments: (commentList) => set({ commentList: commentList }),
  addComment: (comment) =>
    set((s) => ({ commentList: [comment, ...s.commentList] })),
  updateComment: (comment) =>
    set((s) => ({
      commentList: s.commentList.map((c) =>
        c.$id === comment.$id ? { ...c, comment } : c,
      ),
    })),
  deleteComment: (commentId) =>
    set((s) => ({
      commentList: s.commentList.filter((comment) => comment.$id !== commentId),
    })),
}));
