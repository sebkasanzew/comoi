import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud";
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
}

const convex = new ConvexReactClient(CONVEX_URL, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
        <ClerkLoaded>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <Stack>
              <Stack.Screen name="index" options={{ title: "Comoi" }} />
              <Stack.Screen name="auth/sign-in" options={{ title: "Sign In" }} />
            </Stack>
          </ConvexProviderWithClerk>
        </ClerkLoaded>
      </ClerkProvider>
    </GluestackUIProvider>
  );
}
