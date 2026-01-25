"use client";

import { SignInButton } from "@clerk/nextjs";

/**
 * OAuth Sign In Buttons
 *
 * Uses Clerk's SignInButton which automatically handles OAuth providers
 * configured in the Clerk dashboard.
 *
 * Note: OAuth providers (Google, Facebook, Apple) should be configured
 * in the Clerk Dashboard at https://dashboard.clerk.com
 */
export function OAuthButtons() {
  return (
    <div className="space-y-3">
      <SignInButton mode="modal">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          Continue with Social Login
        </button>
      </SignInButton>
      <p className="text-xs text-gray-500 text-center">
        Google, Facebook, and Apple sign-in available
      </p>
    </div>
  );
}
