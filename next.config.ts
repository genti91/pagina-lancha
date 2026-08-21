import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    /**
     * Formatos que sirve `next/image`. AVIF primero (pesa menos), WebP como
     * respaldo y el original para el resto. Hoy la landing no tiene ninguna
     * imagen de contenido, pero deja el terreno listo para cuando se sumen
     * fotos de la lancha.
     */
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
