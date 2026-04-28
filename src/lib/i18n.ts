import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { userI18nResources } from '@/lib/i18n-resources';

const LOCALE_COOKIE = 'nexploring-lang';
const SUPPORTED = ['en-US', 'pt-BR', 'es-ES'] as const;
export type SupportedLocale = (typeof SUPPORTED)[number];

function getPersistedLocale(): SupportedLocale {
  try {
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    if (urlLang && (SUPPORTED as readonly string[]).includes(urlLang)) {
      return urlLang as SupportedLocale;
    }
    const match = document.cookie.split(';').find((c) => c.trim().startsWith(`${LOCALE_COOKIE}=`));
    const cookieLang = match?.split('=')?.[1]?.trim();
    if (cookieLang && (SUPPORTED as readonly string[]).includes(cookieLang)) {
      return cookieLang as SupportedLocale;
    }
  } catch {
    // SSR or restricted environment
  }
  return 'en-US';
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: userI18nResources,
    lng: getPersistedLocale(),
    fallbackLng: 'en-US',
    supportedLngs: [...SUPPORTED],
    ns: ['profile'],
    defaultNS: 'profile',
    react: { useSuspense: false },
    interpolation: { escapeValue: false },
  });
}

if (typeof window !== 'undefined' && !(window as { __nexploringUserLocaleBound?: boolean }).__nexploringUserLocaleBound) {
  (window as { __nexploringUserLocaleBound?: boolean }).__nexploringUserLocaleBound = true;
  window.addEventListener('nexploring:locale-changed', (e) => {
    const locale = (e as CustomEvent<{ locale: string }>).detail.locale;
    if ((SUPPORTED as readonly string[]).includes(locale)) {
      void i18n.changeLanguage(locale);
    }
  });
}

export default i18n;
