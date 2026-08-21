import { defineRouting } from "next-intl/routing";

export const locales = ["es", "en", "pt"] as const;

export type AppLocale = (typeof locales)[number];

/** Etiquetas del selector de idioma */
export const localeLabels: Record<AppLocale, string> = {
  es: "ES",
  en: "EN",
  pt: "PT",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "es",
  /**
   * "as-needed": el español vive en `/` y los otros idiomas en `/en` y `/pt`.
   */
  localePrefix: "as-needed",
});
