import { showToast } from "@/libs/showToast";
import {
  createRoomMessage,
  deleteRoomMessage,
  updateRoomMessage,
} from "@/services/roomMessage.service";
import { Alert } from "react-native";

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
    if (messageContent.trim().length > 512) {
      showToast({
        type: "error",
        text1: "Message too long",
        text2: "Please limit your message to 512 characters.",
      });
      return;
    }

    try {
      await createRoomMessage({
        roomId: roomId as string,
        authorId: userId,
        authorName: username,
        content: messageContent,
        isEdited: false,
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
    if (editMessageContent.trim().length > 512) {
      alert("Message too long. Please limit to 512 characters.");
      return;
    }

    try {
      await updateRoomMessage({
        roomMessageId: editRoomMessageId,
        content: editMessageContent,
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
              await deleteRoomMessage(roomMessageId);
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
      ]
    );
  }

  return {
    handleCreateRoomMessage,
    handleUpdateRoomMessage,
    handleDeleteRoomMessage,
  };
};

export default useRoomMessage;
