import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import IonIcons from "react-native-vector-icons/Ionicons";
import IngredientList from "../components/ingredientsList";
import { loadfonts } from "../utils/useFonts";

const ItemDetailPage = () => {
  const { id, name, image_url } = useLocalSearchParams();
  const [meal, setMeal] = useState(null);

  const getDetailOfProduct = async () => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const result = await response.json();
      if (result.meals && result.meals.length > 0) {
        setMeal(result.meals[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const openYouTube = () => {
    if (meal?.strYoutube) {
      Linking.openURL(meal.strYoutube).catch((err) =>
        console.error("Failed to open YouTube link:", err)
      );
    }
  };

  useEffect(() => {
    loadfonts();
    getDetailOfProduct();
  }, []);

  return (
    <SafeAreaView
      className="flex-1 bg-[#F5F5F7]"
      edges={["top", "left", "right"]}
    >
      {/* Fixed Header */}
      <View className="px-4 py-2 flex-row items-center justify-between bg-[#F5F5F7]">
        <Pressable
          onPress={() => router.back()}
          className="p-3 rounded-full bg-white"
        >
          <IonIcons name="chevron-back" size={24} color="black" />
        </Pressable>
        <Text
          className="text-black text-xl"
          style={{ fontFamily: "Poppins_Bold" }}
        >
          Product Details
        </Text>
        <View className="p-3 rounded-full bg-white">
          <Feather name="more-vertical" size={24} color="black" />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {/* Image */}
        <Image
          source={{ uri: meal?.strMealThumb || image_url }}
          className="rounded-2xl my-4"
          style={{ width: "100%", height: 250 }}
          resizeMode="cover"
        />

        {/* Title + Heart */}
        <View className="flex-row items-center justify-between mt-2">
          <Text
            style={{ fontFamily: "Poppins_Bold" }}
            className="text-black text-2xl"
          >
            {name}
          </Text>
          <Feather name="heart" size={24} color="black" />
        </View>

        {/* YouTube */}
        {meal?.strYoutube && (
          <View className="flex-row items-center justify-between mt-4">
            <Text
              style={{ fontFamily: "Poppins_SemiBold", flex: 1 }}
              className="text-gray-500 text-md"
            >
              Watch the tutorial on YouTube
            </Text>
            <Pressable onPress={openYouTube}>
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/2560px-YouTube_Logo_2017.svg.png",
                }}
                resizeMode="contain"
                style={{ width: 100, height: 50 }}
              />
            </Pressable>
          </View>
        )}

        {/* Ingredients */}
        {meal?.strArea && (
          <>
            <Text
              style={{ fontFamily: "Poppins_SemiBold" }}
              className="text-orange-500 bg-orange-100 py-2 px-4 rounded-full text-xl mt-6 w-1/2"
            >
              Ingredients
            </Text>
            <IngredientList item={meal} />
          </>
        )}

        {/* Instructions */}
        {meal?.strInstructions && (
          <>
            <Text
              style={{ fontFamily: "Poppins_SemiBold" }}
              className="text-orange-500 bg-orange-100 py-2 px-4 rounded-full text-xl mt-6 w-1/2"
            >
              Instructions
            </Text>
            <Text
              style={{ fontFamily: "Poppins-Regular" }}
              className="text-gray-700 mt-2 leading-6"
            >
              {meal.strInstructions}
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemDetailPage;
