# Delta Privé — Teaser Landing Page

Landing page de expectativa para un servicio de navegación privada por el Delta
del Tigre (Buenos Aires). La embarcación está en construcción, así que la página
captura interesados en una lista de espera.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **framer-motion** para las animaciones
- **lucide-react** para los iconos
- **next-intl** para el multilenguaje (es / en / pt)
- **google-spreadsheet** para guardar los interesados en Google Sheets

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí http://localhost:3000

> Antes de que el formulario funcione hay que conectar la planilla de Google:
> ver **[SETUP-GOOGLE-SHEETS.md](./SETUP-GOOGLE-SHEETS.md)**.

Para verificar que la conexión con Google Sheets está bien configurada:

```bash
npm run check:sheets
```

## Idiomas

| Idioma    | URL   |
| --------- | ----- |
| Español   | `/`   |
| Inglés    | `/en` |
| Portugués | `/pt` |

El español es el idioma por defecto y por eso vive en la raíz, sin prefijo.

Al entrar por primera vez, la página detecta el idioma del navegador y redirige
al que corresponda (un visitante con el navegador en inglés cae en `/en`). Si el
visitante elige un idioma con el selector de arriba a la derecha, la elección
queda guardada en una cookie.

Para que `/` sea **siempre** español sin importar el navegador, agregá
`localeDetection: false` en `src/i18n/routing.ts`.

### Editar o agregar textos

Todos los textos están en `messages/es.json`, `messages/en.json` y
`messages/pt.json`. Los tres archivos tienen exactamente las mismas claves.

Para agregar un idioma:

1. Copiá `messages/es.json` a `messages/<código>.json` y traducilo.
2. Agregá el código a `locales` y su etiqueta a `localeLabels` en
   `src/i18n/routing.ts`.

## Los datos de los interesados

Cada envío del formulario agrega una fila a la planilla de Google configurada
en el `.env.local`:

| Fecha                | Nombre | Apellido  | Email             | Telefono           | Idioma |
| -------------------- | ------ | --------- | ----------------- | ------------------ | ------ |
| 2026-08-21T01:38:36Z | Lucía  | Fernández | lucia@example.com | +54 9 11 5555-1234 | es     |

- Los encabezados se crean solos la primera vez.
- No se duplican filas con el mismo email.
- La columna `Idioma` guarda en qué idioma navegó la persona, útil para saber en
  qué idioma contactarla.

Como no se escribe nada en disco, funciona sin cambios en Vercel o cualquier
entorno serverless.

## SEO

> **Antes de deployar:** definí `NEXT_PUBLIC_SITE_URL` con el dominio real, sin
> barra final. De ahí salen las URLs canónicas, los `hreflang`, el sitemap y las
> tarjetas de Open Graph. Si queda el valor por defecto, le estás diciendo a
> Google que indexe otro dominio.

| Qué                                                      | Dónde                                     |
| -------------------------------------------------------- | ----------------------------------------- |
| Títulos, descripciones, canónica, hreflang, OG y Twitter | `src/app/[locale]/layout.tsx`             |
| Textos indexables (título, descripción, `og:image:alt`)  | `messages/*.json`, clave `meta`           |
| Datos estructurados (JSON-LD)                            | `src/components/JsonLd.tsx`               |
| Tarjeta que se ve al compartir el link                   | `src/lib/og-image.tsx`                    |
| Dominio, coordenadas y hreflang                          | `src/lib/seo.ts`                          |
| `sitemap.xml` y `robots.txt`                             | `src/app/sitemap.ts`, `src/app/robots.ts` |

### Datos estructurados

Se emite un `@graph` con cuatro nodos enlazados por `@id`: `TravelAgency` (el
negocio, con área de servicio, coordenadas e idiomas), `TouristAttraction` (el
Delta del Tigre), `TouristTrip` (la experiencia) y `WebSite`.

No se usa `BoatReservation`: ese tipo modela una reserva concreta ya hecha, con
su número y su pasajero, no un servicio que se ofrece. Ponerlo en una landing
sería declarar una reserva inventada.

