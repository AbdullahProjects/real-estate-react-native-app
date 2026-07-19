import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function FeaturedCard({ property }: { property: Property }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      // onPress={() => router.push(`/(root)/property/${property.id}`)}
      className="w-72 mr-3 rounded-3xl overflow-hidden bg-white mb-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Property Image */}
      <Image
        source={{ uri: property.images[0] }}
        className="w-full h-44"
        resizeMode="cover"
      />

      {/* Property Image Overlay */}
      {/* Property Type */}
      <View className="absolute top-3 left-3 bg-white/90 px-3 py-2 rounded-full">
        <Text className="text-xs font-semibold text-blue-600 capitalize">
          {property.type}
        </Text>
      </View>

      {/* Is Sold Badge */}
      {property.is_sold && (
        <View className="absolute top-3 right-3 bg-red-500 px-3 py-2 rounded-full">
          <Text className="text-xs font-semibold text-white capitalize">
            Sold
          </Text>
        </View>
      )}

      {/* Property Details */}
      <View className="p-4 px-5">
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
            {property.address}, {property.city}
          </Text>
        </View>

        {/* Price, Bedrooms, Bathrooms */}
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-blue-600">
            {formatPrice(property.price)}
          </Text>

          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="bed-outline" size={15} />
              <Text className="text-sm text-gray-500" numberOfLines={1}>
                {property.bedrooms}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="water-outline" size={15} />
              <Text className="text-sm text-gray-500" numberOfLines={1}>
                {property.bathrooms}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
