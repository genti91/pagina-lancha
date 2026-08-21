/**
 * Diagnóstico de la conexión con Google Sheets.
 *
 *   npm run check:sheets
 *
 * Lee el .env.local igual que Next.js, valida las tres variables y escribe una
 * fila de prueba en la planilla. Sirve para saber exactamente qué falta, sin
 * tener que adivinar desde el formulario.
 */
import nextEnv from "@next/env";

// @next/env es CommonJS: hay que tomar el default export
nextEnv.loadEnvConfig(process.cwd(), true, {
  info: () => {},
  error: console.error,
});

const VERDE = "[32m";
const ROJO = "[31m";
const RESET = "[0m";

const ok = (m) => console.log(`  ${VERDE}OK${RESET}    ${m}`);
const fail = (m) => console.log(`  ${ROJO}ERROR${RESET} ${m}`);

console.log("\nRevisando la configuracion de Google Sheets\n");

const { GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } =
  process.env;

let problemas = 0;

for (const [nombre, valor] of Object.entries({
  GOOGLE_SHEET_ID,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY,
})) {
  if (valor) {
    ok(`${nombre} presente (${valor.trim().length} caracteres)`);
  } else {
    fail(`${nombre} no esta definida`);
    problemas++;
  }
}

if (problemas > 0) {
  console.log(
    "\nCrea un archivo .env.local en la raiz. Ver SETUP-GOOGLE-SHEETS.md\n",
  );
  process.exit(1);
}

if (!GOOGLE_SERVICE_ACCOUNT_EMAIL.includes(".iam.gserviceaccount.com")) {
  fail(
    "GOOGLE_SERVICE_ACCOUNT_EMAIL no parece de una Service Account: " +
      "tiene que terminar en .iam.gserviceaccount.com",
  );
  process.exit(1);
}
ok("GOOGLE_SERVICE_ACCOUNT_EMAIL tiene forma de Service Account");

const { normalizePrivateKey, appendLead } =
  await import("../src/lib/sheets.ts");

try {
  normalizePrivateKey(GOOGLE_PRIVATE_KEY);
  ok("GOOGLE_PRIVATE_KEY se pudo leer como clave privada");
} catch (error) {
  fail(error.message);
  console.log("");
  process.exit(1);
}

console.log("\nEscribiendo una fila de prueba en la planilla...\n");

try {
  const agregada = await appendLead({
    nombre: "Prueba",
    apellido: "check:sheets",
    email: `check-${Date.now()}@example.com`,
    telefono: "-",
    locale: "es",
  });
  ok(
    agregada
      ? "Fila escrita en la planilla"
      : "La planilla respondio (ese email ya estaba cargado)",
  );
  console.log("\nTodo listo. Podes borrar la fila de prueba de la planilla.\n");
} catch (error) {
  const msg = String(error?.message ?? error);
  fail(msg);

  if (msg.includes("permission") || msg.includes("PERMISSION_DENIED")) {
    console.log(
      `\n  -> Falta compartir la planilla con ${GOOGLE_SERVICE_ACCOUNT_EMAIL} ` +
        "como Editor (Paso 6 de SETUP-GOOGLE-SHEETS.md)\n",
    );
  } else if (
    msg.includes("has not been used") ||
    msg.includes("SERVICE_DISABLED")
  ) {
    console.log("\n  -> Falta habilitar la Google Sheets API (Paso 3)\n");
  } else if (msg.includes("not found") || msg.includes("Requested entity")) {
    console.log("\n  -> Revisa el GOOGLE_SHEET_ID (Paso 1)\n");
  } else {
    console.log("");
  }
  process.exit(1);
}
