import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface PropertyCardProps {
  property: Property;
  showSave?: boolean;
  onUnSave?: () => void;
}

export default function PropertyCard({
  property,
  showSave,
  onUnSave,
}: PropertyCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="flex-row rounded-3xl overflow-hidden bg-white mt-4 mx-1"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Property Image */}
      <Image
        source={{ uri: property.images[0] }}
        className="w-28 h-30"
        resizeMode="cover"
      />

      {/* Property Details */}
      <View className="flex-1 p-3 justify-between">
        <View>
          {/* Title */}
          <Text
            className="text-lg font-bold text-gray-800 mb-1"
            numberOfLines={1}
          >
            {property.title}
          </Text>

          {/* Address */}
          <View className="flex-row items-center gap-1 mb-3">
            <Ionicons name="location-outline" size={15} />
            <Text className="text-sm text-gray-500" numberOfLines={1}>
              {property.city}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between gap-1">
          {/* Price */}
          <Text className="text-lg font-bold text-blue-600">
            {formatPrice(property.price)}
          </Text>

          {/* Sold Badge */}
          {/* {property.is_sold && (
            <View className="absolute top-3 right-3 bg-red-500 px-3 py-2 rounded-full">
              <Text className="text-xs font-semibold text-white capitalize">
                Sold
              </Text>
            </View>
          )} */}

          <View className="flex-row items-center gap-3">
            {/* Bedrooms */}
            <View className="flex-row items-center gap-1">
              <Ionicons name="bed-outline" size={15} />
              <Text className="text-sm text-gray-500" numberOfLines={1}>
                {property.bedrooms} bd
              </Text>
            </View>

            {/* Area */}
            <View className="flex-row items-center gap-1">
              <Ionicons name="expand-outline" size={15} />
              <Text className="text-sm text-gray-500" numberOfLines={1}>
                {property.area_sqft} sqft
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
