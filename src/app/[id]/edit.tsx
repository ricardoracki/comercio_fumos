import { useState, useEffect } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import colors from "tailwindcss/colors";
import { Shopping } from "../../lib/database/entity";
import { convertArrobaInKg } from "../../lib/calculator";
import { dataSource } from "../../lib/database";
import { useGlobalSearchParams, useRouter } from "expo-router";

export default function New() {
  const { id } = useGlobalSearchParams();
  const [customer, setCustomer] = useState("");
  const [value, setValue] = useState("");
  const [weight, setWeight] = useState("");
  const [weigthType, setWeightType] = useState<"kg" | "@">("kg");
  const router = useRouter();

  async function handleSave() {
    if (!customer.trim() || !value.trim() || !weight.trim())
      return Alert.alert("Atenção", "Preencha todos os campos");

    const data = new Shopping();
    data.amountInKg =
      weigthType == "@" ? convertArrobaInKg(Number(weight)) : Number(weight);
    data.customer = customer;
    data.value = Number(value.replace(",", "."));

    const {} = await dataSource
      .createQueryBuilder()
      .update(Shopping)
      .set({
        value: data.value,
        customer: data.customer,
        amountInKg: data.amountInKg,
      })
      .where("id = :id", { id })
      .execute();
    Alert.alert("Sucesso", "Registro atualizado", [
      { text: "ok", onPress: router.back },
    ]);
  }

  useEffect(() => {
    loadData(id as string);
  }, [id]);

  async function loadData(id: string) {
    const shopRepo = dataSource.getRepository(Shopping);
    const _data = await shopRepo.findOne({ where: { id: Number(id) } });
    setCustomer(_data?.customer as string);
    setValue(`${_data?.value}`);
    setWeight(`${_data?.amountInKg}`);
  }

  return (
    <View className="flex-1 bg-white p-3">
      <Text className="mb-1 text-sm font-semibold">Cliente:</Text>
      <TextInput
        className="rounded border border-gray-300 p-6"
        placeholderTextColor={colors.gray[500]}
        placeholder="Ex.: Fulano"
        value={customer}
        onChangeText={setCustomer}
      />
      <Text className="mb-1 text-sm font-semibold">Valor:</Text>
      <TextInput
        className="rounded border border-gray-300 p-6"
        placeholderTextColor={colors.gray[500]}
        placeholder="R$00.00"
        keyboardType="decimal-pad"
        value={value}
        onChangeText={setValue}
      />
      <Text className="mb-1 text-sm font-semibold">Peso:</Text>
      <TextInput
        className="rounded border border-gray-300 p-6"
        placeholderTextColor={colors.gray[500]}
        placeholder={` ${weigthType}`}
        keyboardType="decimal-pad"
        value={weight}
        onChangeText={setWeight}
      />
      <View className="flex-row gap-3 pt-3">
        <TouchableOpacity
          className={`h-12 w-12 items-center justify-center rounded border border-gray-300 ${
            weigthType == "@" && "bg-slate-300"
          }`}
          onPress={() => setWeightType("@")}
        >
          <Text className="text-base font-bold">@</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`h-12 w-12 items-center justify-center rounded border border-gray-300 ${
            weigthType != "@" && "bg-slate-300"
          }`}
          onPress={() => setWeightType("kg")}
        >
          <Text className="text-base font-bold">kg</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        className="mt-3 w-full items-center justify-center rounded-lg bg-rose-500 py-6"
        onPress={handleSave}
      >
        <Text className="text-base font-bold text-white">Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}
