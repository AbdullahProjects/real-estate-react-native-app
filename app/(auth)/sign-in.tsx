import { useAuth, useSignIn } from "@clerk/expo";
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

export default function SignIn() {
  // Initialize Clerk hooks
  const { signIn, errors, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();

  // Initialize router for navigation
  const router = useRouter();

  // State variables for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Determine if the sign-up process is currently loading
  const isLoading = fetchStatus === "fetching";

  // Method to handle email verification
  const onVerifyPress = async () => {
    const { error } = await signIn.mfa.verifyEmailCode({
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
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log("Current Task:", session.currentTask);
            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  // Method to handle resending the verification code
  const resendCodePress = async () => {
    const { error } = await signIn.mfa.sendEmailCode();
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

  // Method to handle sign in
  const onSigninPress = async () => {
    const { error } = await signIn.password({
      password,
      emailAddress: email,
    });

    if (error) {
      console.error(
        "Error signing in:",
        JSON.stringify(error.message, null, 2),
      );
      alert(error.message);
      return;
    }

    // Handle successful verification
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log("Current Task:", session.currentTask);
            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.verifyPhoneCode({ code });
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.log("Sign-in status:", signIn.status);
      alert(
        `Sign-in status: ${signIn.status}. Please check your email for further instructions.`,
      );
    }
  };

  // Case where the user has completed the sign-in process or is already signed in
  if (signIn.status === "complete" || isSignedIn) {
    return null;
  }

  // Case where the user needs to verify their email
  if (signIn.status === "needs_client_trust") {
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
          Welcome Back!
        </Text>

        <Text className="text-gray-500 mb-8 text-lg">
          Please sign in to your account to continue.
        </Text>

        <TextInput
          placeholder="Email"
          className="w-full mb-4 bg-gray-50 border border-gray-300 placeholder:text-gray-500 placeholder:text-lg rounded-xl py-3 px-4 focus:outline-none"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.fields.identifier && (
          <Text className="text-red-500 mb-4">
            {errors.fields.identifier.message}
          </Text>
        )}

        <View className="flex-row gap-3 bg-gray-50 border border-gray-300 rounded-xl mb-4">
          <TextInput
            placeholder="Password"
            className="w-full placeholder:text-gray-500 placeholder:text-lg py-3 px-4 focus:outline-none"
            value={password}
            onChangeText={setPassword}
            // secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
          ></TouchableOpacity>
        </View>
        {errors.fields.password && (
          <Text className="text-red-500 mb-6">
            {errors.fields.password.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onSigninPress}
          disabled={isLoading}
          className="w-full bg-blue-600 py-4 mb-6 mt-2 rounded-xl items-center"
        >
          {isLoading ? (
            <ActivityIndicator className="text-white" />
          ) : (
            <Text className="text-white font-bold text-lg">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-500 text-md pr-1">
            Don't have an account?{" "}
          </Text>
          <Link href={"/sign-up"}>
            <Text className="text-blue-600 font-bold text-md">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
