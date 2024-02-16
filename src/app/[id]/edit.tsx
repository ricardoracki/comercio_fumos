import { useState, useEffect } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Shopping } from "../../lib/database/entity";
import { convertArrobaInKg, convertKgInArroba } from "../../lib/calculator";
import { dataSource } from "../../lib/database";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { Form } from "../../components/form";

export default function New() {
  const { id } = useGlobalSearchParams();
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

    const {} = await dataSource
      .createQueryBuilder()
      .update(Shopping)
      .set({
        value: data.value,
        customer: data.customer,
        amountInKg: data.amountInKg,
        classification: data.classification,
        saveFormat: data.saveFormat,
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
    setValue(`${(_data?.value || 0) * 100}`);
    setMaskedValue(`${(_data?.value || 0) * 100}`);
    setWeight(
      `${
        _data?.saveFormat == "@"
          ? convertKgInArroba(_data?.amountInKg || 0)
          : _data?.amountInKg
      }`,
    );
    setClassification(`${_data?.classification}`);
    setWeightType(`${_data?.saveFormat}`);
  }

  return (
    <View className="flex-1 bg-white p-3">
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
        className="mt-3 w-full items-center justify-center rounded-lg bg-rose-500 py-6"
        onPress={handleSave}
      >
        <Text className="text-base font-bold text-white">Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}
