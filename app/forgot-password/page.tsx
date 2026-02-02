import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-xl">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <span className="text-lg">←</span> Back to Sign In
        </Link>

        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">
            Reset Password 🔑
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Password reset feature coming soon!
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
          <p className="text-sm text-gray-700">
            This feature is currently under development. For now, please contact support if you need to reset your password.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/login"
            className="block w-full text-center rounded-xl bg-gray-900 px-6 py-3 text-white font-bold shadow-lg hover:bg-gray-800 transition-colors"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
