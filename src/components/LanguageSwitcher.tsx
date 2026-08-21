"use client";

import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { localeLabels, routing } from "@/i18n/routing";

/**
 * Selector de idioma discreto, fijo en la esquina superior derecha.
 */
export default function LanguageSwitcher() {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("language");

  return (
    <nav
      aria-label={t("label")}
      className="animate-fade-in fixed top-7 right-6 z-50 flex items-center gap-2.5 sm:top-9 sm:right-10"
    >
      {routing.locales.map((locale, index) => (
        <Fragment key={locale}>
          {index > 0 && (
            <span aria-hidden="true" className="h-2.5 w-px bg-pearl/20" />
          )}
          <Link
            href={pathname}
            locale={locale}
            lang={locale}
            aria-current={locale === activeLocale ? "true" : undefined}
            className={`text-[0.62rem] tracking-[0.22em] uppercase transition-colors duration-300 ${
              locale === activeLocale
                ? "text-champagne"
                : "text-pearl/40 hover:text-pearl/80"
            }`}
          >
            {localeLabels[locale]}
          </Link>
        </Fragment>
      ))}
    </nav>
  );
}
