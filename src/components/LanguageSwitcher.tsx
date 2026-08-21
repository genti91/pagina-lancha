"use client";

import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { localeLabels, routing } from "@/i18n/routing";

/**
 * Selector de idioma discreto. No se posiciona a sí mismo: lo ubica quien lo
 * usa (la barra superior del hero y el pie de página), así nunca queda
 * flotando encima de otro elemento.
 */
export default function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("language");

  return (
    <nav
      aria-label={t("label")}
      className={`flex shrink-0 items-center gap-2.5 ${className}`}
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
