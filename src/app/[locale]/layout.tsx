import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import {
  alternateOgLocales,
  GEO,
  languageAlternates,
  localeUrl,
  ogLocales,
  SITE_URL,
} from "@/lib/seo";
import { site } from "@/lib/site";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const activo = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: activo, namespace: "meta" });

  const title = t("title");
  const description = t("description");
  const url = localeUrl(activo);

  return {
    // Resuelve las rutas relativas de canonical, hreflang y og:image.
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: site.brand,
    alternates: {
      canonical: url,
      languages: languageAlternates(),
    },
    openGraph: {
      type: "website",
      url,
      siteName: site.brand,
      title,
      description,
      locale: ogLocales[activo],
      alternateLocale: alternateOgLocales(activo),
      // Las imágenes las agrega Next desde `opengraph-image.tsx`.
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    // Ayuda a Google a ubicar el negocio para búsquedas locales.
    other: {
      "geo.region": "AR-B",
      "geo.placename": "Tigre, Buenos Aires",
      "geo.position": `${GEO.latitude};${GEO.longitude}`,
      ICBM: `${GEO.latitude}, ${GEO.longitude}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Necesario para que las páginas se puedan renderizar de forma estática.
  setRequestLocale(locale);

  return (
    /**
     * `suppressHydrationWarning` va solo en <html> y <body>: extensiones como
     * LanguageTool o Grammarly les agregan atributos (data-lt-installed,
     * data-gr-ext-installed) antes de que React hidrate, y eso dispara un
     * falso error de hidratación. Suprime únicamente los atributos de estos
     * dos elementos, no el contenido de la página.
     */
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-abyss font-sans text-pearl"
        suppressHydrationWarning
      >
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
