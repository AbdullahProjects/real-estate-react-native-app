import FilterModal from "@/components/FilterModal";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { PropertyType, useFilterStore } from "@/store/filterStore";
import { Property } from "@/types/index";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

  useEffect(() => {
    if (openFilters === "true") {
      setShowFilters(true);
    }
  }, [openFilters]);

  const {
    search,
    propertyType,
    bedrooms,
    minPrice,
    maxPrice,
    setSearch,
    setPropertyType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
    resetFilters,
  } = useFilterStore();

  const activeFilterCount = [
    propertyType !== null,
    bedrooms !== null,
    minPrice !== null,
    maxPrice !== null,
  ].filter(Boolean).length;

  useEffect(() => {
    fetchResultsFromSupabase();
  }, [search, propertyType, bedrooms, minPrice, maxPrice]);

  const fetchResultsFromSupabase = async () => {
    try {
      setLoading(true);

      let query = supabase.from("properties").select("*");

      // Apply search filter
      if (search.trim()) {
        query = query.ilike("title", `%${search.trim()}%`);
      }

      // Apply property type filter
      if (propertyType) {
        query = query.eq("type", propertyType);
      }

      // Apply bedrooms filter
      if (bedrooms !== null) {
        query = query.eq("bedrooms", bedrooms);
      }

      // Apply price range filter
      if (minPrice !== null) {
        query = query.gte("price", minPrice);
      }
      if (maxPrice !== null) {
        query = query.lte("price", maxPrice);
      }

      const { data } = await query.order("create_at", { ascending: false });

      console.log("Fetched results:", data);

      setResults(data ?? []);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];

    if (propertyType) {
      const labels: Record<NonNullable<PropertyType>, string> = {
        apartment: "Apartment",
        house: "House",
        studio: "Studio",
        villa: "Villa",
        commercial: "Commercial",
      };
      chips.push({
        key: "propertyType",
        label: labels[propertyType],
        onRemove: () => setPropertyType(null),
      });
    }

    if (bedrooms !== null) {
      chips.push({
        key: "bedrooms",
        label: bedrooms >= 5 ? "5+ Beds" : `${bedrooms} Bed`,
        onRemove: () => setBedrooms(null),
      });
    }

    if (minPrice !== null || maxPrice !== null) {
      const fmt = (n: number | null) =>
        n !== null ? `$${(n / 1000).toFixed(0)}k` : "";
      const min = fmt(minPrice);
      const max = fmt(maxPrice);
      const label =
        min && max ? `${min} - ${max}` : min ? `Min ${min}` : `Max ${max}`;
      chips.push({
        key: "price",
        label,
        onRemove: () => {
          setMinPrice(null);
          setMaxPrice(null);
        },
      });
    }

    if (search.trim()) {
      chips.push({
        key: "search",
        label: `"${search.trim()}"`,
        onRemove: () => setSearch(""),
      });
    }

    return chips;
  }, [
    search,
    propertyType,
    bedrooms,
    minPrice,
    maxPrice,
    setSearch,
    setPropertyType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
  ]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header -------------------------------------------------- */}
      <View className="px-5 pt-8 pb-3">
        {/* Title */}
        <Text className="text-2xl font-bold">Find Property</Text>

        <View className="flex-row items-center gap-3 mt-4">
          <View className="flex-1">
            {/* Input Field */}
            <View
              className="flex-row items-center gap-3 mx-1 bg-white rounded-full border border-gray-200 px-5 py-0.5"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 3,
              }}
            >
              <Ionicons name="search-outline" size={18} color="gray" />
              <TextInput
                placeholder="Search by title or city..."
                className="text-gray-800 text-md flex-1"
                value={search}
                onChangeText={setSearch}
                autoCapitalize="none"
              />
              {search.length > 0 && (
                <TouchableOpacity className="" onPress={() => setSearch("")}>
                  <Ionicons name="close-circle" size={20} color="gray" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Filter Button */}
          <TouchableOpacity
            className={`${activeFilterCount > 0 ? "bg-blue-500" : "bg-white"} px-2.5 py-2 rounded-md`}
            onPress={() => setShowFilters(true)}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={activeFilterCount > 0 ? "#fff" : "#374151"}
            />

            {activeFilterCount > 0 && (
              <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[20px] h-[18px] items-center justify-center px-1">
                <Text className="text-white text-[10px] font-bold">
                  {activeFilterCount > 99 ? "99+" : activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <View className="flex-row flex-wrap gap-2 mt-3">
          {activeChips.map((chip) => (
            <View
              key={chip.key}
              className="flex-row items-center bg-blue-50/80 border border-blue-100 rounded-full pl-3 pr-1.5 py-1.5 self-start mt-4"
            >
              <Text className="text-blue-700 text-sm font-medium mr-1">
                {chip.label}
              </Text>
              <TouchableOpacity
                onPress={chip.onRemove}
                className="w-5 h-5 rounded-full items-center justify-center bg-blue-200"
              >
                <Ionicons name="close" size={12} color="#1D4ED8" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Results (Body) -------------------------------------------------- */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={true}
        ListHeaderComponent={
          <Text className="text-sm text-gray-500 mb-4 px-5">
            {loading ? "Searching..." : `${results.length} results found`}
          </Text>
        }
        ListEmptyComponent={
          !loading ? (
            <View className="py-20 items-center">
              <Text className="text-gray-500 mb-1 text-lg font-bold">No Properties Found</Text>
              <Text className="text-gray-400">Try adjusting your filters</Text>
            </View>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" className="py-10" />
          )
        }
        renderItem={({ item }) => (
          <View className="px-5">
            <PropertyCard property={item} />
          </View>
        )}
      />

      {/* Filter Modal (bottom sheet) */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </SafeAreaView>
  );
}
