import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function AddButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      className={`h-10 w-10 items-center justify-center rounded-full bg-amber-500`}
      onPress={() => router.push("/new")}
    >
      <Ionicons name="add" color="white" size={18} />
    </TouchableOpacity>
  );
}
