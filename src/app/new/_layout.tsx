import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function MetricsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
        tabBarStyle: { minHeight: 70 },
        tabBarLabelStyle: { marginBottom: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Compra",
          tabBarIcon: ({ ...props }) => (
            <AntDesign name="download" {...props} />
          ),
        }}
      />
      <Tabs.Screen
        name="sale"
        options={{
          title: "Venda",
          tabBarIcon: ({ ...props }) => <AntDesign name="upload" {...props} />,
        }}
      />
    </Tabs>
  );
}
