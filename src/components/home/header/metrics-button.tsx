import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function MetricsButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      className={`h-10 w-10 items-center justify-center rounded-full bg-blue-500`}
      onPress={() => router.push("/metrics")}
    >
      <Ionicons name="ios-bar-chart" color="white" size={18} />
    </TouchableOpacity>
  );
}
