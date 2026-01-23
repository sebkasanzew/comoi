export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-center">Welcome to Comoi</h1>
      <p className="mt-4 text-lg text-gray-600 text-center">
        Grocery marketplace connecting you with local mini-markets in Vietnam.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Browse Products
        </button>
        <button
          type="button"
          className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
        >
          For Vendors
        </button>
      </div>
    </main>
  );
}
