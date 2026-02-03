import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-800">404</h1>
          <div className="text-6xl mt-4">🔍</div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>

        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-white font-bold shadow-lg hover:bg-emerald-700 transition-colors"
          >
            <span className="text-lg">←</span> Back to Home
          </Link>

          <Link
            href="/todos"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-emerald-700 font-bold shadow-lg border-2 border-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            Go to Todos
          </Link>
        </div>
      </div>
    </div>
  );
}
