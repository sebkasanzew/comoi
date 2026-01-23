import "../global.css";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";

const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud";

const convex = new ConvexReactClient(CONVEX_URL, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Comoi" }} />
      </Stack>
    </ConvexProvider>
  );
}
