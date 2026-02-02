'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '@/lib/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any; // Use any to avoid literal type conflicts between languages
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Detect user's preferred language from browser
function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'en-US';

  // Check localStorage first
  const stored = localStorage.getItem('preferred-language');
  if (stored === 'en-US' || stored === 'pt-BR') {
    return stored as Language;
  }

  // Detect from browser language
  const browserLang = navigator.language || (navigator as any).userLanguage;

  // Check if it's Portuguese (Brazil or Portugal)
  if (browserLang.startsWith('pt')) {
    return 'pt-BR';
  }

  // Default to English
  return 'en-US';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en-US');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Detect language on mount
    const detected = detectLanguage();
    setLanguageState(detected);
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return default during SSR
    return {
      language: 'en-US' as Language,
      setLanguage: () => {},
      t: translations['en-US'],
    };
  }
  return context;
}
