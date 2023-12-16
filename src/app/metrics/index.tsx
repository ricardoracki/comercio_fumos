import { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import { useNavigation } from "expo-router";
import PieChart from "react-native-pie-chart";
import colors from "tailwindcss/colors";
import { AntDesign } from "@expo/vector-icons";

import { dataSource } from "../../lib/database";
import { Shopping } from "../../lib/database/entity";
import { convertKgInArroba } from "../../lib/calculator";

export default function Shoppings() {
  const navigation = useNavigation();
  const [state, setState] = useState<{
    loading: boolean;
    shopping: Shopping[];
    fines: Shopping[];
    thicks: Shopping[];
    totalThicks: number;
    totalFines: number;
    total: number;
  }>({
    loading: true,
    shopping: [],
    fines: [],
    thicks: [],
    totalThicks: 0,
    totalFines: 0,
    total: 0,
  });

  const sliceColorChart = [colors.purple[500], colors.amber[500]];
  const widthAndHeightChart = 140;
  // const series = [50, 50];

  async function load() {
    setState({ ...state, loading: true });
    const shopRepo = dataSource.getRepository(Shopping);

    const shopping = await shopRepo.find();
    const fines = shopping.filter((b) => b.classification == "fine");
    const thicks = shopping.filter((b) => b.classification == "thick");

    const totalThicks =
      thicks.length > 0
        ? thicks.map((a) => a.amountInKg).reduce((v, a) => (a += v))
        : 0;

    const totalFines =
      fines.length > 0
        ? fines.map((a) => a.amountInKg).reduce((v, a) => (a += v))
        : 0;
    const total =
      shopping.length > 0
        ? shopping.map((a) => a.amountInKg).reduce((v, a) => (a += v))
        : 0;

    setTimeout(() => {
      setState({
        loading: false,
        fines,
        shopping,
        thicks,
        totalThicks,
        totalFines,
        total,
      });
    }, 600);
  }

  useEffect(() => {
    return navigation.addListener("focus", load);
  }, []);

  return (
    <View className="flex-1 bg-[#e0e0e0] p-3">
      <View className="flex-1 rounded-lg bg-white">
        <Text className="p-3 text-center text-lg font-bold">
          Relatório de compras
        </Text>
        {state.loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
            <Text>Carregando...</Text>
          </View>
        ) : state.shopping.length == 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-bold opacity-50">
              Não há registros de compras
            </Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 12 }}
          >
            {state.totalFines > 0 && state.totalThicks > 0 && (
              <View className="relative mb-3 w-full items-center">
                <PieChart
                  widthAndHeight={widthAndHeightChart}
                  series={[state.totalFines, state.totalThicks]}
                  sliceColor={sliceColorChart}
                  coverRadius={0.45}
                  coverFill={"#FFF"}
                />
                <View className="absolute bottom-0 left-1">
                  <View className="flex-row items-center">
                    <View className={`mr-1 h-3 w-3 rounded bg-purple-500`} />
                    <Text className="text-xs">
                      Fino -{" "}
                      {((state.totalFines * 100) / state.total).toFixed(2)}%
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className={`mr-1 h-3 w-3 rounded bg-amber-500`} />
                    <Text className="text-xs">
                      Grosso -{" "}
                      {((state.totalThicks * 100) / state.total).toFixed(2)}%
                    </Text>
                  </View>
                </View>
              </View>
            )}
            {state.fines.length > 0 && (
              <View className="mb-3 w-full rounded-lg border border-purple-200 bg-purple-200 p-3">
                <Text className="mb-3 items-center text-lg font-bold opacity-70">
                  <AntDesign name="tags" size={18} color="black" />
                  Fumo Fino
                </Text>

                <View className="flex-row items-center gap-x-3">
                  <Text>Número de compras:</Text>
                  <Text className="font-semibold">{`${state.fines.length}`}</Text>
                </View>

                <View className="flex-row items-center gap-x-3">
                  <Text>Peso:</Text>
                  <Text className="font-semibold">
                    {`${state.fines
                      .map((a) => a.amountInKg)
                      .reduce((v, a) => (a += v))}kg`}
                  </Text>
                  <Text className="font-semibold">-</Text>
                  <Text className="font-semibold">
                    {`${state.fines
                      .map((a) => convertKgInArroba(a.amountInKg))
                      .reduce((v, a) => (a += v))}@`}
                  </Text>
                </View>

                <View className="flex-row items-center gap-x-3">
                  <Text>Valor investido:</Text>
                  <Text className="font-semibold">{`R$${state.fines
                    .map((a) => a.value)
                    .reduce((v, a) => (a += v))
                    .toFixed(2)}`}</Text>
                </View>

                <View className="flex-row items-center gap-x-3">
                  <Text>Preço médio (kg):</Text>
                  <Text className="font-semibold">{`R$${(
                    state.fines.map((a) => a.value).reduce((v, a) => (a += v)) /
                    state.fines
                      .map((a) => a.amountInKg)
                      .reduce((v, a) => (a += v))
                  ).toFixed(2)}`}</Text>
                </View>

                <View className="flex-row items-center gap-x-3">
                  <Text>Preço médio (@):</Text>
                  <Text className="font-semibold">{`R$${(
                    state.fines.map((a) => a.value).reduce((v, a) => (a += v)) /
                    state.fines
                      .map((a) => convertKgInArroba(a.amountInKg))
                      .reduce((v, a) => (a += v))
                  ).toFixed(2)}`}</Text>
                </View>
              </View>
            )}

            {state.thicks.length > 0 && (
              <View className="mb-3 w-full rounded-lg border border-amber-200 bg-amber-100 p-3">
                <Text className="mb-3 text-lg font-bold opacity-70">
                  <AntDesign name="tags" size={18} color="black" />
                  Fumo Grosso
                </Text>

                <View className="flex-row items-center gap-x-3">
                  <Text>Número de compras:</Text>
                  <Text className="font-semibold">{`${state.thicks.length}`}</Text>
                </View>

                <View className="flex-row items-center gap-x-3">
                  <Text>Peso:</Text>
                  <Text className="font-semibold">
                    {`${state.thicks
                      .map((a) => a.amountInKg)
                      .reduce((v, a) => (a += v))}kg`}
                  </Text>
                  <Text className="font-semibold">-</Text>
                  <Text className="font-semibold">
                    {`${state.thicks
                      .map((a) => convertKgInArroba(a.amountInKg))
                      .reduce((v, a) => (a += v))}@`}
                  </Text>
                </View>

                <View className="flex-row items-center gap-x-3">
                  <Text>Valor investido:</Text>
                  <Text className="font-semibold">{`R$${state.thicks
                    .map((a) => a.value)
                    .reduce((v, a) => (a += v))
                    .toFixed(2)}`}</Text>
                </View>

                <View className="flex-row items-center gap-x-3">
                  <Text>Preço médio (kg):</Text>
                  <Text className="font-semibold">{`R$${(
                    state.thicks
                      .map((a) => a.value)
                      .reduce((v, a) => (a += v)) /
                    state.thicks
                      .map((a) => a.amountInKg)
                      .reduce((v, a) => (a += v))
                  ).toFixed(2)}`}</Text>
                </View>

                <View className="flex-row items-center gap-x-3">
                  <Text>Preço médio (@):</Text>
                  <Text className="font-semibold">{`R$${(
                    state.thicks
                      .map((a) => a.value)
                      .reduce((v, a) => (a += v)) /
                    state.thicks
                      .map((a) => convertKgInArroba(a.amountInKg))
                      .reduce((v, a) => (a += v))
                  ).toFixed(2)}`}</Text>
                </View>
              </View>
            )}

            <View className="w-full rounded-lg border border-blue-200 bg-blue-100 p-3">
              <Text className="mb-3 text-lg font-bold opacity-70">
                <AntDesign name="tags" size={18} color="black" />
                Total
              </Text>

              <View className="flex-row items-center gap-x-3">
                <Text>Número de compras:</Text>
                <Text className="font-semibold">{`${state.shopping.length}`}</Text>
              </View>

              <View className="flex-row items-center gap-x-3">
                <Text>Peso:</Text>
                <Text className="font-semibold">
                  {`${state.shopping
                    .map((a) => a.amountInKg)
                    .reduce((v, a) => (a += v))}kg`}
                </Text>
                <Text className="font-semibold">-</Text>
                <Text className="font-semibold">
                  {`${state.shopping
                    .map((a) => convertKgInArroba(a.amountInKg))
                    .reduce((v, a) => (a += v))}@`}
                </Text>
              </View>

              <View className="flex-row items-center gap-x-3">
                <Text>Valor investido:</Text>
                <Text className="font-semibold">{`R$${state.shopping
                  .map((a) => a.value)
                  .reduce((v, a) => (a += v))
                  .toFixed(2)}`}</Text>
              </View>

              <View className="flex-row items-center gap-x-3">
                <Text>Preço médio geral (kg):</Text>
                <Text className="font-semibold">{`R$${(
                  state.shopping
                    .map((a) => a.value)
                    .reduce((v, a) => (a += v)) /
                  state.shopping
                    .map((a) => a.amountInKg)
                    .reduce((v, a) => (v += a))
                ).toFixed(2)}`}</Text>
              </View>

              <View className="flex-row items-center gap-x-3">
                <Text>Preço médio geral (@):</Text>
                <Text className="font-semibold">{`R$${(
                  state.shopping
                    .map((a) => a.value)
                    .reduce((v, a) => (a += v)) /
                  state.shopping
                    .map((a) => convertKgInArroba(a.amountInKg))
                    .reduce((v, a) => (v += a))
                ).toFixed(2)}`}</Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}
