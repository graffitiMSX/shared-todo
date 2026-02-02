import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-orange-50">
      <main className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-gray-800 sm:text-6xl">
            ✨ Shared Todo
          </h1>
          <p className="mt-4 text-xl text-gray-700">
            Plan together, achieve together
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-xl bg-white px-8 py-4 text-gray-900 font-bold shadow-lg border border-gray-900 hover:bg-gray-50 hover:shadow-xl transition-all transform hover:scale-105"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-white px-8 py-4 text-gray-900 font-bold shadow-lg border border-gray-900 hover:bg-gray-50 hover:shadow-xl transition-all transform hover:scale-105"
          >
            Get Started Free
          </Link>
        </div>

        <div className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Everything you need to stay organized
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-green-100">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">Shared Tasks</h3>
              <p className="text-gray-600">
                Create and manage todos together with your partner
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-blue-100">
              <div className="text-3xl mb-3">🔔</div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">Smart Reminders</h3>
              <p className="text-gray-600">
                Set multiple notifications for important tasks
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-orange-100">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">Rich Metadata</h3>
              <p className="text-gray-600">
                Add phone numbers, links, and addresses to tasks
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-purple-100">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">Real-time Sync</h3>
              <p className="text-gray-600">
                Changes sync instantly across all devices
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
