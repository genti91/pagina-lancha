import { createPrivateKey } from "crypto";
import { JWT } from "google-auth-library";
import {
  GoogleSpreadsheet,
  type GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

/** Los dos caracteres literales `\n` (no el salto de línea) */
const ESCAPED_LF = String.raw`\n`;
/** Los dos caracteres literales `\r` */
const ESCAPED_CR = String.raw`\r`;

const PEM_RE = /-----BEGIN ([A-Z ]+)-----([\s\S]*?)-----END \1-----/;

/** El `private_key_id` del JSON: 40 caracteres hexadecimales */
const KEY_ID_RE = /^[0-9a-f]{40}$/i;

const KEY_HELP =
  "Copiala tal cual del JSON de la Service Account, entre comillas dobles y " +
  "en una sola línea. Ver SETUP-GOOGLE-SHEETS.md";

/** Columnas de la hoja (se crean solas la primera vez) */
export const SHEET_HEADERS = [
  "Fecha",
  "Nombre",
  "Apellido",
  "Email",
  "Telefono",
  "Idioma",
] as const;

export type Lead = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  locale: string;
};

/**
 * La clave privada viaja dentro de una variable de entorno y en el camino se
 * rompe de mil formas: comillas que quedaron pegadas, saltos escapados como
 * `\n`, saltos que se perdieron del todo, `\r` de Windows.
 *
 * En vez de parchear caso por caso, reconstruimos el PEM desde cero: nos
 * quedamos con la etiqueta y con los caracteres base64 del cuerpo, y volvemos
 * a armarlo en líneas de 64.
 */
export function normalizePrivateKey(raw: string): string {
  let key = raw.trim();

  // Comillas envolventes que algunos paneles no sacan (incluso repetidas)
  while (
    key.length > 1 &&
    ((key.startsWith(`"`) && key.endsWith(`"`)) ||
      (key.startsWith(`'`) && key.endsWith(`'`)))
  ) {
    key = key.slice(1, -1).trim();
  }

  // Saltos escapados -> saltos reales
  key = key.split(ESCAPED_CR).join("").split(ESCAPED_LF).join("\n");

  // Confusión habitual: el JSON tiene `private_key_id` justo arriba de
  // `private_key`, y es fácil copiar el que no es.
  if (KEY_ID_RE.test(key)) {
    throw new Error(
      "GOOGLE_PRIVATE_KEY tiene el valor de `private_key_id`, no el de " +
        "`private_key`. Buscá en el JSON de la Service Account el campo " +
        "`private_key`, el largo que empieza con -----BEGIN PRIVATE KEY-----. " +
        "Ver SETUP-GOOGLE-SHEETS.md",
    );
  }

  const pem = PEM_RE.exec(key);

  if (!pem) {
    throw new Error(
      "GOOGLE_PRIVATE_KEY no tiene formato PEM: falta el bloque " +
        `-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----. ${KEY_HELP}`,
    );
  }

  const label = pem[1].trim();
  // Solo caracteres base64: así da igual si en el medio quedaron espacios,
  // tabs, comillas o barras invertidas sueltas.
  const body = pem[2].replace(/[^A-Za-z0-9+\/=]/g, "");
  const lines = body.match(/.{1,64}/g) ?? [];

  const normalized = `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----\n`;

  // Fallamos acá, con un mensaje entendible, en vez de dejar que OpenSSL tire
  // un ERR_OSSL_UNSUPPORTED más adelante.
  try {
    createPrivateKey(normalized);
  } catch {
    throw new Error(
      `GOOGLE_PRIVATE_KEY tiene el formato correcto pero el contenido no es una clave válida. ${KEY_HELP}`,
    );
  }

  return normalized;
}

function readCredentials() {
  const sheetId = process.env.GOOGLE_SHEET_ID?.trim();
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetId || !clientEmail || !privateKey) {
    const missing = [
      !sheetId && "GOOGLE_SHEET_ID",
      !clientEmail && "GOOGLE_SERVICE_ACCOUNT_EMAIL",
      !privateKey && "GOOGLE_PRIVATE_KEY",
    ].filter(Boolean);

    throw new Error(
      `Faltan variables de entorno de Google Sheets: ${missing.join(", ")}. ` +
        "Ver SETUP-GOOGLE-SHEETS.md",
    );
  }

  return {
    sheetId,
    clientEmail,
    privateKey: normalizePrivateKey(privateKey),
  };
}

/** Permite avisar en el log si el deploy quedó sin configurar */
export function isSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SHEET_ID &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY,
  );
}

/** Abre la primera hoja del documento, creándola con encabezados si hace falta */
async function openSheet(): Promise<GoogleSpreadsheetWorksheet> {
  const { sheetId, clientEmail, privateKey } = readCredentials();

  const auth = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(sheetId, auth);
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];

  if (!sheet) {
    return doc.addSheet({
      title: "Interesados",
      headerValues: [...SHEET_HEADERS],
    });
  }

  // Hoja existente pero vacía: le escribimos los encabezados.
  try {
    await sheet.loadHeaderRow();
  } catch {
    await sheet.setHeaderRow([...SHEET_HEADERS]);
  }

  return sheet;
}

/**
 * Agrega una fila con el interesado. Devuelve `false` si el email ya estaba
 * cargado (no se duplica la fila, pero para el usuario el envío fue exitoso).
 */
export async function appendLead(lead: Lead): Promise<boolean> {
  const sheet = await openSheet();

  const rows = await sheet.getRows();
  const email = lead.email.toLowerCase();
  const alreadyRegistered = rows.some(
    (row) =>
      String(row.get("Email") ?? "")
        .trim()
        .toLowerCase() === email,
  );

  if (alreadyRegistered) return false;

  await sheet.addRow({
    Fecha: new Date().toISOString(),
    Nombre: lead.nombre,
    Apellido: lead.apellido,
    Email: lead.email,
    Telefono: lead.telefono || "-",
    Idioma: lead.locale,
  });

  return true;
}
