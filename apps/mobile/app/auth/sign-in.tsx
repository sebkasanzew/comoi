import { useAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

type AuthFlow = "signIn" | "signUp";

export default function SignInScreen() {
  const { signIn, setActive: setSignInActive, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: isSignUpLoaded } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [flow, setFlow] = useState<AuthFlow>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  // Redirect if already signed in
  if (isSignedIn) {
    router.replace("/");
    return null;
  }

  const handleSignIn = async () => {
    if (!isSignInLoaded || !signIn) return;

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        router.replace("/");
      }
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      Alert.alert("Sign In Failed", error.errors?.[0]?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!isSignUpLoaded || !signUp) return;

    setLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      Alert.alert("Sign Up Failed", error.errors?.[0]?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!isSignUpLoaded || !signUp) return;

    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setSignUpActive({ session: result.createdSessionId });
        router.replace("/");
      }
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }> };
      Alert.alert("Verification Failed", error.errors?.[0]?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (flow === "signIn") {
      handleSignIn();
    } else {
      handleSignUp();
    }
  };

  // Verification screen
  if (pendingVerification) {
    return (
      <View className="flex-1 bg-gray-50 px-6 py-8 justify-center">
        <Text className="text-2xl font-bold text-gray-900 text-center mb-4">Verify your email</Text>
        <Text className="text-gray-600 text-center mb-6">
          We sent a verification code to {email}
        </Text>

        <TextInput
          className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl tracking-widest"
          placeholder="000000"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity
          className="bg-green-600 rounded-lg py-3 items-center mt-4"
          onPress={handleVerification}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-medium">Verify Email</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 items-center"
          onPress={() => setPendingVerification(false)}
        >
          <Text className="text-gray-600">Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 px-6 py-8">
      <View className="mb-8">
        <Text className="text-2xl font-bold text-gray-900 text-center">
          {flow === "signIn" ? "Welcome back" : "Create account"}
        </Text>
        <Text className="mt-2 text-gray-600 text-center">
          {flow === "signIn" ? "Sign in to your Comoi account" : "Join Comoi today"}
        </Text>
      </View>

      {/* Note about OAuth */}
      <View className="mb-6 bg-blue-50 rounded-lg p-4">
        <Text className="text-blue-800 text-sm text-center">
          Social login (Google, Facebook) coming soon!
        </Text>
      </View>

      {/* Divider */}
      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="px-4 text-gray-500 text-sm">Continue with email</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Email/Password Form */}
      <View className="space-y-4">
        <TextInput
          className="bg-white border border-gray-300 rounded-lg px-4 py-3"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <TextInput
          className="bg-white border border-gray-300 rounded-lg px-4 py-3 mt-4"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete={flow === "signIn" ? "current-password" : "new-password"}
        />

        <TouchableOpacity
          className="bg-green-600 rounded-lg py-3 items-center mt-4"
          onPress={handleSubmit}
          disabled={loading || !email || !password}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-medium">
              {flow === "signIn" ? "Sign In" : "Create Account"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Toggle Flow */}
      <TouchableOpacity
        className="mt-6 items-center"
        onPress={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
      >
        <Text className="text-green-600">
          {flow === "signIn"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
