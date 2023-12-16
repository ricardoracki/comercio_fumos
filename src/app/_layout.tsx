import "reflect-metadata";
import { Stack, useRouter } from "expo-router";

import { AddButton } from "../components/home/header/add-button";
import { MetricsButton } from "../components/home/header/metrics-button";

export default function Lyout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
          contentStyle: { backgroundColor: "#e0e0e0", padding: 12 },
          animation: "fade_from_bottom",
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "Compras",
            headerRight: AddButton,
            headerLeft: MetricsButton,
          }}
        />
        <Stack.Screen
          name="metrics"
          options={{
            headerTitle: "Relatórios",
            contentStyle: {},
          }}
        />
        <Stack.Screen
          name="new"
          options={{
            headerTitle: "Adicionar registro",
            contentStyle: {},
          }}
        />

        <Stack.Screen
          name="[id]/edit"
          options={{
            headerTitle: "Editar registro",
          }}
        />
      </Stack>
    </>
  );
}
