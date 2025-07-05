import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IonIcons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { Image } from "expo-image";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const FAVORITES_KEY = "favorites";

const FavScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMealById = async (id) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      return data.meals?.[0] || null;
    } catch (err) {
      console.error("Fetch meal failed:", err);
      return null;
    }
  };

  const loadFavorites = async () => {
    try {
      const json = await AsyncStorage.getItem(FAVORITES_KEY);
      const ids = json ? JSON.parse(json) : [];
      setFavorites(ids);
      const mealsData = await Promise.all(ids.map(fetchMealById));
      setMeals(mealsData.filter(Boolean));
    } catch (err) {
      console.error("Load favorites error:", err);
    } finally {
      setLoading(false);
    }
  };

  const unfavoriteMeal = async (id) => {
    const updated = favorites.filter((favId) => favId !== id);
    setFavorites(updated);
    setMeals((prev) => prev.filter((m) => m.idMeal !== id));
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/screens/itemDetails",
          params: {
            id: item.idMeal,
            name: item.strMeal,
            image_url: item.strMealThumb,
            brand: item.strArea,
          },
        })
      }
      style={{
        borderRadius: 22,
        height: 160,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 8,
        marginVertical: 8,
        marginHorizontal: 16,
        elevation: 4,
      }}
    >
      {/* Image Section */}
      <View
        style={{
          width: 110,
          height: 120,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: item.strMealThumb }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>

      {/* Text Info */}
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
            fontFamily: "Poppins_Regular",
          }}
        >
          {item.strArea || "No Brand"}
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
            color: "#4B5563",
            fontSize: 14,
          }}
          numberOfLines={1}
        >
          $19.99
        </Text>
      </View>

      {/* Favorite Button */}
      <View
        style={{
          flex: 1,
          height: "100%",
          paddingVertical: 8,
          paddingHorizontal: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            unfavoriteMeal(item.idMeal);
          }}
          style={{
            backgroundColor: "tomato",
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 99,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IonIcons name="heart" size={22} color="white" />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F7" }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#F5F5F7",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            padding: 12,
            borderRadius: 9999,
            backgroundColor: "white",
          }}
        >
          <IonIcons name="chevron-back" size={24} color="black" />
        </Pressable>

        <Text
          style={{
            fontFamily: "Poppins_Bold",
            fontSize: 18,
            color: "black",
          }}
        >
          Favorite Meals
        </Text>

        <View
          style={{
            padding: 12,
            borderRadius: 9999,
            backgroundColor: "white",
          }}
        >
          <Feather name="more-vertical" size={24} color="black" />
        </View>
      </View>

      {/* Loading */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#F68537" />
        </View>
      ) : meals.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#6B7280", fontFamily: "Poppins_Regular" }}>
            No favorite meals found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </SafeAreaView>
  );
};

export default FavScreen;
