import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MapPin, Search, ShoppingCart, Store } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function Index() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  return (
    <Box testID="welcome-screen" className="flex-1 bg-background-0 p-6">
      <StatusBar style="auto" />

      {/* Header */}
      <HStack className="justify-between items-center mb-6">
        <HStack space="sm" className="items-center">
          <Icon as={MapPin} size="md" className="text-primary-500" />
          <VStack>
            <Text size="xs" className="text-typography-400">
              Deliver to
            </Text>
            <Text size="sm" bold className="text-typography-900">
              District 1, HCMC
            </Text>
          </VStack>
        </HStack>
        <Pressable
          className="p-2 rounded-full bg-background-100"
          onPress={() => router.push("/cart" as never)}
        >
          <Icon as={ShoppingCart} size="md" className="text-typography-900" />
        </Pressable>
      </HStack>

      {/* Search Bar */}
      <Pressable className="bg-background-100 p-3 rounded-xl mb-6 flex-row items-center">
        <Icon as={Search} size="sm" className="text-typography-400 mr-2" />
        <Text className="text-typography-400 flex-1">Search for groceries...</Text>
      </Pressable>

      {/* Main Content */}
      <Center className="flex-1">
        <VStack space="lg" className="items-center">
          <Box className="bg-primary-50 p-6 rounded-full mb-4">
            <Icon as={Store} size="xl" className="text-primary-500" />
          </Box>

          <Heading testID="welcome-title" size="2xl" className="text-center text-typography-900">
            Welcome to Comoi
          </Heading>

          <Text
            testID="welcome-subtitle"
            size="md"
            className="text-center text-typography-500 max-w-[300px]"
          >
            Find and compare prices from local mini-markets in Vietnam
          </Text>

          <VStack space="md" className="w-full mt-6">
            {!isSignedIn ? (
              <>
                <Button
                  size="lg"
                  className="rounded-lg"
                  onPress={() => router.push("/auth/sign-in" as never)}
                >
                  <ButtonText className="font-bold">Sign In</ButtonText>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-lg"
                  onPress={() => router.push("/auth/sign-in" as never)}
                >
                  <ButtonText className="font-bold text-primary-500">Create Account</ButtonText>
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  className="rounded-lg"
                  onPress={() => router.push("/browse" as never)}
                >
                  <ButtonText className="font-bold">Browse Markets</ButtonText>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-lg"
                  onPress={() => router.push("/orders" as never)}
                >
                  <ButtonText className="font-bold text-primary-500">My Orders</ButtonText>
                </Button>
              </>
            )}
          </VStack>
        </VStack>
      </Center>

      {/* Footer */}
      <Box className="items-center">
        <Text size="xs" className="text-typography-400">
          Available in Ho Chi Minh City
        </Text>
      </Box>
    </Box>
  );
}
