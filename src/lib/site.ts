/**
 * Configuración del sitio que no depende del idioma.
 * Los textos traducibles viven en `messages/{es,en,pt}.json`.
 */
export const site = {
  brand: "Delta Privé",
  contactEmail: "hola@deltaprive.com.ar",
  instagram: "https://instagram.com",

  /**
   * Video de fondo del hero. Vive en `public/videos/`, así que se sirve
   * desde el mismo dominio: para cambiarlo alcanza con reemplazar el archivo.
   */
  heroVideo: "/videos/hero.mp4",

  /**
   * Segundos que dura el fundido entre el final del loop y el principio.
   * Más alto = transición más suave, pero el ciclo se acorta (el video
   * siguiente arranca antes). Con un clip de 5s, 1s de cruce da un ciclo
   * efectivo de 4s. Poner 0 vuelve al corte seco.
   */
  heroCrossfadeSeconds: 1,

  /**
   * Velocidad de reproducción. Bajarla a 0.6 - 0.8 alarga el ciclo y le da
   * un aire más tranquilo al fondo, algo habitual en videos de hero.
   */
  heroPlaybackRate: 1,
} as const;
