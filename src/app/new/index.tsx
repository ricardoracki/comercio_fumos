import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

import { Form } from "../../components/form";
import { convertArrobaInKg } from "../../lib/calculator";
import { dataSource } from "../../lib/database";
import { Shopping } from "../../lib/database/entity";

export default function Test() {
  const [customer, setCustomer] = useState("");
  const [value, setValue] = useState("");
  const [maskedValue, setMaskedValue] = useState("");
  const [weight, setWeight] = useState("");
  const [weigthType, setWeightType] = useState("kg");
  const [classification, setClassification] = useState("thick");

  const router = useRouter();

  async function handleSave() {
    if (!customer.trim() || !value.trim() || !weight.trim())
      return Alert.alert("Atenção", "Preencha todos os campos");

    const data = new Shopping();

    const _weight = Number(weight.replace(",", "."));
    const _value = value.endsWith("00") ? Number(value) / 100 : Number(value);

    data.amountInKg = weigthType == "@" ? convertArrobaInKg(_weight) : _weight;
    data.customer = customer;
    data.value = _value;
    data.classification = classification;
    data.saveFormat = weigthType;

    const { id } = await dataSource.manager.save(data);
    Alert.alert("Sucesso", "Compra registrada", [
      { text: "ok", onPress: router.back },
    ]);
  }

  return (
    <View className="flex-1 bg-[#e0e0e0] px-3 pt-3">
      <Form
        fields={[
          {
            onChangeText: setCustomer,
            value: customer,
            label: "Cliente",
            placeholder: "Ex: Fulano",
          },
          {
            //@ts-ignore
            onChangeText: (masked, unmasked) => {
              setMaskedValue(masked);
              setValue(unmasked);
            },
            value: maskedValue,
            label: "Valor",
            placeholder: "R$0.00",
            keyboardType: "numeric",
            type: "masked",
          },
          {
            onChangeText: setWeight,
            value: weight,
            label: "Peso",
            placeholder: `0${weigthType}`,
            keyboardType: "decimal-pad",
          },
          {
            onChangeText: setWeightType,
            choices: ["kg", "@"],
            value: weigthType,
            type: "radio",
          },
          {
            onChangeText: setClassification,
            choices: [
              { label: "Fumo grosso", value: "thick" },
              { label: "Fumo fino", value: "fine" },
            ],
            value: classification,
            type: "radio",
          },
        ]}
      />
      <TouchableOpacity
        className="my-6 w-full items-center justify-center rounded-lg bg-blue-500 py-6"
        onPress={handleSave}
      >
        <Text className="text-base font-bold text-white">Salvar compra</Text>
      </TouchableOpacity>
    </View>
  );
}
