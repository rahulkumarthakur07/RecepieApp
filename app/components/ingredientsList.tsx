import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { loadfonts } from "../utils/useFonts";
import Feather from "react-native-vector-icons/Feather";
const IngredientList = ({ item }: { item: any }) => {
  const ingredients = [];
  const measures = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = item[`strIngredient${i}`];
    const measure = item[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(ingredient);
      measures.push(measure);
    }
  }

  useEffect(() => {
    loadfonts();
  }, []);

  return (
    <View className="flex w-full flex-col">
      {ingredients.map((ingredient, index) => (
        <View className="flex flex-row py-1 justify-between" key={index}>
          <View className="flex flex-row items-center" >
            <Feather name="check-circle" size={20} color="#F68537" />
            <Text
              className="text-xl p-1"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              {ingredient}
            </Text>
          </View>

          <Text
            className="text-xl p-1"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            {measures[index]}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default IngredientList;
