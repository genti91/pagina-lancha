import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Detecta el idioma y reescribe la URL al segmento `[locale]`.
 * En Next.js 16 esta convención se llama `proxy` (antes `middleware`).
 */
export default createMiddleware(routing);

export const config = {
  /**
   * Se salta la API, los assets internos de Next y cualquier ruta que
   * contenga un punto en algún tramo, o sea todos los archivos de `public/`:
   * icon.svg, videos/hero.mp4, imagenes/foto.jpg, etc.
   *
   * El `.*[.].*` tiene que mirar la ruta completa, no solo el primer tramo:
   * si no, `/videos/hero.mp4` entra al proxy y termina redirigido a
   * `/en/videos/hero.mp4`, que no existe. Usamos `[.]` en vez de un punto
   * escapado para que se lea mejor.
   */
  matcher: ["/((?!api|_next|_vercel|.*[.].*).*)"],
};
