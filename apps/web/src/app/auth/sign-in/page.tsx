"use client";

import { OAuthButtons, SignInForm } from "@/components/auth";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in to your Comoi account</p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg space-y-6">
          {/* OAuth Buttons */}
          <OAuthButtons />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <SignInForm />
        </div>

        <div className="text-center text-sm text-gray-600">
          <a href="/" className="text-green-600 hover:text-green-500">
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
