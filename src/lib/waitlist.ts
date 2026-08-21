/**
 * Tipos y estado inicial del formulario.
 * Vive fuera de "use server" porque un módulo de Server Actions
 * solo puede exportar funciones asíncronas.
 *
 * El Server Action nunca devuelve texto ya traducido: devuelve *claves* de
 * `messages/*.json` (bajo `waitlist.errors`) y el componente cliente las
 * traduce con el idioma activo.
 */
export type WaitlistField = "nombre" | "apellido" | "email" | "telefono";

/** Clave dentro de `waitlist.errors` de los diccionarios */
export type WaitlistErrorKey = WaitlistField | "form" | "server";

export type WaitlistFieldErrors = Partial<
  Record<WaitlistField, WaitlistErrorKey>
>;

export type WaitlistValues = Record<WaitlistField, string>;

export type WaitlistState = {
  status: "idle" | "success" | "error";
  /** Clave del mensaje general de error, si lo hay */
  errorKey: WaitlistErrorKey | null;
  errors: WaitlistFieldErrors;
  values: WaitlistValues;
};

export const emptyValues: WaitlistValues = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
};

export const initialWaitlistState: WaitlistState = {
  status: "idle",
  errorKey: null,
  errors: {},
  values: emptyValues,
};
