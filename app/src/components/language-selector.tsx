'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

const languages = [
  { code: 'pt' as const, name: 'PT' },
  { code: 'en' as const, name: 'EN' },
  { code: 'es' as const, name: 'ES' },
];

export function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    // With localePrefix: 'as-needed', next-intl handles the URL automatically
    // Force a page reload to change locale
    window.location.href = `/?locale=${newLocale}`;
  };

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={locale === lang.code ? "secondary" : "ghost"}
          size="sm"
          onClick={() => handleLanguageChange(lang.code)}
          className="px-2 py-1 h-8 text-xs"
          title={lang.name}
        >
          {lang.name}
        </Button>
      ))}
    </div>
  );
}
