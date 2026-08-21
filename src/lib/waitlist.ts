/**
 * Tipos y estado inicial del formulario.
 * Vive fuera de "use server" porque un módulo de Server Actions
 * solo puede exportar funciones asíncronas.
 */
export type WaitlistFieldErrors = Partial<
  Record<"nombre" | "apellido" | "email" | "telefono", string>
>;

export type WaitlistValues = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
};

export type WaitlistState = {
  status: "idle" | "success" | "error";
  message: string;
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
  message: "",
  errors: {},
  values: emptyValues,
};
