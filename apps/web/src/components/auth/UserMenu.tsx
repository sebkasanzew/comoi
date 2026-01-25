"use client";

import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

/**
 * User Menu Component
 *
 * Shows Clerk's UserButton when authenticated, sign in/up buttons otherwise
 */
export function UserMenu() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />;
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <SignInButton mode="modal">
        <button type="button" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2">
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button
          type="button"
          className="text-sm bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded-md"
        >
          Sign Up
        </button>
      </SignUpButton>
    </div>
  );
}

/**
 * Auth Gate Component
 *
 * Shows different content based on authentication state
 */
export function AuthGate({
  children,
  fallback,
  loading,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return loading ?? <div className="animate-pulse">Loading...</div>;
  }

  if (isSignedIn) {
    return children;
  }

  return (
    fallback ?? (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Please sign in to continue</p>
        <SignInButton mode="modal">
          <button
            type="button"
            className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md"
          >
            Sign In
          </button>
        </SignInButton>
      </div>
    )
  );
}
