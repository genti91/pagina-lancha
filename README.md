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

## Personalización

- **Textos**: `messages/*.json`
- **Marca, email de contacto y video del hero**: `src/lib/site.ts`
- **Paleta y tipografías**: `src/app/globals.css` y `src/app/[locale]/layout.tsx`

El video del hero es un placeholder de stock (Pexels). Para producción, subí el
tuyo a `public/videos/hero.mp4` y cambiá `heroVideo` en `src/lib/site.ts` a
`"/videos/hero.mp4"`.

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
│   ├── actions.ts        Server Action: valida y manda a Google Sheets
│   └── [locale]/
│       ├── layout.tsx    Fuentes, metadata traducida y provider de i18n
│       └── page.tsx      Composición de la landing
├── components/
│   ├── Hero.tsx              100vh con video de fondo y CTA
│   ├── About.tsx             Teaser del proyecto en el astillero
│   ├── WaitlistForm.tsx      Formulario + mensaje de éxito
│   ├── LanguageSwitcher.tsx  ES | EN | PT, arriba a la derecha
│   └── Footer.tsx
└── lib/
    ├── site.ts           Marca, contacto y video
    ├── sheets.ts         Conexión con Google Sheets
    └── waitlist.ts       Tipos y estado del formulario
```

### Sobre los mensajes del formulario

El Server Action nunca devuelve texto ya traducido: devuelve **claves** de
`messages/*.json` (por ejemplo `email` o `server`) y el componente cliente las
traduce con el idioma activo. Así el mismo action sirve para los tres idiomas.
