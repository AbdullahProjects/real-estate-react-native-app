import { useAuth, useSignUp } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  // Initialize Clerk hooks
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();

  // Initialize router for navigation
  const router = useRouter();

  // State variables for form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Determine if the sign-up process is currently loading
  const isLoading = fetchStatus === "fetching";

  // Method to handle email verification
  const onVerifyPress = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({
      code,
    });

    if (error) {
      console.error(
        "Error verifying email:",
        JSON.stringify(error.message, null, 2),
      );
      alert(error.message);
      return;
    }

    // Handle successful verification
    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  // Method to handle resending the verification code
  const resendCodePress = async () => {
    const { error } = await signUp.verifications.sendEmailCode();
    if (error) {
      console.error(
        "Error resending verification code:",
        JSON.stringify(error.message, null, 2),
      );
      alert(error.message);
      return;
    }
    alert("Verification code resent. Please check your email.");
  };

  // Method to handle sign up
  const onSignupPress = async () => {
    const { error } = await signUp.password({
      firstName,
      lastName,
      password,
      emailAddress: email,
    });

    if (error) {
      console.error(
        "Error signing up:",
        JSON.stringify(error.message, null, 2),
      );
      alert(error.message);
      return;
    }

    if (!error) {
      await signUp.verifications.sendEmailCode();
    }
  };

  // Case where the user has completed the sign-up process or is already signed in
  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  // Case where the user needs to verify their email
  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/app_logo.png")}
          className="w-32 h-16 mb-6"
          resizeMode="contain"
        />

        <Text className="text-3xl font-black text-gray-800 mb-2">
          Verify your Account
        </Text>

        <Text className="text-gray-500 mb-8 text-lg">
          We sent a verification code to {email}. Please check your inbox.
        </Text>

        <TextInput
          placeholder="Verification Code"
          className="w-full mb-4 bg-gray-50 border border-gray-300 placeholder:text-gray-500 placeholder:text-lg rounded-xl py-3 px-4 focus:outline-none"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          autoCapitalize="none"
        />
        {errors.fields.code && (
          <Text className="text-red-500 mb-4">
            {errors.fields.code.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onVerifyPress}
          disabled={isLoading}
          className="w-full bg-blue-600 py-4 mb-6 mt-2 rounded-xl items-center"
        >
          {isLoading ? (
            <ActivityIndicator className="text-white" />
          ) : (
            <Text className="text-white font-bold text-lg">Verify</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-500 text-md pr-1">
            Don't receive the code?{" "}
          </Text>
          <TouchableOpacity onPress={resendCodePress}>
            <Text className="text-blue-600 font-bold text-md">Resend Code</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Case where the user needs to provide their email, password and other information for signup
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/app_logo.png")}
          className="w-32 h-16 mb-6"
          resizeMode="contain"
        />

        <Text className="text-3xl font-black text-gray-800 mb-2">
          Create Account
        </Text>

        <Text className="text-gray-500 mb-8 text-lg">
          Find your dream home today
        </Text>

        <View className="flex-row gap-3 mb-4">
          <TextInput
            placeholder="First name"
            autoCapitalize="words"
            className="flex-1 bg-gray-50 border border-gray-300 placeholder:text-gray-500 placeholder:text-lg rounded-xl py-3 px-4 focus:outline-none "
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            placeholder="Last name"
            autoCapitalize="words"
            className="flex-1 bg-gray-50 border border-gray-300 placeholder:text-gray-500 placeholder:text-lg rounded-xl py-3 px-4 focus:outline-none "
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <TextInput
          placeholder="Email"
          className="w-full mb-4 bg-gray-50 border border-gray-300 placeholder:text-gray-500 placeholder:text-lg rounded-xl py-3 px-4 focus:outline-none"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.fields.emailAddress && (
          <Text className="text-red-500 mb-4">
            {errors.fields.emailAddress.message}
          </Text>
        )}

        <View className="flex-row items-center w-full gap-3 bg-gray-50 border border-gray-300 rounded-xl mb-4">
          <TextInput
            placeholder="Password"
            style={{ color: "black" }}
            className="flex-1 placeholder:text-gray-500 placeholder:text-lg py-3 px-4 focus:outline-none"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="black"
              className="pr-4"
            />
          </TouchableOpacity>
        </View>
        {errors.fields.password && (
          <Text className="text-red-500 mb-6">
            {errors.fields.password.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onSignupPress}
          disabled={isLoading}
          className="w-full bg-blue-600 py-4 mb-6 rounded-xl items-center"
        >
          {isLoading ? (
            <ActivityIndicator className="text-white" />
          ) : (
            <Text className="text-white font-bold text-lg">Sign Up</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-500 text-md pr-1">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-600 font-bold text-md">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
