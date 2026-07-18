import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  // Initialize Clerk's useAuth hook to access authentication methods
  const { signOut } = useAuth();

  // Initialize router for navigation
  const router = useRouter();

  // Method to handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to sign-in page after signing out
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  return (
    <SafeAreaView>
      <Text>ProfileScreen</Text>

      <TouchableOpacity onPress={handleSignOut} className="">
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
