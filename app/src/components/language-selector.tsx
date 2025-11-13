'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

const languages = [
  { code: 'pt' as const, name: 'PT' },
  { code: 'en' as const, name: 'EN' },
  { code: 'es' as const, name: 'ES' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setLanguage(lang.code)}
          className="px-2 py-1 h-8 text-xs"
          title={lang.name}
        >
          {lang.name}
        </Button>
      ))}
    </div>
  );
}
