import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { languageAlternates, localeUrl } from "@/lib/seo";

/**
 * Sitemap con las tres variantes de idioma.
 *
 * Cada URL declara sus alternativas en `alternates.languages`, que es lo que
 * Google pide para entender que son la misma página en distintos idiomas y no
 * contenido duplicado.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = languageAlternates();
  const lastModified = new Date();

  return routing.locales.map((locale) => ({
    url: localeUrl(locale),
    lastModified,
    changeFrequency: "weekly",
    // El español es el idioma principal del negocio (Tigre, Buenos Aires).
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
