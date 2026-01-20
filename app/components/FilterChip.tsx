import { Pressable, Text } from "react-native";

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  width?: string;
};

const FilterChip = ({ label, selected, onPress, width }: FilterChipProps) => {
  return (
    <Pressable
      className={`${
        selected ? "bg-orange-500" : "bg-transparent border border-orange-500"
      } px-4 py-2 rounded-full w-${
        width ? width : "auto"
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
