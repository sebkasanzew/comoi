"use client";

import Link from "next/link";
import { UserMenu } from "@/components/auth";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-600">Comoi</h1>
          <UserMenu />
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-green-50 to-white">
        <h2 className="text-4xl font-bold text-center text-gray-900">Welcome to Comoi</h2>
        <p className="mt-4 text-lg text-gray-600 text-center max-w-xl">
          Grocery marketplace connecting you with local mini-markets in Vietnam.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/products"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Products
          </Link>
          <Link
            href="/vendor"
            className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
          >
            For Vendors
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          © 2026 Comoi. Made with ❤️ in Vietnam.
        </div>
      </footer>
    </main>
  );
}
