'use client';

import { useLanguage } from '@/lib/providers/language-provider';
import { Language } from '@/lib/i18n/translations';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en-US', label: 'English', flag: '🇺🇸' },
    { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
  ];

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          title={lang.label}
          className={`flex items-center justify-center w-10 h-10 rounded-lg text-2xl transition-all ${
            language === lang.code
              ? 'bg-primary-600 shadow-md ring-2 ring-primary-300'
              : 'bg-white border border-gray-300 hover:border-primary-400 hover:shadow-sm'
          }`}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}
