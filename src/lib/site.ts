/**
 * Configuración del sitio que no depende del idioma.
 * Los textos traducibles viven en `messages/{es,en,pt}.json`.
 */
export const site = {
  brand: "Delta Privé",
  contactEmail: "hola@deltaprive.com.ar",
  instagram: "https://instagram.com",

  /**
   * Video del hero (placeholder de stock, Pexels).
   * Para producción: subí tu propio archivo a `public/videos/hero.mp4`
   * y reemplazá estas URLs por "/videos/hero.mp4".
   */
  heroVideo: {
    primary:
      "https://videos.pexels.com/video-files/854318/854318-hd_1920_1080_25fps.mp4",
    fallback:
      "https://videos.pexels.com/video-files/1409899/1409899-hd_1920_1080_25fps.mp4",
  },
} as const;
