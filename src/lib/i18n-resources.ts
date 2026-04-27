import profileEnUS from '@/locales/en-US/profile.json';
import profileEsES from '@/locales/es-ES/profile.json';
import profilePtBR from '@/locales/pt-BR/profile.json';

export const userI18nResources = {
  'en-US': { profile: profileEnUS },
  'es-ES': { profile: profileEsES },
  'pt-BR': { profile: profilePtBR },
} as const;
