import { locale as rootLocale } from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * Resuelve el idioma de cada request y carga el diccionario correspondiente.
 * El segmento `[locale]` se lee con `next/root-params` (Next.js 16).
 */
export default getRequestConfig(async ({ locale: requestedLocale }) => {
  const candidate = requestedLocale ?? (await rootLocale());
  const locale = hasLocale(routing.locales, candidate)
    ? candidate
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
