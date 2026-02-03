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
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          title={lang.label}
          className={`text-2xl p-1 transition-all ${
            language === lang.code
              ? 'opacity-100 scale-110'
              : 'opacity-60 hover:opacity-100 hover:scale-105'
          }`}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}
