import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const LOCALE_COOKIE = 'atlas-lang';
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

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: getPersistedLocale(),
    fallbackLng: 'en-US',
    supportedLngs: SUPPORTED,
    ns: ['profile'],
    defaultNS: 'profile',
    backend: { loadPath: `${__webpack_public_path__}locales/{{lng}}/{{ns}}.json` },
    interpolation: { escapeValue: false },
  });

// React immediately to locale changes dispatched by the shell LocaleSwitcher
window.addEventListener('atlas:locale-changed', (e) => {
  const locale = (e as CustomEvent<{ locale: string }>).detail.locale;
  if ((SUPPORTED as readonly string[]).includes(locale)) {
    void i18n.changeLanguage(locale);
  }
});

export default i18n;
