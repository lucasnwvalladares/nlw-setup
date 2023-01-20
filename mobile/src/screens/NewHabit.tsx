import { useState } from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";

import colors from "tailwindcss/colors";

const availableWeekDays = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado']

export function NewHabit() {
  const [weekDays, setWeekDays] = useState<number[]>([])
  
  function handleToggleWeekDays(weekDayIndex: number) {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex))
    } else {
      setWeekDays(prevState => [...prevState, weekDayIndex])
    }
  }
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}  
      >
        <BackButton />

        <Text
          className="mt-6 text-white font-extrabold text-3xl"
        >
          Criar Hábito
        </Text>
        <Text
          className="mt-6 text-white font-bold text-base"
        >
          Qual hábito você deseja adicionar?
        </Text>
        <TextInput
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="ex.: 2h de Exercícios Físicos"
          placeholderTextColor={colors.zinc[400]}
        />

        <Text
          className="font-semibold mt-4 mb-3 text-white text-base"
        >
          Quais dias da semana?
        </Text>

        {
          availableWeekDays.map((weekDay, i) => (
            <Checkbox
              key={weekDay}
              title={weekDay}
              checked={weekDays.includes(i)}
              onPress={() => handleToggleWeekDays(i)}
            />
          ))
        }
        
        <TouchableOpacity
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          activeOpacity={0.7}
        >
          <Feather
            name="check"
            size={20}
            color={colors.white}
          />

          <Text
            className="font-semibold text-base text-white ml-2"
          >
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}