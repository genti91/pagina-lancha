import { routing, type AppLocale } from "@/i18n/routing";

/**
 * Dominio público del sitio. Es lo único que hay que cambiar para que las URLs
 * canónicas, los hreflang, el sitemap y las tarjetas de Open Graph apunten bien.
 *
 * El valor por defecto es el dominio actual de Vercel. El día que se conecte
 * un dominio propio, definí `NEXT_PUBLIC_SITE_URL` (en Vercel: Project →
 * Settings → Environment Variables) en vez de tocar este archivo. Una canónica
 * apuntando al dominio equivocado le dice a Google que indexe otro sitio, así
 * que este valor importa.
 *
 * La barra final se saca sola, por si la variable viene copiada del navegador.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://brouard-delta.vercel.app"
).replace(/\/+$/, "");

/**
 * Ruta de un idioma. El español es el idioma por defecto y vive en la raíz
 * (`localePrefix: "as-needed"`), así que no lleva prefijo.
 */
export function localePath(locale: AppLocale): string {
  return locale === routing.defaultLocale ? "/" : `/${locale}`;
}

/** URL absoluta de un idioma, para canónicas, hreflang y sitemap */
export function localeUrl(locale: AppLocale): string {
  const path = localePath(locale);
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/**
 * Mapa de hreflang para `alternates.languages`.
 *
 * Se declaran los códigos regionales además de los genéricos: `es-AR` le dice
 * a Google que esta versión apunta a la Argentina, y `es` cubre al resto de los
 * hispanohablantes. `x-default` marca a dónde mandar al que no coincide con
 * ningún idioma declarado.
 */
export function languageAlternates(): Record<string, string> {
  return {
    es: localeUrl("es"),
    "es-AR": localeUrl("es"),
    en: localeUrl("en"),
    pt: localeUrl("pt"),
    "pt-BR": localeUrl("pt"),
    "x-default": localeUrl(routing.defaultLocale),
  };
}

/** Etiqueta `og:locale` completa para cada idioma */
export const ogLocales: Record<AppLocale, string> = {
  es: "es_AR",
  en: "en_US",
  pt: "pt_BR",
};

/** Los otros idiomas, para `og:locale:alternate` */
export function alternateOgLocales(current: AppLocale): string[] {
  return routing.locales
    .filter((locale) => locale !== current)
    .map((locale) => ogLocales[locale]);
}

/** Coordenadas aproximadas de la Estación Fluvial de Tigre, punto de partida */
export const GEO = {
  latitude: -34.4189,
  longitude: -58.5797,
} as const;
