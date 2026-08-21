import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
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
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: site.brand,
      type: "website",
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
