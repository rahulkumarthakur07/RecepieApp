import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import HomeItemCard from "./components/homeItemCard"; // Ensure this supports TheMealDB props
import { loadfonts } from "./utils/useFonts";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

export default function App() {
  // === State Hooks ===
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 20;

  // Categories for TheMealDB - update as needed or fetch dynamically
  const categories = [
    { id: "1", name: "Beef" },
    { id: "2", name: "Chicken" },
    { id: "3", name: "Dessert" },
    { id: "4", name: "Pasta" },
    { id: "5", name: "Seafood" },
  ];

  // Fetch data with client-side pagination
  const getDataFromAPI = useCallback(
    async (
      query,
      { isInitial = false, isCategory = false, page = 1, append = false } = {}
    ) => {
      if (isInitial) setLoading(true);
      if (isCategory) setCategoryLoading(true);
      if (!isInitial && !isCategory && page > 1) setLoadingMore(true);

      try {
        let response;
        if (isCategory && query) {
          response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
              query
            )}`
          );
        } else {
          response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
              query
            )}`
          );
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error:", errorText);
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const allMeals = data.meals || [];

        // Paginate client-side
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const paginatedMeals = allMeals.slice(
          startIndex,
          startIndex + ITEMS_PER_PAGE
        );

        setProducts((prev) => (append ? [...prev, ...paginatedMeals] : paginatedMeals));
        setHasMore(startIndex + ITEMS_PER_PAGE < allMeals.length);
      } catch (error) {
        console.error("Failed to fetch meals:", error);
        if (!append) setProducts([]);
        setHasMore(false);
      } finally {
        if (isInitial) setLoading(false);
        if (isCategory) setCategoryLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Load more data on scroll end
  const handleEndReached = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      getDataFromAPI(searchText, {
        page: nextPage,
        append: true,
        isCategory: !!selectedCategory,
      });
    }
  };

  // Load fonts and initial data on mount
  useEffect(() => {
    const prepare = async () => {
      await loadfonts();
      setFontsLoaded(true);
      getDataFromAPI("", { isInitial: true }); // load all or random meals initially
    };
    prepare();
  }, []);

  // Load meals on category change
  useEffect(() => {
    if (selectedCategory) {
      setPage(1);
      setHasMore(true);
      setSearchText(selectedCategory);
      getDataFromAPI(selectedCategory, { isCategory: true, page: 1 });
    }
  }, [selectedCategory]);

  // Debounce search input to avoid rapid reloads
  const debounceTimeoutRef = useRef(null);
  const onSearchTextChange = (text) => {
    setSearchText(text);

    // Clear selected category if user types a search
    if (selectedCategory) setSelectedCategory(null);

    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      getDataFromAPI(text.trim(), { isInitial: true, page: 1 });
    }, 600);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#F5F5F7" }}>
        <StatusBar translucent={false} backgroundColor="#fff" barStyle="dark-content" />

        {/* Search bar */}
        <View className="flex-row my-2 w-full px-6 items-center justify-between">
          <View className="bg-white w-5/6 flex-row items-center justify-between px-4 rounded-2xl">
            <Feather name="search" size={24} />
            <TextInput
              style={{
                fontFamily: "Poppins_SemiBold",
                textAlignVertical: "center",
              }}
              placeholder="Search meals"
              className="flex-1 h-14 px-2"
              value={searchText}
              onChangeText={onSearchTextChange}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {/* Filter icon (for future filter options) */}
            <Pressable onPress={() => alert("Filter options coming soon!")}>
              <Feather name="sliders" size={24} />
            </Pressable>
          </View>

          {/* Shopping bag icon */}
          <Pressable onPress={() => router.push("./screens/fav")} className="bg-white p-4 rounded-full ml-3">
            <Feather name="heart" size={24} />
          </Pressable>
        </View>

        {/* Categories list */}
        <View className="w-full px-6 my-3">
          <Text className="text-xl" style={{ fontFamily: "Poppins_Bold" }}>
            Categories
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  if (selectedCategory === item.name) {
                    // Deselect category: reload with current search or empty
                    setSelectedCategory(null);
                    setPage(1);
                    setHasMore(true);
                    getDataFromAPI(searchText || "", { isInitial: true, page: 1 });
                  } else {
                    setSelectedCategory(item.name);
                  }
                }}
                style={{
                  backgroundColor: selectedCategory === item.name ? "#F68537" : "#fff",
                  elevation: selectedCategory === item.name ? 5 : 0,
                  shadowColor: selectedCategory === item.name ? "#F68537" : "#fff",
                }}
                className="my-2 px-6 py-2 rounded-xl m-2"
              >
                <Text
                  className="text-lg"
                  style={{
                    fontFamily: "Poppins_Regular",
                    color: selectedCategory === item.name ? "#fff" : "#000",
                  }}
                >
                  {item.name}
                </Text>
              </Pressable>
            )}
          />
        </View>

        {/* Products list */}
        <View className="w-full px-6 my-3 flex-1">
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
            <Text className="text-xl" style={{ fontFamily: "Poppins_Bold", flex: 1 }}>
              Recommended for you
            </Text>
            {categoryLoading && <ActivityIndicator size="small" color="tomato" />}
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={products}
            keyExtractor={(item) => item.idMeal.toString()}
            renderItem={({ item }) => <HomeItemCard item={item} />}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <View className="py-4">
                  <ActivityIndicator size="small" color="tomato" />
                </View>
              ) : null
            }
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
