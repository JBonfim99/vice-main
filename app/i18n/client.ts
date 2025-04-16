"use client";

import { useLanguage } from "./LanguageContext";
import { translations } from "./translations";

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export function useTranslations() {
  const { language } = useLanguage();

  return (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };
}
