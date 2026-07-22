import { PropertyType, useFilterStore } from "@/store/filterStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TYPES: { label: string; value: PropertyType }[] = [
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Land", value: "land" },
  { label: "Commercial", value: "commercial" },
];

const BEDROOMS: { label: string; value: number | null }[] = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5+", value: 5 },
];

const PRICE_PRESETS: {
  label: string;
  min: number | null;
  max: number | null;
}[] = [
  { label: "Any", min: null, max: null },
  { label: "Under Rs.20L", min: null, max: 2000000 },
  { label: "Rs.20L - Rs.30L", min: 2000000, max: 3000000 },
  { label: "Rs.30L - Rs.40L", min: 3000000, max: 4000000 },
  { label: "Rs.40L - Rs.50L", min: 4000000, max: 5000000 },
  { label: "Over Rs.50L", min: 5000000, max: null },
];

export default function FilterModal(props: {
  visible: boolean;
  onClose: () => void;
}) {
  const {
    propertyType,
    bedrooms,
    minPrice,
    maxPrice,
    setPropertyType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
    resetFilters,
  } = useFilterStore();

  const [localMin, setLocalMin] = useState(
    minPrice !== null ? minPrice.toString() : "",
  );
  const [localMax, setLocalMax] = useState(
    maxPrice !== null ? maxPrice.toString() : "",
  );

  const activeCount = [propertyType, bedrooms, minPrice, maxPrice].filter(
    (v) => v !== null,
  ).length;

  const isPresetActive = (min: number | null, max: number | null) =>
    minPrice === min && maxPrice === max;

  const handlePreset = (min: number | null, max: number | null) => {
    setMinPrice(min);
    setMaxPrice(max);
    setLocalMin(min !== null ? min.toString() : "");
    setLocalMax(max !== null ? max.toString() : "");
  };

  const handleApply = () => {
    setMinPrice(localMin !== "" ? Number(localMin) : null);
    setMaxPrice(localMax !== "" ? Number(localMax) : null);
    props.onClose();
  };

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    resetFilters();
    props.onClose();
  };

  return (
    <Modal
      visible={props.visible}
      onRequestClose={props.onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
          <TouchableOpacity onPress={props.onClose}>
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="flex-row items-center text-lg gap-1">
            <Text className="font-bold text-gray-900">Filters</Text>
            {activeCount > 0 && (
              <Text className="text-black text-md font-bold">
                {"("}
                {activeCount}
                {")"}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={handleReset}>
            <Text className="text-blue-500 font-bold">Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Body */}
        <ScrollView
          className="flex-1 px-5 pt-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Property Type */}
          <Text className="text-base font-bold text-gray-900 mb-3">
            Property Type
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {TYPES.map((t) => (
              <TouchableOpacity
                key={t.value}
                onPress={() =>
                  setPropertyType(propertyType === t.value ? null : t.value)
                }
                className={`px-5 py-2 rounded-full border ${
                  propertyType === t.value
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    propertyType === t.value ? "text-white" : "text-gray-700"
                  }`}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bedrooms */}
          <Text className="text-base font-bold text-gray-900 mb-3">
            Bedrooms
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {BEDROOMS.map((b) => (
              <TouchableOpacity
                key={String(b.value)}
                onPress={() =>
                  setBedrooms(bedrooms === b.value ? null : b.value)
                }
                className={`px-5 py-2 rounded-full border ${
                  bedrooms === b.value
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    bedrooms === b.value ? "text-white" : "text-gray-700"
                  }`}
                >
                  {b.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Range */}
          <Text className="text-base font-bold text-gray-900 mb-3">
            Price Range
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {PRICE_PRESETS.map((p) => (
              <TouchableOpacity
                key={p.label}
                onPress={() => handlePreset(p.min, p.max)}
                className={`px-4 py-2 rounded-full border ${
                  isPresetActive(p.min, p.max)
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isPresetActive(p.min, p.max)
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Price Inputs */}
          <View className="flex-row items-center gap-3 mb-6">
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-1">Min</Text>
              <TextInput
                className="border border-gray-300 rounded-xl py-3 px-4 text-gray-900"
                placeholder="$0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={localMin}
                onChangeText={setLocalMin}
              />
            </View>
            <Text className="text-gray-400 mt-5">—</Text>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-1">Max</Text>
              <TextInput
                className="border border-gray-300 rounded-xl py-3 px-4 text-gray-900"
                placeholder="$999,999+"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={localMax}
                onChangeText={setLocalMax}
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View className="px-5 py-4 border-t border-gray-200 flex-row gap-3">
          <TouchableOpacity
            onPress={handleReset}
            className="flex-1 py-4 rounded-xl items-center bg-gray-200"
          >
            <Text className="text-gray-700 font-bold text-base">Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleApply}
            className="flex-1 py-4 rounded-xl items-center bg-blue-500"
          >
            <Text className="text-white font-bold text-base">Apply</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
