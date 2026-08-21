# Delta Privé — Teaser Landing Page

Landing page de expectativa para un servicio de navegación privada premium
por el Delta del Tigre (Buenos Aires). La embarcación está en construcción,
así que la página captura interesados en una lista de espera.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **framer-motion** para las animaciones
- **lucide-react** para los iconos

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí http://localhost:3000

## Los datos de los interesados

Cada envío del formulario agrega una fila al archivo **`interesados.csv`**
en la raíz del proyecto (se crea solo la primera vez):

```
Fecha,Nombre,Apellido,Email,Telefono
2026-08-20T18:42:11.000Z,Lucía,Fernández,lucia@example.com,+54 9 11 5555-1234
```

- Se puede abrir directamente con Excel (lleva BOM UTF-8, así que los acentos
  se ven bien).
- Los valores con comas o comillas se escapan según el estándar CSV.
- No se duplican filas con el mismo email.
- El archivo está en `.gitignore` porque contiene datos personales.

> **Importante:** al escribir en el sistema de archivos, esto funciona en un
> servidor propio o VPS (`npm run build && npm start`). En plataformas
> serverless como Vercel el disco es efímero: ahí conviene reemplazar el
> `appendFile` de `src/app/actions.ts` por una base de datos o una hoja de
> Google Sheets.

## Personalización

Casi todo lo editable vive en **`src/lib/site.ts`**: marca, textos del hero,
email de contacto y la URL del video de fondo.

El video del hero es un placeholder de stock (Pexels). Para producción, subí
el tuyo a `public/videos/hero.mp4` y cambiá `heroVideo` en `src/lib/site.ts`
a `"/videos/hero.mp4"`.

## Estructura

```
src/
├── app/
│   ├── actions.ts        Server Action: valida y escribe interesados.csv
│   ├── layout.tsx        Fuentes (Playfair Display + Inter) y metadata
│   ├── globals.css       Paleta náutica (abyss / navy / champagne / pearl)
│   └── page.tsx          Composición de la landing
├── components/
│   ├── Hero.tsx          100vh con video de fondo y CTA
│   ├── About.tsx         Teaser del proyecto en el astillero
│   ├── WaitlistForm.tsx  Formulario + mensaje de éxito
│   └── Footer.tsx
└── lib/
    ├── site.ts           Configuración de textos y video
    └── waitlist.ts       Tipos y estado inicial del formulario
```
