"use client";

import Link from "next/link";
import { AuthGate } from "@/components/auth";

function VendorDashboard() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-green-600 hover:text-green-700">
                ← Comoi
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Vendor Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Today&apos;s Orders</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Products</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Revenue (VND)</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              type="button"
              className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">📦</span>
              <h3 className="mt-2 font-medium text-gray-900">Add Product</h3>
              <p className="text-sm text-gray-500">Add a new product to your catalog</p>
            </button>

            <button
              type="button"
              className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">💰</span>
              <h3 className="mt-2 font-medium text-gray-900">Update Prices</h3>
              <p className="text-sm text-gray-500">Adjust product pricing</p>
            </button>

            <button
              type="button"
              className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">📋</span>
              <h3 className="mt-2 font-medium text-gray-900">View Orders</h3>
              <p className="text-sm text-gray-500">Manage incoming orders</p>
            </button>

            <button
              type="button"
              className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">⚙️</span>
              <h3 className="mt-2 font-medium text-gray-900">Settings</h3>
              <p className="text-sm text-gray-500">Configure your store</p>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function VendorSignInPrompt() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900">Comoi Vendor Dashboard</h1>
        <p className="mt-4 text-gray-600">
          Manage your mini-market products and orders. Sign in to access your dashboard.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/sign-in"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/vendor/register"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Register Your Store
          </Link>
        </div>
        <div className="mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Comoi
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function VendorPage() {
  return (
    <AuthGate fallback={<VendorSignInPrompt />}>
      <VendorDashboard />
    </AuthGate>
  );
}
