import { showToast } from "@/libs/showToast";
import { UpdateCommentSchema } from "@/schemas/CommentSchema";
import {
  CreateRoomMessageSchema,
  UpdateRoomMessageSchema,
} from "@/schemas/RoomMessageSchema";
import { executeRoomMessage } from "@/services/roomMessage.service";
import { Alert } from "react-native";
import { safeParse } from "zod";

const useRoomMessage = (roomId: string) => {
  async function handleCreateRoomMessage({
    messageContent,
    userId,
    username,
    setMessageContent,
  }: {
    messageContent: string;
    userId: string;
    username: string;
    setMessageContent: (content: string) => void;
  }) {
    try {
      const result = CreateRoomMessageSchema.safeParse({
        roomId,
        content: messageContent,
      });

      if (!result.success) {
        showToast({
          type: "error",
          text1: "Error sending message",
          text2: result.error.issues[0].message,
        });
        return;
      }

      await executeRoomMessage({
        action: "create",
        roomId,
        content: messageContent,
      });

      setMessageContent("");
    } catch (error) {
      showToast({
        type: "error",
        text1: "Error sending message",
        text2: "Please try again later.",
      });
    }
  }

  async function handleUpdateRoomMessage({
    editMessageContent,
    editRoomMessageId,
    setIsEditModalVisible,
    setEditMessageContent,
    setEditRoomMessageId,
  }: {
    editMessageContent: string;
    editRoomMessageId: string;
    setIsEditModalVisible: (visible: boolean) => void;
    setEditMessageContent: (content: string) => void;
    setEditRoomMessageId: (id: string) => void;
  }) {
    try {
      const result = UpdateRoomMessageSchema.safeParse({
        roomId,
        roomMessageId: editRoomMessageId,
        content: editMessageContent,
      });

      if (!result.success) {
        showToast({
          type: "error",
          text1: "Error updating message",
          text2: result.error.issues[0].message,
        });
      }

      await executeRoomMessage({
        action: "update",
        roomId,
        content: editMessageContent,
        roomMessageId: editRoomMessageId,
      });
      setIsEditModalVisible(false);
      setEditMessageContent("");
      setEditRoomMessageId("");

      showToast({
        type: "success",
        text1: "Message updated successfully",
      });
    } catch (error) {
      showToast({
        type: "error",
        text1: "Error updating message",
        text2: "Please try again later.",
      });
    }
  }

  async function handleDeleteRoomMessage(roomMessageId: string) {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await executeRoomMessage({
                action: "delete",
                roomId,
                roomMessageId,
              });
              showToast({
                type: "success",
                text1: "Message deleted successfully",
              });
            } catch (error) {
              showToast({
                type: "error",
                text1: "Error deleting message",
                text2: "Please try again later.",
              });
            }
          },
        },
      ],
    );
  }

  return {
    handleCreateRoomMessage,
    handleUpdateRoomMessage,
    handleDeleteRoomMessage,
  };
};

export default useRoomMessage;