Para validar después de deployar: [Rich Results Test](https://search.google.com/test/rich-results)
y [Schema Markup Validator](https://validator.schema.org/).

### Tarjeta de Open Graph

Se dibuja con `next/og` en vez de subir un JPG, así el texto sale en el idioma
de cada versión y se actualiza solo si cambia el copy. Hay una por idioma, en
1200×630.

Usa la tipografía por defecto de `next/og`, no Playfair Display: para que salga
en la serif de la marca hay que dejar un `.ttf` en el repo y pasárselo en
`fonts` a `ImageResponse`.

### Rendimiento

El video del hero sale con `preload="none"` y recién se pide después del evento
`load` de la página (`src/components/HeroVideo.tsx`). Así no compite por ancho
de banda con lo que pinta el Largest Contentful Paint, que en esta página es el
título del hero.

No hay ninguna imagen de contenido todavía: los únicos gráficos son iconos SVG
en línea de `lucide-react`, que van marcados `aria-hidden` porque el texto que
los acompaña ya dice lo mismo. `next.config.ts` deja AVIF y WebP configurados
para cuando se sumen fotos de la lancha.

## Personalización

- **Textos**: `messages/*.json`
- **Marca, email de contacto y video del hero**: `src/lib/site.ts`
- **Paleta y tipografías**: `src/app/globals.css` y `src/app/[locale]/layout.tsx`

### El video del hero

Se sirve desde `public/videos/hero.mp4`. Para cambiarlo alcanza con reemplazar
ese archivo — no hay que tocar código. Si le querés poner otro nombre, está en
`heroVideo` dentro de `src/lib/site.ts`.

Recomendaciones para el archivo:

- **Sin audio** (el video va muteado igual) y de **5 a 10 segundos**, cortado
  para que el loop no se note.
- **720p o 1080p** alcanza: encima lleva tres capas de oscurecimiento.
- **Menos de 3 MB.** Es lo primero que carga la página y suele verse desde el
  celular. Si el tuyo pesa más, recomprimilo:

  ```bash
  ffmpeg -i original.mp4 -an -vf scale=1280:-2 -c:v libx264 -crf 30 -preset slow -movflags +faststart public/videos/hero.mp4
  ```

  `-an` saca el audio y `-movflags +faststart` deja los metadatos al principio
  para que empiece a reproducirse sin bajar el archivo entero.

Mientras el video carga se ve el fondo `abyss` de la paleta, así que no hay
ningún destello blanco.

#### El loop sin corte

Un `<video loop>` común vuelve al principio de golpe y el salto se nota.
`src/components/HeroVideo.tsx` monta **dos copias superpuestas** del mismo
archivo: cuando a la que se ve le queda un segundo para terminar, arranca la
otra desde cero y hace un fundido entre las dos. El empalme queda escondido
adentro del cruce.

Dos valores en `src/lib/site.ts` controlan el efecto:

| Valor                  | Qué hace                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heroCrossfadeSeconds` | Duración del fundido. Más alto = más suave, pero el ciclo se acorta (con un clip de 5s y 1s de cruce, el ciclo real es de 4s). `0` vuelve al corte seco. |
| `heroPlaybackRate`     | Velocidad. Bajarla a `0.7` alarga el ciclo y espacia los fundidos, además de darle un aire más tranquilo.                                                |

El navegador descarga el video una sola vez: la segunda copia lo reusa desde
la caché.

## Estructura

```
messages/
├── es.json               Textos en español (idioma por defecto)
├── en.json               Textos en inglés
└── pt.json               Textos en portugués

src/
├── proxy.ts              Detecta el idioma y reescribe a /[locale]
├── i18n/
│   ├── routing.ts        Idiomas disponibles y estrategia de prefijos
│   ├── navigation.ts     Link y useRouter que conocen el idioma
│   └── request.ts        Carga el diccionario de cada request
├── app/
│   ├── favicon.ico       Ancla náutica (navegadores viejos)
│   ├── icon.svg          Ancla náutica (navegadores modernos)
│   ├── globals.css       Paleta (abyss / navy / champagne / pearl)
│   ├── sitemap.ts        sitemap.xml con las tres variantes de idioma
│   ├── robots.ts         robots.txt apuntando al sitemap
│   ├── actions.ts        Server Action: valida y manda a Google Sheets
│   └── [locale]/
│       ├── layout.tsx        Fuentes, metadata SEO completa y provider de i18n
│       ├── opengraph-image.tsx Tarjeta para compartir (por idioma)
│       ├── twitter-image.tsx   Idem para Twitter/X
│       └── page.tsx            Composición de la landing
├── components/
│   ├── Hero.tsx              100vh con video de fondo y CTA
│   ├── HeroVideo.tsx         Loop del video con fundido en el empalme
│   ├── TopBar.tsx            Marca + selector de idioma, en una sola fila
│   ├── About.tsx             Teaser del proyecto en el astillero
│   ├── WaitlistForm.tsx      Formulario + mensaje de éxito
│   ├── LanguageSwitcher.tsx  ES | EN | PT (lo ubica quien lo usa)
│   ├── JsonLd.tsx            Datos estructurados schema.org
│   └── Footer.tsx
└── lib/
    ├── site.ts           Marca, contacto y video
    ├── seo.ts            Dominio, hreflang y coordenadas
    ├── og-image.tsx      Diseño de la tarjeta para compartir
    ├── sheets.ts         Conexión con Google Sheets
    └── waitlist.ts       Tipos y estado del formulario
```

### Sobre los mensajes del formulario

El Server Action nunca devuelve texto ya traducido: devuelve **claves** de
`messages/*.json` (por ejemplo `email` o `server`) y el componente cliente las
traduce con el idioma activo. Así el mismo action sirve para los tres idiomas.
