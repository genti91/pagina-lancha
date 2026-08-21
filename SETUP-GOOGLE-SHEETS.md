# Conectar el formulario con Google Sheets

Los datos de la lista de espera se escriben en una planilla de Google. Para que
funcione hay que crear una **Service Account** (una especie de usuario robot) y
compartirle la planilla.

Son 10 minutos. Se hace una sola vez.

---

## Paso 1 — Crear la planilla

1. Entrá a https://sheets.google.com y creá una planilla nueva.
2. Ponele un nombre, por ejemplo **Lista de espera — Delta Privé**.
3. No hace falta escribir nada: la primera vez que alguien se anote, la app
   crea sola los encabezados `Fecha | Nombre | Apellido | Email | Telefono | Idioma`.
4. Copiá el **ID de la planilla** desde la URL. Es la parte del medio:

   ```
   https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890/edit
                                          └──────────── este es el ID ────────────┘
   ```

---

## Paso 2 — Crear el proyecto en Google Cloud

1. Entrá a https://console.cloud.google.com
2. Arriba a la izquierda, al lado del logo, hacé clic en el selector de
   proyectos → **Proyecto nuevo**.
3. Nombre: `delta-prive-web` (o el que prefieras) → **Crear**.
4. Esperá unos segundos y asegurate de que quede seleccionado ese proyecto
   en el selector de arriba.

---

## Paso 3 — Habilitar la API de Google Sheets

1. En el buscador de arriba escribí **Google Sheets API** y entrá al resultado.
2. Clic en **Habilitar** (Enable).
3. Esperá a que diga que la API está habilitada.

---

## Paso 4 — Crear la Service Account

1. En el menú lateral: **IAM y administración** → **Cuentas de servicio**
   (_IAM & Admin → Service Accounts_).
2. Clic en **+ Crear cuenta de servicio**.
3. Completá:
   - **Nombre**: `web-formulario`
   - **ID**: se completa solo
   - **Descripción**: `Escribe la lista de espera en Sheets`
4. Clic en **Crear y continuar**.
5. En "Otorgar acceso a este proyecto" (paso 2 del asistente): **no hace falta
   ningún rol**, dejalo vacío y clic en **Continuar**.
6. Paso 3: dejalo vacío también → **Listo**.

---

## Paso 5 — Descargar la clave JSON

1. En la lista de cuentas de servicio, hacé clic sobre la que acabás de crear.
2. Pestaña **Claves** (_Keys_).
3. **Agregar clave** → **Crear clave nueva** → tipo **JSON** → **Crear**.
4. Se descarga un archivo `.json`. **Guardalo bien: no se puede volver a
   descargar** y le da acceso a tu planilla.

Ese archivo tiene esta forma:

```json
{
  "type": "service_account",
  "project_id": "delta-prive-web",
  "private_key_id": "eb521013fbca48dad190c3384271770a9f3e21bc",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADAN...\n-----END PRIVATE KEY-----\n",
  "client_email": "web-formulario@delta-prive-web.iam.gserviceaccount.com",
  ...
}
```

De ahí vas a usar **dos** valores: `client_email` y `private_key`.

> ⚠️ **Ojo con `private_key_id`.** Está justo arriba de `private_key` y es muy
> fácil copiar el que no es. El que necesitás es **`private_key`**: el largo,
> el que empieza con `-----BEGIN PRIVATE KEY-----`. El `private_key_id` son 40
> caracteres sueltos y no sirve para autenticarse.

---

## Paso 6 — Compartir la planilla con la Service Account

Este paso es el que más se olvida y es el que hace que todo falle.

1. Volvé a la planilla del Paso 1.
2. Clic en **Compartir** (arriba a la derecha).
3. Pegá el `client_email` del JSON
   (algo como `web-formulario@delta-prive-web.iam.gserviceaccount.com`).
4. Dale permiso de **Editor**.
5. Destildá "Notificar a las personas" y clic en **Compartir**.

---

## Paso 7 — Configurar las variables de entorno

Creá un archivo `.env.local` en la raíz del proyecto (podés copiar
`.env.example`) con estos tres valores:

```bash
GOOGLE_SHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
GOOGLE_SERVICE_ACCOUNT_EMAIL=web-formulario@delta-prive-web.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADAN...\n-----END PRIVATE KEY-----\n"
```

Sobre `GOOGLE_PRIVATE_KEY`:

- Copiala **tal cual viene en el JSON**, incluidos los `\n`.
- Va **entre comillas dobles** y **en una sola línea**.
- La app se encarga de convertir los `\n` en saltos de línea reales.

Reiniciá el servidor (`npm run dev`) para que tome las variables.

---

## Paso 8 — Probar

Antes de tocar el formulario, corré el diagnóstico:

```bash
npm run check:sheets
```

Revisa las tres variables, valida la clave y escribe una fila de prueba en la
planilla. Si algo está mal te dice exactamente qué:

```
Revisando la configuracion de Google Sheets

  OK    GOOGLE_SHEET_ID presente (44 caracteres)
  OK    GOOGLE_SERVICE_ACCOUNT_EMAIL presente (52 caracteres)
  OK    GOOGLE_PRIVATE_KEY presente (1704 caracteres)
  OK    GOOGLE_SERVICE_ACCOUNT_EMAIL tiene forma de Service Account
  OK    GOOGLE_PRIVATE_KEY se pudo leer como clave privada

Escribiendo una fila de prueba en la planilla...

  OK    Fila escrita en la planilla
```

Cuando eso pase, abrí http://localhost:3000, completá el formulario y enviálo:
deberías ver el mensaje de éxito y una fila nueva en la planilla. (Podés borrar
la fila de prueba que dejó el diagnóstico.)

Si algo falla desde el formulario, el error exacto aparece en la terminal donde
corre `npm run dev`, con el prefijo `[waitlist]`.

---

## Deploy en Vercel

Las mismas tres variables hay que cargarlas en el panel de Vercel:

**Project → Settings → Environment Variables**

- `GOOGLE_SHEET_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY` → pegá el valor **con comillas incluidas**, igual que en
  el `.env.local`.

Marcá las tres para _Production_, _Preview_ y _Development_, y volvé a
deployar para que tomen efecto.

---

## Problemas frecuentes

Corré `npm run check:sheets` y compará el mensaje con esta tabla:

| Mensaje                                                  | Causa                                                                                      |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `Faltan variables de entorno de Google Sheets: ...`      | Falta el `.env.local` o no reiniciaste el server                                           |
| `tiene el valor de private_key_id, no el de private_key` | Copiaste el campo equivocado del JSON (Paso 5)                                             |
| `no tiene formato PEM`                                   | La clave quedó cortada: si la pegaste en varias líneas, tiene que ir entre comillas dobles |
| `The caller does not have permission`                    | No compartiste la planilla con el `client_email` (Paso 6)                                  |
| `Google Sheets API has not been used in project ...`     | Falta habilitar la API (Paso 3)                                                            |
| `Requested entity was not found`                         | El `GOOGLE_SHEET_ID` está mal copiado                                                      |

> El error críptico `error:1E08010C:DECODER routines::unsupported` ya no debería
> aparecer: la app valida la clave antes de usarla y te dice qué pasa en
> castellano.

---

## Seguridad

- El `.env.local` y el JSON de la Service Account **nunca** se suben al repo
  (`.gitignore` ya los excluye).
- La Service Account solo puede tocar las planillas que le compartas
  explícitamente.
- Si la clave se filtra, borrala desde Google Cloud (**Cuentas de servicio →
  Claves**) y generá una nueva.
