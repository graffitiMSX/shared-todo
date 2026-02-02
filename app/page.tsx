'use client';

import Link from "next/link";
import { useLanguage } from "@/lib/providers/language-provider";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-orange-50">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <main className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-gray-800 sm:text-6xl">
            ✨ {t.landing.title}
          </h1>
          <p className="mt-4 text-xl text-gray-700">
            {t.landing.subtitle}
          </p>
        </div>

        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          {t.landing.description}
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-xl bg-white px-8 py-4 text-gray-900 font-bold shadow-lg border border-gray-900 hover:bg-gray-50 hover:shadow-xl transition-all transform hover:scale-105"
          >
            {t.landing.signIn}
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-white px-8 py-4 text-gray-900 font-bold shadow-lg border border-gray-900 hover:bg-gray-50 hover:shadow-xl transition-all transform hover:scale-105"
          >
            {t.landing.getStarted}
          </Link>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3 max-w-4xl">
          <div className="rounded-xl bg-white p-6 shadow-md border-2 border-green-200">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-bold text-gray-800">{t.landing.features.sharing.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{t.landing.features.sharing.description}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md border-2 border-orange-200">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-lg font-bold text-gray-800">{t.landing.features.notifications.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{t.landing.features.notifications.description}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md border-2 border-blue-200">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-gray-800">{t.landing.features.organize.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{t.landing.features.organize.description}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
