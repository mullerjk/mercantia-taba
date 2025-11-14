import { useTranslations } from 'next-intl';

export function useTranslationsHook() {
  const t = useTranslations();

  return {
    t: (key: string, defaultValue?: string) => {
      try {
        return t(key) || defaultValue || key;
      } catch (error) {
        console.error('Translation error:', error);
        return defaultValue || key;
      }
    }
  };
}
