import { routing, type AppLocale } from "@/i18n/routing";
import { GEO, localeUrl, SITE_URL } from "@/lib/seo";
import { EMAIL_DE_EJEMPLO, site } from "@/lib/site";

/**
 * Datos estructurados (JSON-LD) para Google.
 *
 * Se emite un `@graph` con cuatro nodos enlazados entre sí por `@id`, que es
 * como Google prefiere leer varias entidades de una misma página:
 *
 * - `TravelAgency` (subtipo de LocalBusiness): quién presta el servicio, dónde
 *   opera y en qué idiomas atiende.
 * - `TouristAttraction`: el Delta del Tigre, el lugar que se visita.
 * - `TouristTrip`: la experiencia en sí, con su proveedor y su destino.
 * - `WebSite`: la página, en sus tres idiomas.
 *
 * Nota sobre `BoatReservation`: ese tipo modela una reserva concreta ya hecha
 * (con su número, su pasajero y su fecha), no un servicio que se ofrece. Usarlo
 * acá describiría una reserva inventada, así que el equivalente correcto para
 * una landing es `TouristTrip` + el `provider`.
 */

type Props = { locale: AppLocale };

const AGENCIA = `${SITE_URL}/#agencia`;
const ATRACCION = `${SITE_URL}/#delta-tigre`;
const EXPERIENCIA = `${SITE_URL}/#experiencia`;
const SITIO = `${SITE_URL}/#sitio`;

export default function JsonLd({ locale }: Props) {
  const url = localeUrl(locale);

  const grafo = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": AGENCIA,
        name: site.brand,
        description:
          "Paseos y excursiones privadas en lancha por el Delta del Tigre, Buenos Aires. Embarcación propia, grupos reducidos y rutas curadas.",
        url: SITE_URL,
        // Solo se declara el email cuando ya es el de verdad.
        ...(site.contactEmail === EMAIL_DE_EJEMPLO
          ? {}
          : { email: site.contactEmail }),
        image: `${SITE_URL}/opengraph-image`,
        logo: `${SITE_URL}/icon.svg`,
        // Sin calle: la embarcación está en construcción y no hay todavía una
        // dirección física que declarar. Se informa la localidad, que es lo que
        // Google usa para el posicionamiento local.
        address: {
          "@type": "PostalAddress",
          addressLocality: "Tigre",
          addressRegion: "Buenos Aires",
          addressCountry: "AR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: GEO.latitude,
          longitude: GEO.longitude,
        },
        areaServed: [
          {
            "@type": "Place",
            name: "Delta del Paraná",
          },
          {
            "@type": "AdministrativeArea",
            name: "Partido de Tigre, Provincia de Buenos Aires, Argentina",
          },
        ],
        knowsLanguage: ["es-AR", "en", "pt-BR"],
        availableLanguage: [
          { "@type": "Language", name: "Spanish", alternateName: "es" },
          { "@type": "Language", name: "English", alternateName: "en" },
          { "@type": "Language", name: "Portuguese", alternateName: "pt" },
        ],
        currenciesAccepted: "ARS",
        slogan: "Navegación privada por el Delta del Tigre",
      },
      {
        "@type": "TouristAttraction",
        "@id": ATRACCION,
        name: "Delta del Tigre",
        description:
          "Laberinto de ríos y arroyos sobre el Delta del Paraná, a menos de una hora de la Ciudad de Buenos Aires.",
        url,
        touristType: [
          "Turismo náutico",
          "Escapadas de un día",
          "Viajes privados",
          "Parejas",
          "Grupos reducidos",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Tigre",
          addressRegion: "Buenos Aires",
          addressCountry: "AR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: GEO.latitude,
          longitude: GEO.longitude,
        },
        isAccessibleForFree: false,
        availableLanguage: ["es", "en", "pt"],
      },
      {
        "@type": "TouristTrip",
        "@id": EXPERIENCIA,
        name: "Paseo privado en lancha por el Delta del Tigre",
        description:
          "Navegación privada por los ríos y arroyos del Delta del Tigre en una embarcación a estrenar, con salidas para grupos reducidos y recorridos armados a medida.",
        url,
        provider: { "@id": AGENCIA },
        touristType: ["Viajeros que buscan experiencias privadas"],
        itinerary: {
          "@type": "ItemList",
          numberOfItems: 1,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: { "@id": ATRACCION },
            },
          ],
        },
        subjectOf: { "@id": SITIO },
      },
      {
        "@type": "WebSite",
        "@id": SITIO,
        name: site.brand,
        url: SITE_URL,
        inLanguage: [...routing.locales],
        publisher: { "@id": AGENCIA },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // El contenido es un objeto propio, no entra nada del usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(grafo) }}
    />
  );
}
