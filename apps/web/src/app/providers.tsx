"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set");
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

/**
 * Convex + Clerk Provider for client-side components
 *
 * Wraps the application with:
 * - ClerkProvider for authentication
 * - ConvexProviderWithClerk for database access with Clerk auth
 */
export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
