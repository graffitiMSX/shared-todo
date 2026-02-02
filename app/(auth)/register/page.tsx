'use client';

import { RegisterForm } from '@/components/auth/RegisterForm';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 px-4 py-12">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <RegisterForm />
    </div>
  );
}
