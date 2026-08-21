"use client";

import { motion } from "framer-motion";
import { Compass, Hammer, Ship, Users } from "lucide-react";
import { useTranslations } from "next-intl";

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16 } },
};

const pillars = [
  { key: "boat", icon: Ship },
  { key: "groups", icon: Users },
  { key: "routes", icon: Compass },
] as const;

export default function About() {
  const t = useTranslations("about");

  return (
    <section
      id="experiencia"
      className="relative border-t border-white/5 px-6 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            variants={fadeUp}
            className="mb-10 inline-flex items-center gap-2.5 border border-champagne/25 px-4 py-2"
          >
            <Hammer className="h-3.5 w-3.5 text-champagne" strokeWidth={1.25} />
            <span className="text-[0.6rem] tracking-[0.3em] text-champagne/90 uppercase">
              {t("badge")}
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-serif text-3xl leading-tight font-light text-pearl sm:text-4xl lg:text-[2.75rem]"
          >
            {t("titleLine1")}
            <span className="block text-champagne-soft italic">
              {t("titleLine2")}
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-10 max-w-2xl text-[0.95rem] leading-relaxed text-pearl/65 sm:text-base"
          >
            {t("paragraph1")}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-pearl/45"
          >
            {t("paragraph2")}
          </motion.p>

          <motion.span
            variants={fadeUp}
            className="mx-auto mt-14 block h-px w-24 bg-champagne/30"
          />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-20 grid gap-12 sm:grid-cols-3 sm:gap-10"
        >
          {pillars.map(({ key, icon: Icon }) => (
            <motion.div key={key} variants={fadeUp} className="text-center">
              <Icon
                className="mx-auto h-6 w-6 text-champagne"
                strokeWidth={1}
              />
              <h3 className="mt-6 font-serif text-lg text-pearl">
                {t(`pillars.${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-pearl/50">
                {t(`pillars.${key}.text`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
