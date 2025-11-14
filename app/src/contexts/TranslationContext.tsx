'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

interface TranslationContextType {
  t: (key: string, defaultValue?: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const t = useTranslations();

  const translationFunction = (key: string, defaultValue?: string): string => {
    try {
      return t(key) || defaultValue || key;
    } catch (error) {
      console.error('Translation error:', error);
      return defaultValue || key;
    }
  };

  return (
    <TranslationContext.Provider value={{ t: translationFunction }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
