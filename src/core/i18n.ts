type Translations = Record<string, string>;

const LANGS = new Set(['de', 'en']);
let translations: Translations = {};

function detectLang(): string {
  const navLang = navigator.language.slice(0, 2).toLowerCase();
  return LANGS.has(navLang) ? navLang : 'de';
}

async function loadTranslations(lang: string): Promise<Translations> {
  switch (lang) {
    case 'en':
      return (await import('../i18n/en.json')).default;
    case 'de':
    default:
      return (await import('../i18n/de.json')).default;
  }
}

export async function initI18n() {
  const lang = detectLang();
  translations = await loadTranslations(lang);
}

export function t(key: string): string {
  return translations[key] || key;
}
