/**
 * Configuración única del sitio.
 * Cambiá acá el nombre de la marca, los textos clave y el video del hero
 * sin tocar los componentes.
 */
export const site = {
  brand: "Delta Privé",
  tagline: "Navegación privada por el Delta del Tigre",
  location: "Delta del Tigre · Buenos Aires",
  title: "La Nueva Experiencia Premium en el Delta",
  subtitle: "Próximamente",
  description:
    "Una embarcación de primer nivel, actualmente en construcción, para recorridos privados y exclusivos por el Delta del Tigre. Sumate a la lista de espera.",
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
