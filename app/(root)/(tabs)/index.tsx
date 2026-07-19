import FeaturedCard from "@/components/FeaturedCart";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  console.log(featured, recommended);

  const fetchProperties = async () => {
    setLoading(true);
    const { data: featuredData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    const { data: recommendedData } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", false)
      .order("created_at", { ascending: false });

    setFeatured(featuredData ?? []);
    setRecommended(recommendedData ?? []);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5">
        <FlatList
          data={recommended}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View>
              {/* Header */}
              <View className="flex-row items-center justify-between pt-6 pb-5">
                <Image
                  source={require("../../../assets/images/app_logo.png")}
                  style={{ width: 90, height: 40 }}
                  resizeMode="contain"
                />

                <View className="text-gray-900 items-end">
                  <Text className="text-lg mb-1">Good Morning 👋</Text>
                  <Text className="text-xl font-bold">
                    {" "}
                    {user?.firstName ?? "User"}
                  </Text>
                </View>
              </View>

              {/* Search Bar */}
              <TouchableOpacity
                onPress={() => router.push("/(root)/(tabs)/search")}
                className="flex-row items-center gap-3 mb-6 bg-white rounded-full border border-gray-200 px-5 py-3"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <Ionicons name="search-outline" size={18} />
                <Text className="text-gray-400 text-md flex-1">
                  Search properties, cities...
                </Text>
              </TouchableOpacity>

              {/* Featured Section */}
              <View className="mb-6">
                <Text className="text-gray-900 text-2xl font-bold mb-4">
                  Featured
                </Text>
                {loading ? (
                  <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    className="py-10"
                  />
                ) : (
                  <FlatList
                    data={featured}
                    contentContainerStyle={{ paddingHorizontal: 5 }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <FeaturedCard property={item} />}
                  />
                )}
              </View>

              {/* Recommended Section */}
              <Text className="text-gray-900 text-2xl font-bold mb-4">
                Recommended
              </Text>
            </View>
          }
          ListEmptyComponent={
            !loading ? (
              <View>
                <Text className="text-gray-500 text-center py-10">
                  No Properties Found
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View>
              <PropertyCard property={item} />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
