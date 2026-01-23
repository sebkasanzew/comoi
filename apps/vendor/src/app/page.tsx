export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-center">Comoi Vendor Dashboard</h1>
      <p className="mt-4 text-lg text-gray-600 text-center">
        Manage your mini-market products and orders.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
        <button
          type="button"
          className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Register Your Store
        </button>
      </div>
    </main>
  );
}
