import { View, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/expo';
import { Redirect, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  
    if (!isLoaded) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
  
    if (isSignedIn) {
      return <Redirect href={'/'} />;
    }
  
        return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
