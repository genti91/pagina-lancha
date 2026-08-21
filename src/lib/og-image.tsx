import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

/**
 * Tarjeta que se ve al compartir el link por WhatsApp, Instagram, Facebook,
 * LinkedIn o X. La comparten `opengraph-image` y `twitter-image`.
 *
 * Se dibuja con `next/og` en vez de subir un JPG: así el texto sale en el
 * idioma de cada versión y se actualiza solo si cambia el copy.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ABYSS = "#04080d";
const CHAMPAGNE = "#c8a96a";
const CHAMPAGNE_SOFT = "#e7d8b4";
const PEARL = "#f2efe8";

export async function ogAlt(locale: string) {
  const activo = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: activo, namespace: "meta" });
  return t("ogAlt");
}

export async function ogImage(locale: string) {
  const activo = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const hero = await getTranslations({ locale: activo, namespace: "hero" });

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ABYSS,
        // Viñeta, para que el marco no quede plano
        backgroundImage: `radial-gradient(circle at 50% 40%, #0f2032 0%, ${ABYSS} 70%)`,
        color: PEARL,
        position: "relative",
      }}
    >
      {/* Marco fino en champagne */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          right: 40,
          bottom: 40,
          border: `1px solid ${CHAMPAGNE}55`,
          display: "flex",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontSize: 22,
          letterSpacing: 10,
          textTransform: "uppercase",
          color: CHAMPAGNE,
        }}
      >
        <div
          style={{ width: 46, height: 1, backgroundColor: `${CHAMPAGNE}88` }}
        />
        <div style={{ display: "flex" }}>{hero("location")}</div>
        <div
          style={{ width: 46, height: 1, backgroundColor: `${CHAMPAGNE}88` }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 46,
          textAlign: "center",
          padding: "0 90px",
        }}
      >
        <div style={{ display: "flex", fontSize: 66, lineHeight: 1.18 }}>
          {hero("titleLine1")}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 66,
            lineHeight: 1.18,
            color: CHAMPAGNE_SOFT,
            marginTop: 8,
          }}
        >
          {hero("titleLine2")}
        </div>
      </div>

      <div
        style={{
          width: 90,
          height: 1,
          backgroundColor: `${PEARL}33`,
          marginTop: 54,
        }}
      />

      <div
        style={{
          display: "flex",
          marginTop: 26,
          fontSize: 21,
          letterSpacing: 14,
          textTransform: "uppercase",
          color: `${PEARL}99`,
        }}
      >
        {hero("subtitle")}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 74,
          display: "flex",
          fontSize: 20,
          letterSpacing: 9,
          textTransform: "uppercase",
          color: `${PEARL}cc`,
        }}
      >
        {site.brand}
      </div>
    </div>,
    size,
  );
}
