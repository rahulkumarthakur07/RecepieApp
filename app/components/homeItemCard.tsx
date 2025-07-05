import React, { useEffect, useState } from "react";
import { Pressable, Text, View, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import AntDesign from "react-native-vector-icons/AntDesign";
import IonIcons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "favorites";

const HomeItemCard = ({ item }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [meal, setMeal] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const id = item.idMeal;

  // Load favorite IDs from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
        if (jsonValue != null) {
          setFavorites(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error("Failed to load favorites", e);
      }
    })();
  }, []);

  // Fetch meal details
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

  useEffect(() => {
    getDetailOfProduct();
  }, []);

  // Check if this item is already favorited
  const isFavorite = favorites.includes(id);

  // Toggle favorite status and save to AsyncStorage
  const toggleFavorite = async () => {
    let newFavorites = [];
    if (isFavorite) {
      // Remove from favorites
      newFavorites = favorites.filter(favId => favId !== id);
    } else {
      // Add to favorites
      newFavorites = [...favorites, id];
    }
    setFavorites(newFavorites);
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (e) {
      console.error("Failed to save favorites", e);
    }
  };

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/screens/itemDetails",
          params: {
            id: item.idMeal,
            name: item.strMeal,
            image_url: item.strMealThumb,
            brand: meal?.strArea,
            quantity: item.quantity,
          },
        });
      }}
      style={{
        borderRadius: 22,
        height: 160,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 8,
        marginVertical: 8,
      }}
    >
      <View
        style={{
          width: 110,
          height: 120,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {!imageLoaded && (
          <View
            style={{
              backgroundColor: "#d1d5db", // Tailwind gray-300 equivalent
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="small" color="#F68537" />
          </View>
        )}
        <Image
          source={{ uri: item.strMealThumb }}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
          contentFit="cover"
          onLoad={() => setImageLoaded(true)}
        />
      </View>

      <View
        style={{
          marginLeft: 8,
          paddingVertical: 8,
          justifyContent: "space-between",
          width: "40%",
          height: "100%",
        }}
      >
        <Text
          style={{
            color: "#F68537",
            backgroundColor: "#FEE2E2",
            textAlign: "center",
            width: "65%",
            borderRadius: 9999,
            paddingVertical: 4,
            paddingHorizontal: 8,
            fontSize: 12,
            fontFamily: "Poppins_Regular", // Make sure font is loaded
          }}
        >
          {meal?.strArea || "No Brand"}
        </Text>

        <Text
          style={{
            fontFamily: "Poppins_SemiBold",
            fontSize: 16,
            color: "#000",
          }}
          numberOfLines={2}
        >
          {item.strMeal}
        </Text>

        <Text
          style={{
            fontFamily: "Poppins_Bold",
            color: "#4B5563", // Tailwind gray-600
            fontSize: 14,
          }}
          numberOfLines={1}
        >
          {item.quantity || "$19.99"}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          height: "100%",
          paddingVertical: 8,
          paddingHorizontal: 8,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign name="star" size={18} color="orange" />
          <Text style={{ color: "#6B7280", fontSize: 12, marginLeft: 4 }}>
            4.6k
          </Text>
        </View>
        <Pressable
          onPress={e => {
            e.stopPropagation(); // Prevent triggering the card onPress
            toggleFavorite();
          }}
          style={{
            backgroundColor: isFavorite ? "tomato" : "#F68537",
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 99,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Show filled heart if favorite, outline otherwise */}
          <IonIcons
            name={isFavorite ? "heart" : "heart-outline"}
            size={22}
            color="white"
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default HomeItemCard;
