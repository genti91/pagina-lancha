"use server";

import { appendLead } from "@/lib/sheets";
import {
  emptyValues,
  type WaitlistFieldErrors,
  type WaitlistState,
} from "@/lib/waitlist";
import { routing } from "@/i18n/routing";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[+()\d\s.-]{6,25}$/;

const SUCCESS: WaitlistState = {
  status: "success",
  errorKey: null,
  errors: {},
  values: emptyValues,
};

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
    return SUCCESS;
  }

  const errors: WaitlistFieldErrors = {};
  if (values.nombre.length < 2) errors.nombre = "nombre";
  if (values.apellido.length < 2) errors.apellido = "apellido";
  if (!EMAIL_RE.test(values.email)) errors.email = "email";
  if (values.telefono && !PHONE_RE.test(values.telefono)) {
    errors.telefono = "telefono";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", errorKey: "form", errors, values };
  }

  // El idioma viaja en un campo oculto: los Server Actions no pueden leer
  // el segmento `[locale]` de la URL.
  const rawLocale = String(formData.get("locale") ?? "");
  const locale = (routing.locales as readonly string[]).includes(rawLocale)
    ? rawLocale
    : routing.defaultLocale;

  try {
    await appendLead({ ...values, locale });
    return SUCCESS;
  } catch (error) {
    console.error("[waitlist] No se pudo guardar en Google Sheets:", error);
    return { status: "error", errorKey: "server", errors: {}, values };
  }
}
