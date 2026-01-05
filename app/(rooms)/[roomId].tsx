import { Room } from "@/interfaces/Room";
import { fetchRooms } from "@/services/rooms.service";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

const RoomDiscussion = () => {
  const { roomId } = useLocalSearchParams();

  const [room, setRoom] = React.useState<Room | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadRoomDetails() {
      if (!mounted) return;

      const data = await fetchRooms();
      const roomDetails = data.rows.find((room) => room.$id === roomId);
      setRoom(roomDetails || null);
    }
    loadRoomDetails();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View>
      <Text>RoomDetails</Text>
    </View>
  );
};

export default RoomDiscussion;
