import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <main className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Shared Todo
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Plan together, achieve together
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-lg bg-primary-600 px-8 py-3 text-white font-medium shadow-lg hover:bg-primary-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-white px-8 py-3 text-primary-600 font-medium shadow-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors"
          >
            Get Started
          </Link>
        </div>

        <div className="mt-16 max-w-2xl">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">Shared Tasks</h3>
              <p className="text-gray-600">
                Create and manage todos together with your partner
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">Smart Reminders</h3>
              <p className="text-gray-600">
                Set multiple notifications for important tasks
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">Rich Metadata</h3>
              <p className="text-gray-600">
                Add phone numbers, links, and addresses to tasks
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">Real-time Sync</h3>
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
