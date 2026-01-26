import { useAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

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
      <Box className="flex-1 bg-background-50 px-6 py-8 justify-center">
        <Heading size="xl" className="text-typography-900 text-center mb-4">
          Verify your email
        </Heading>
        <Text className="text-typography-500 text-center mb-6">
          We sent a verification code to {email}
        </Text>

        <Input variant="outline" size="xl" className="rounded-lg bg-background-0">
          <InputField
            placeholder="000000"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            className="text-center text-2xl tracking-widest"
          />
        </Input>

        <Button
          size="lg"
          className="rounded-lg mt-4"
          onPress={handleVerification}
          isDisabled={loading}
        >
          {loading ? (
            <ButtonSpinner color="white" />
          ) : (
            <ButtonText className="font-bold">Verify Email</ButtonText>
          )}
        </Button>

        <Pressable className="mt-4 items-center" onPress={() => setPendingVerification(false)}>
          <Text className="text-typography-500">Back</Text>
        </Pressable>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-50 px-6 py-8">
      <VStack className="mb-8">
        <Heading size="xl" className="text-typography-900 text-center">
          {flow === "signIn" ? "Welcome back" : "Create account"}
        </Heading>
        <Text className="mt-2 text-typography-500 text-center">
          {flow === "signIn" ? "Sign in to your Comoi account" : "Join Comoi today"}
        </Text>
      </VStack>

      {/* Note about OAuth */}
      <Box className="mb-6 bg-info-100 rounded-lg p-4">
        <Text className="text-info-700 text-sm text-center">
          Social login (Google, Facebook) coming soon!
        </Text>
      </Box>

      {/* Divider */}
      <HStack className="items-center my-6">
        <Divider className="flex-1" />
        <Text className="px-4 text-typography-400 text-sm">Continue with email</Text>
        <Divider className="flex-1" />
      </HStack>

      {/* Email/Password Form */}
      <VStack space="md">
        <Input variant="outline" size="lg" className="rounded-lg bg-background-0">
          <InputField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </Input>

        <Input variant="outline" size="lg" className="rounded-lg bg-background-0">
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete={flow === "signIn" ? "current-password" : "new-password"}
          />
        </Input>

        <Button
          size="lg"
          className="rounded-lg mt-2"
          onPress={handleSubmit}
          isDisabled={loading || !email || !password}
        >
          {loading ? (
            <ButtonSpinner color="white" />
          ) : (
            <ButtonText className="font-bold">
              {flow === "signIn" ? "Sign In" : "Create Account"}
            </ButtonText>
          )}
        </Button>
      </VStack>

      {/* Toggle between sign in and sign up */}
      <Center className="mt-6">
        <HStack space="xs">
          <Text className="text-typography-500">
            {flow === "signIn" ? "Don't have an account?" : "Already have an account?"}
          </Text>
          <Pressable onPress={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}>
            <Text className="text-primary-500 font-semibold">
              {flow === "signIn" ? "Sign Up" : "Sign In"}
            </Text>
          </Pressable>
        </HStack>
      </Center>
    </Box>
  );
}
