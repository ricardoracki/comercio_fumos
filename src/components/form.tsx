import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  TextInputProps,
} from "react-native";
import colors from "tailwindcss/colors";

import MaskInput, { Masks } from "react-native-mask-input";

type FieldProps = TextInputProps & {
  label?: string;
  type?: "input" | "radio" | "masked";
  choices?: string[] | { label: string; value: string }[];
};

type FormProps = {
  fields: FieldProps[];
};

export const Form = ({ fields }: FormProps) => {
  return (
    <ScrollView
      className="flex-1 rounded-lg bg-white p-3"
      contentContainerStyle={{ paddingBottom: 22 }}
    >
      {fields.map((f, i) => {
        const { label, choices, type, ...rest } = f;

        if (type == "radio")
          return (
            <View className="flex-row gap-3 pt-3" key={`${i}`}>
              {choices &&
                choices.map((choice, index) => (
                  <TouchableOpacity
                    key={`${index}${choice}`}
                    className={` rounded border border-gray-300 p-3 ${
                      rest.value ==
                        (typeof choice == "string" ? choice : choice.value) &&
                      "bg-slate-300"
                    }`}
                    onPress={() => {
                      rest.onChangeText &&
                        rest.onChangeText(
                          typeof choice == "string" ? choice : choice.value,
                        );
                    }}
                  >
                    <Text className="text-base font-bold">
                      {typeof choice == "string" ? choice : choice.label}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          );

        if (type == "masked") {
          return (
            <View key={`${i}`}>
              <Text className="mb-1 text-sm font-semibold">{label}</Text>

              <MaskInput
                className="rounded border border-gray-300 p-6"
                placeholderTextColor={colors.gray[500]}
                {...rest}
                mask={Masks.BRL_CURRENCY}
              />
            </View>
          );
        }
        return (
          <View key={`${i}`}>
            <Text className="mb-1 text-sm font-semibold">{label}</Text>
            <TextInput
              className="rounded border border-gray-300 p-6"
              placeholderTextColor={colors.gray[500]}
              {...rest}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};
