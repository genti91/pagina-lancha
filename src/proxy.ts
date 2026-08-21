import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Detecta el idioma y reescribe la URL al segmento `[locale]`.
 * En Next.js 16 esta convención se llama `proxy` (antes `middleware`).
 */
export default createMiddleware(routing);

export const config = {
  /**
   * Se salta la API, los assets internos de Next y cualquier archivo con
   * extensión (icon.svg, video, etc.). Usamos `[.]` en vez de un punto
   * escapado para que el patrón sea legible.
   */
  matcher: ["/((?!api|_next|_vercel|[^/]*[.][^/]*).*)"],
};
