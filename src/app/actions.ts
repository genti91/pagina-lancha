"use server";

import { promises as fs } from "fs";
import path from "path";
import {
  emptyValues,
  type WaitlistFieldErrors,
  type WaitlistState,
} from "@/lib/waitlist";

/** Archivo que el cliente abre directamente en Excel */
const CSV_PATH = path.join(process.cwd(), "interesados.csv");

const CSV_HEADER = "Fecha,Nombre,Apellido,Email,Telefono\n";

/** BOM: hace que Excel interprete UTF-8 y muestre bien los acentos */
const BOM = "\uFEFF";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[+()\d\s.-]{6,25}$/;

/** Escapa un valor para CSV (comillas y separadores) */
function csvEscape(value: string): string {
  const clean = value.replace(/[\r\n]+/g, " ").trim();
  return /[",;]/.test(clean) ? `"${clean.replace(/"/g, '""')}"` : clean;
}

/** Crea el archivo con encabezado la primera vez y devuelve su contenido */
async function ensureCsvFile(): Promise<string> {
  try {
    return await fs.readFile(CSV_PATH, "utf8");
  } catch {
    const initial = BOM + CSV_HEADER;
    await fs.writeFile(CSV_PATH, initial, "utf8");
    return initial;
  }
}

export async function joinWaitlist(
  _prevState: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const values = {
    nombre: String(formData.get("nombre") ?? "").trim(),
    apellido: String(formData.get("apellido") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    telefono: String(formData.get("telefono") ?? "").trim(),
  };

  // Honeypot: si un bot completa el campo oculto, fingimos éxito y no guardamos.
  if (String(formData.get("website") ?? "").length > 0) {
    return {
      status: "success",
      message: "Gracias por tu interés, nos pondremos en contacto pronto.",
      errors: {},
      values: emptyValues,
    };
  }

  const errors: WaitlistFieldErrors = {};
  if (values.nombre.length < 2) errors.nombre = "Ingresá tu nombre.";
  if (values.apellido.length < 2) errors.apellido = "Ingresá tu apellido.";
  if (!EMAIL_RE.test(values.email)) errors.email = "Ingresá un email válido.";
  if (values.telefono && !PHONE_RE.test(values.telefono)) {
    errors.telefono = "Revisá el teléfono ingresado.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Revisá los campos marcados.",
      errors,
      values,
    };
  }

  try {
    const current = await ensureCsvFile();

    // Evitamos filas duplicadas por email
    const alreadyRegistered = current
      .split("\n")
      .slice(1)
      .some((line) => line.toLowerCase().includes(values.email.toLowerCase()));

    if (!alreadyRegistered) {
      const row =
        [
          new Date().toISOString(),
          values.nombre,
          values.apellido,
          values.email,
          values.telefono || "-",
        ]
          .map(csvEscape)
          .join(",") + "\n";

      await fs.appendFile(CSV_PATH, row, "utf8");
    }

    return {
      status: "success",
      message: "Gracias por tu interés, nos pondremos en contacto pronto.",
      errors: {},
      values: emptyValues,
    };
  } catch (error) {
    console.error("[waitlist] No se pudo escribir interesados.csv:", error);
    return {
      status: "error",
      message:
        "No pudimos registrar tus datos en este momento. Intentá nuevamente en unos minutos.",
      errors: {},
      values,
    };
  }
}
