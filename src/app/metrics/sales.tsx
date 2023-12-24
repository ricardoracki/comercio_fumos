import { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import { dataSource } from "../../lib/database";
import { Sale } from "../../lib/database/entity";
import { convertKgInArroba } from "../../lib/calculator";
import { useNavigation } from "expo-router";

export default function Sales() {
  const navigation = useNavigation();

  const [state, setState] = useState<{
    loading: boolean;
    sales: Sale[];
  }>({
    loading: true,
    sales: [],
  });

  async function load() {
    setState({ ...state, loading: true });

    const saleRepo = dataSource.getRepository(Sale);
    const sales = await saleRepo.find();

    setTimeout(() => {
      setState({
        loading: false,
        sales,
      });
    }, 600);
  }

  async function handleDeleteSale(item: Sale) {
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

  useEffect(() => {
    return navigation.addListener("focus", load);
  }, []);

  return (
    <View className="flex-1 bg-[#e0e0e0] p-3">
      <View className="flex-1 rounded-lg bg-white">
        <Text className="p-3 text-center text-lg font-bold">
          Relatório de vendas
        </Text>
        {state.loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
            <Text>Carregando...</Text>
          </View>
        ) : state.sales.length == 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-bold opacity-50">
              Não há registros de vendas
            </Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 12 }}
          >
            {state.sales.map((s, i) => (
              <View
                key={`${s.id} ${i}`}
                className="mb-1 rounded-lg border border-green-200 bg-green-100 p-3"
              >
                <TouchableOpacity
                  className="absolute right-3 top-3 z-10 rounded-lg bg-red-500 p-3"
                  onPress={() => handleDeleteSale(s)}
                >
                  <Ionicons name="trash" color="white" size={18} />
                </TouchableOpacity>
                <Text className="mb-3 text-lg font-bold opacity-70">
                  <AntDesign name="tags" size={18} color="black" />
                  Venda
                </Text>
                <View className="flex-row items-center gap-x-3">
                  <Text>Data:</Text>
                  <Text className=" font-semibold">
                    {s.createdAt.toLocaleDateString("pt-br")}
                  </Text>
                </View>

                <View className="flex-row items-center gap-x-3">
                  <Text>Peso:</Text>
                  <Text className=" font-semibold">{s.amountInKg}kg</Text>
                </View>

                <View className="flex-row items-center gap-x-3">
                  <Text>Valor:</Text>
                  <Text className=" font-semibold">
                    {s.value.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                </View>

                <View className="flex-row items-center gap-x-3">
                  <Text>Valor médio (kg):</Text>
                  <Text className=" font-semibold">
                    {(s.value / s.amountInKg).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                </View>

                <View className="flex-row items-center gap-x-3">
                  <Text>Valor médio (@):</Text>
                  <Text className=" font-semibold">
                    {(s.value / convertKgInArroba(s.amountInKg)).toLocaleString(
                      "pt-br",
                      {
                        style: "currency",
                        currency: "BRL",
                      },
                    )}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
