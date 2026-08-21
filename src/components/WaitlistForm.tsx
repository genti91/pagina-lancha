"use client";

import { useActionState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { joinWaitlist } from "@/app/actions";
import {
  initialWaitlistState,
  type WaitlistErrorKey,
  type WaitlistField,
} from "@/lib/waitlist";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fields = [
  { name: "nombre", type: "text", autoComplete: "given-name", required: true },
  {
    name: "apellido",
    type: "text",
    autoComplete: "family-name",
    required: true,
  },
  { name: "email", type: "email", autoComplete: "email", required: true },
  { name: "telefono", type: "tel", autoComplete: "tel", required: false },
] as const satisfies ReadonlyArray<{
  name: WaitlistField;
  type: string;
  autoComplete: string;
  required: boolean;
}>;

type FieldProps = {
  name: string;
  label: string;
  optionalLabel?: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
};

function Field({
  name,
  label,
  optionalLabel,
  type = "text",
  required = false,
  autoComplete,
  defaultValue,
  error,
}: FieldProps) {
  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="block text-[0.62rem] tracking-[0.28em] text-pearl/40 uppercase"
      >
        {label}
        {!required && optionalLabel && (
          <span className="ml-2 text-pearl/25">{optionalLabel}</span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`mt-3 w-full border-b bg-transparent pb-3 text-[0.95rem] text-pearl outline-none transition-colors duration-300 placeholder:text-pearl/20 focus:border-champagne ${
          error ? "border-red-400/60" : "border-pearl/15 hover:border-pearl/30"
        }`}
      />
      {error && (
        <p
          id={`${name}-error`}
          className="mt-2 text-[0.7rem] tracking-wide text-red-300/80"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function WaitlistForm() {
  const t = useTranslations("waitlist");
  const locale = useLocale();
  const [state, formAction, isPending] = useActionState(
    joinWaitlist,
    initialWaitlistState,
  );

  const isSuccess = state.status === "success";
  const errorFor = (key?: WaitlistErrorKey) =>
    key ? t(`errors.${key}`) : undefined;

  return (
    <section
      id="waitlist"
      className="relative border-t border-white/5 px-6 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center"
        >
          <span className="text-[0.62rem] tracking-[0.4em] text-champagne uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="mt-8 font-serif text-3xl leading-tight font-light text-pearl sm:text-4xl">
            {t("titleLine1")}
            <span className="block text-champagne-soft italic">
              {t("titleLine2")}
            </span>
          </h2>
          <p className="mx-auto mt-7 max-w-md text-sm leading-relaxed text-pearl/50">
            {t("intro")}
          </p>
        </motion.div>

        <div className="mt-16">
          <AnimatePresence mode="wait" initial={false}>
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="border border-champagne/25 bg-navy/40 px-8 py-14 text-center"
              >
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.7 }}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-champagne/40"
                >
                  <Check
                    className="h-5 w-5 text-champagne"
                    strokeWidth={1.25}
                  />
                </motion.span>
                <p className="mt-8 font-serif text-xl leading-relaxed text-pearl">
                  {t("success.message")}
                </p>
                <p className="mt-4 text-[0.7rem] tracking-[0.25em] text-champagne/70 uppercase">
                  {t("success.aboard")}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <form action={formAction} className="space-y-10" noValidate>
                  {/* Honeypot anti-spam */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="pointer-events-none absolute h-0 w-0 opacity-0"
                  />
                  {/* Un Server Action no puede leer el segmento [locale] */}
                  <input type="hidden" name="locale" value={locale} />

                  <div className="grid gap-10 sm:grid-cols-2">
                    {fields.slice(0, 2).map((field) => (
                      <Field
                        key={field.name}
                        name={field.name}
                        label={t(`fields.${field.name}`)}
                        type={field.type}
                        required={field.required}
                        autoComplete={field.autoComplete}
                        defaultValue={state.values[field.name]}
                        error={errorFor(state.errors[field.name])}
                      />
                    ))}
                  </div>

                  {fields.slice(2).map((field) => (
                    <Field
                      key={field.name}
                      name={field.name}
                      label={t(`fields.${field.name}`)}
                      optionalLabel={t("optional")}
                      type={field.type}
                      required={field.required}
                      autoComplete={field.autoComplete}
                      defaultValue={state.values[field.name]}
                      error={errorFor(state.errors[field.name])}
                    />
                  ))}

                  {state.errorKey === "server" && (
                    <p className="text-center text-[0.75rem] text-red-300/80">
                      {t("errors.server")}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="group relative w-full overflow-hidden border border-champagne/50 px-8 py-5 transition-colors duration-500 hover:border-champagne disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="absolute inset-0 origin-left scale-x-0 bg-champagne transition-transform duration-600 ease-out group-hover:scale-x-100" />
                    <span className="relative z-10 flex items-center justify-center gap-3 text-[0.7rem] tracking-[0.3em] text-champagne uppercase transition-colors duration-300 group-hover:text-abyss">
                      {isPending && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      )}
                      {isPending ? t("sending") : t("submit")}
                    </span>
                  </button>

                  <p className="text-center text-[0.68rem] leading-relaxed text-pearl/30">
                    {t("privacy")}
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
