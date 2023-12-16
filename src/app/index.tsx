import { useEffect, useState } from "react";

import {
  View,
  Text,
  FlatList,
  TouchableNativeFeedback,
  Alert,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";

import { convertKgInArroba } from "../lib/calculator";
import { dataSource } from "../lib/database";
import { Shopping } from "../lib/database/entity";

export default function Home() {
  const [data, setData] = useState<Shopping[]>([]);

  const navigation = useNavigation();
  const router = useRouter();

  async function load() {
    const shopRepo = dataSource.getRepository(Shopping);
    const _data = await shopRepo.find();
    setData(_data);
  }

  async function alert(item: any) {
    Alert.alert(
      `R$${item.value}`,
      `${item.customer} - ${item.createdAt.toLocaleDateString("pt-br")}`,
      [
        {
          style: "destructive",
          text: "Excluir",
          onPress: () => handleDelete(item),
        },
        {
          style: "default",
          text: "Editar",
          onPress: () => handleEdit(item.id),
        },
        { style: "cancel", text: "Cancelar" },
      ],
    );
  }

  async function handleDelete(item: any) {
    Alert.alert("Atenção", "Deseja excluir o registro?", [
      {
        text: "Sim",
        style: "destructive",
        onPress: async () => {
          await dataSource.manager.remove(item);
          load();
          ToastAndroid.show("Registro excluído", ToastAndroid.LONG);
        },
      },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  function handleEdit(id: number) {
    router.push(`/${id}/edit`);
  }

  useEffect(() => {
    return navigation.addListener("focus", async () => {
      if (!dataSource.isInitialized) await dataSource.initialize();
      load();
    });
  }, []);

  if (data.length == 0)
    return (
      <View className="flex-1 items-center justify-center rounded-lg bg-white pt-3">
        <Text className="text-lg font-bold opacity-50">
          Não há registros armazenados
        </Text>
      </View>
    );

  return (
    <View className="flex-1">
      <FlatList
        data={data}
        keyExtractor={(i) => `${i.id}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          borderRadius: 12,
          backgroundColor: "white",
          padding: 12,
          paddingBottom: 50,
        }}
        renderItem={({ item }) => (
          <TouchableNativeFeedback onPress={() => alert(item)}>
            <View className="rounded border-b border-gray-300 p-3">
              <Text className="text-lg font-bold">
                R${item.value.toFixed(2)} - Fumo{" "}
                {item.classification == "fine" ? "fino" : "grosso"}
              </Text>
              <Text className="text-base font-semibold">
                {item.amountInKg}kg - {convertKgInArroba(item.amountInKg)}@
              </Text>

              <Text className="">
                <Ionicons name="ios-calendar-sharp" size={12} />
                {item.createdAt.toLocaleDateString("pt-br")}
                {"  "}
                {item.customer}
              </Text>
            </View>
          </TouchableNativeFeedback>
        )}
      />
    </View>
  );
}
