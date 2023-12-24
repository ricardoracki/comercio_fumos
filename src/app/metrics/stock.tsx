import { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

import { dataSource } from "../../lib/database";
import { Sale, Shopping } from "../../lib/database/entity";
import { convertKgInArroba } from "../../lib/calculator";

export default function Stock() {
  const navigation = useNavigation();

  const [state, setState] = useState<{
    loading: boolean;
    shopping: Shopping[];
    sales: Sale[];
    amountIsStock: number;
  }>({
    loading: true,
    shopping: [],
    sales: [],
    amountIsStock: 0,
  });

  async function load() {
    setState({ ...state, loading: true });
    const shopRepo = dataSource.getRepository(Shopping);
    const saleRepo = dataSource.getRepository(Sale);

    const shopping = await shopRepo.find();
    const sales = await saleRepo.find();

    const amountInShopping =
      shopping.length == 0
        ? 0
        : shopping.map((a) => a.amountInKg).reduce((v, a) => (v += a));

    const amountInSales =
      sales.length == 0
        ? 0
        : sales.map((a) => a.amountInKg).reduce((v, a) => (v += a));
    const amountIsStock = amountInShopping - amountInSales;

    setTimeout(() => {
      setState({
        loading: false,
        shopping,
        sales,
        amountIsStock,
      });
    }, 600);
  }

  function handleDeleteAllData() {
    if (state.shopping.length == 0)
      return ToastAndroid.show("O lote já está vazio", ToastAndroid.LONG);

    Alert.alert(
      "Atenção",
      "Ao encerrar o lote, os dados de compras e vendas serão apagados. \nDeseja continuar?",
      [
        {
          text: "Sim",
          style: "destructive",
          onPress: async () => {
            const shopRepo = dataSource.getRepository(Shopping);
            const saleRepo = dataSource.getRepository(Sale);

            await shopRepo.clear();
            await saleRepo.clear();

            load();
            ToastAndroid.show("Registros excluídos", ToastAndroid.LONG);
          },
        },
        { text: "Cancelar", style: "cancel" },
      ],
    );
  }

  useEffect(() => {
    return navigation.addListener("focus", load);
  }, []);

  return (
    <View className="flex-1 bg-[#e0e0e0] p-3">
      <View className="flex-1 rounded-lg bg-white p-3">
        <Text className="mb-6 text-center text-lg font-bold">
          Controle de estoque
        </Text>
        {state.loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
            <Text>Carregando...</Text>
          </View>
        ) : state.shopping.length == 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-bold opacity-50">Não há estoque</Text>
          </View>
        ) : (
          <View className="rounded-lg border border-red-200 bg-red-100 p-3">
            <Text className="mb-3 items-center text-lg font-bold opacity-70">
              <AntDesign name="tags" size={18} color="black" />
              Disponível em estoque
            </Text>
            <View className="flex-row items-center gap-x-3">
              <Text>Fumo em estoque:</Text>
              <Text className=" font-semibold">
                {state.amountIsStock.toLocaleString("pt-BR", {
                  maximumFractionDigits: 2,
                })}
                kg
              </Text>
              <Text>-</Text>
              <Text className=" font-semibold">
                {convertKgInArroba(state.amountIsStock).toLocaleString(
                  "pt-BR",
                  { maximumFractionDigits: 2 },
                )}
                @
              </Text>
            </View>
          </View>
        )}
      </View>
      <TouchableOpacity
        className="mt-3 w-full items-center justify-center rounded-lg bg-rose-500 py-6"
        onPress={handleDeleteAllData}
      >
        <Text className="font-semibold text-white">Encerrar lote</Text>
      </TouchableOpacity>
    </View>
  );
}
