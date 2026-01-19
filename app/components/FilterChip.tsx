import { Pressable, Text } from "react-native";

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

const FilterChip = ({ label, selected, onPress }: FilterChipProps) => {
  return (
    <Pressable
      className={`${
        selected ? "bg-orange-500" : "bg-transparent border border-orange-500"
      } px-4 py-2 rounded-full ${
        label === "all" || label === "live" ? "w-20" : "w-max"
      } items-center transition-all duration-300 ease-in-out active:scale-[0.97] active:opacity-85`}
      onPress={onPress}
    >
      <Text
        className={`${
          selected ? "text-white" : "text-orange-500"
        } font-medium capitalize`}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default FilterChip;
