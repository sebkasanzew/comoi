"use client";

import { SignIn, SignUp } from "@clerk/nextjs";

/**
 * Sign In Form Component
 *
 * Uses Clerk's pre-built SignIn component with custom styling.
 * Supports Email/Password, OAuth (Google, Facebook, Apple), and more.
 */
export function SignInForm() {
  return (
    <div className="w-full max-w-md mx-auto">
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none",
            formButtonPrimary:
              "bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md",
            formFieldInput:
              "border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500",
            footerActionLink: "text-green-600 hover:text-green-700",
          },
        }}
        routing="hash"
        afterSignInUrl="/"
      />
    </div>
  );
}

/**
 * Sign Up Form Component
 *
 * Uses Clerk's pre-built SignUp component with custom styling.
 */
export function SignUpForm() {
  return (
    <div className="w-full max-w-md mx-auto">
      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none",
            formButtonPrimary:
              "bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md",
            formFieldInput:
              "border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500",
            footerActionLink: "text-green-600 hover:text-green-700",
          },
        }}
        routing="hash"
        afterSignUpUrl="/"
      />
    </div>
  );
}
