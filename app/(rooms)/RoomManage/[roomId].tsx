import { useRooms } from "@/store/useRooms";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";

const RoomManage = () => {
  const { roomId } = useLocalSearchParams();

  const rooms = useRooms((s) => s.rooms);
  const room = rooms.find((r) => r.$id === roomId);

  const {
    teams: oldTeams = [],
    startTime: oldStartTime = "",
    endTime: oldEndTime = "",
    matchType: oldMatchType = "ODI",
    isLocked: oldIsLocked = false,
  } = room || {};

  const [team1, setTeam1] = useState<string>(oldTeams[0]);
  const [team2, setTeam2] = useState<string>(oldTeams[1]);
  const [startTime, setStartTime] = useState<Date>(new Date(oldStartTime));
  const [endTime, setEndTime] = useState<Date>(new Date(oldEndTime));
  const [matchType, setMatchType] = useState<"ODI" | "TEST" | "T20">(
    oldMatchType,
  );
  const [isLocked, setIsLocked] = useState<boolean>(oldIsLocked);

  const [isStartTimePickerVisible, setIsStartTimePickerVisible] =
    useState<boolean>(false);
  const [isEndTimePickerVisible, setIsEndTimePickerVisible] =
    useState<boolean>(false);

  const matchTypeDropdown = [
    { label: "ODI", value: "ODI" },
    { label: "TEST", value: "TEST" },
    { label: "T20", value: "T20" },
  ];

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-30 bg-orange-500">
        <SafeAreaView>
          {/* HEADER */}
          <View className="flex-row items-center px-6 py-4">
            <Pressable
              className="w-10 h-10 bg-orange-600 items-center justify-center rounded-full transition-all active:scale-[0.98] active:opacity-85"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>

            <View className="absolute left-0 right-0 items-center">
              <Text className="text-lg text-white font-semibold">
                Manage Room
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* CONTENT */}
      <View className="px-6 py-4">
        {/* INPUTS */}
        <View className="gap-4">
          {/* TEAMS NAME INPUT */}
          <View className="gap-2">
            <Text className="text-lg font-medium text-slate-900">
              Change teams name
            </Text>

            <View className="flex-row gap-2 items-center">
              <TextInput
                value={team1}
                onChangeText={setTeam1}
                placeholder="Team 1"
                className="border border-slate-300 rounded-lg pl-4 h-12 flex-1"
              />

              <Text className="text-slate-500 text-sm">vs</Text>

              <TextInput
                value={team2}
                onChangeText={setTeam2}
                placeholder="Text 2"
                className="border border-slate-300 rounded-lg pl-4 h-12 flex-1"
              />
            </View>

            <Pressable className="w-full bg-orange-500 items-center justify-center px-6 py-2 rounded-lg h-12">
              <Text className=" text-white font-medium">Save</Text>
            </Pressable>
          </View>

          {/* START TIME AND END TIME INPUT */}
          <View className="gap-2">
            {/* START TIME INPUT */}
            <View className="gap-2">
              <Text className="text-slate-900 text-lg font-medium">
                Change start time
              </Text>

              <Pressable
                className="w-full h-12 border border-slate-300 rounded-lg pl-4 justify-center"
                onPress={() => setIsStartTimePickerVisible(true)}
              >
                <Text>
                  {startTime.toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </Text>
              </Pressable>

              <DateTimePicker
                isVisible={isStartTimePickerVisible}
                mode="datetime"
                onConfirm={(date) => {
                  setStartTime(date);
                  setIsStartTimePickerVisible(false);
                }}
                onCancel={() => setIsStartTimePickerVisible(false)}
                minimumDate={new Date()}
              />
            </View>

            {/* END TIME INPUT */}
            <View className="gap-2">
              <Text className="text-slate-900 text-lg font-medium">
                End time
              </Text>

              <Pressable className="w-full h-12 border border-slate-300 pl-4 justify-center rounded-lg">
                <Text>
                  {endTime.toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </Text>
              </Pressable>

              <DateTimePicker
                isVisible={isEndTimePickerVisible}
                mode="datetime"
                onConfirm={(date) => {
                  setEndTime(date);
                  setIsEndTimePickerVisible(false);
                }}
                onCancel={() => setIsEndTimePickerVisible(false)}
                minimumDate={startTime}
              />
            </View>

            <Pressable className="w-full h-12 bg-orange-500 items-center justify-center rounded-lg px-6 py-3">
              <Text className="text-white font-medium">Save</Text>
            </Pressable>
          </View>

          {/* MATCH TYPE INPUT */}
          <View className="gap-2">
            <Text className="text-lg text-slate-900 font-medium">
              Change match type
            </Text>

            <Dropdown
              data={matchTypeDropdown}
              labelField="label"
              valueField="value"
              onChange={(item) => setMatchType(item.value)}
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              placeholderStyle={styles.dropdownPlaceholderText}
              selectedTextStyle={styles.dropdownSelectedText}
            />

            <Pressable className="w-full h-12 bg-orange-500 rounded-lg items-center justify-center px-6 py-3">
              <Text className="text-white font-medium">Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderColor: "#d1d5dc",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
  },
  dropdownContainer: {
    marginTop: 4,
    borderRadius: 8,
  },
  dropdownPlaceholderText: {
    color: "#6a7282",
    fontSize: 16,
  },
  dropdownSelectedText: {
    color: "#0f172b",
    fontSize: 16,
  },
});

export default RoomManage;
