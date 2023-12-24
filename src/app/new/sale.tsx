import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Sale } from "../../lib/database/entity";

import { Form } from "../../components/form";
import { convertArrobaInKg } from "../../lib/calculator";
import { dataSource } from "../../lib/database";

export default function NewSale() {
  const [value, setValue] = useState("");
  const [maskedValue, setMaskedValue] = useState("");
  const [weight, setWeight] = useState("");
  const [weightType, setWeightType] = useState("kg");

  const router = useRouter();

  async function handleSave() {
    if (!value.trim() || !weight.trim())
      return Alert.alert("Atenção", "Preencha todos os campos");

    const data = new Sale();
    data.amountInKg =
      weightType == "@" ? convertArrobaInKg(Number(weight)) : Number(weight);
    data.value = value.endsWith("00") ? Number(value) / 100 : Number(value);
    const { id } = await dataSource.manager.save(data);
    Alert.alert("Sucesso", "Venda registrada", [
      {
        text: "Ok",
        onPress: () => router.push("../../"),
      },
    ]);
  }

  return (
    <View className="flex-1 bg-[#e0e0e0] px-3 pt-3">
      <Form
        fields={[
          {
            type: "masked",
            //@ts-ignore
            onChangeText: (masked, unMasked) => {
              setMaskedValue(masked);
              setValue(unMasked);
            },
            value: maskedValue,
            label: "Valor",
            placeholder: "R$0.00",
            keyboardType: "decimal-pad",
          },
          {
            onChangeText: setWeight,
            value: weight,
            label: "Peso",
            placeholder: `0${weightType}`,
            keyboardType: "decimal-pad",
          },
          {
            onChangeText: setWeightType,
            choices: ["kg", "@"],
            value: weightType,
            type: "radio",
          },
        ]}
      />
      <TouchableOpacity
        className="my-6 w-full items-center justify-center rounded-lg bg-green-500 py-6"
        onPress={handleSave}
      >
        <Text className="text-base font-bold text-white">Salvar venda</Text>
      </TouchableOpacity>
    </View>
  );
}
