"use client";

import { motion } from "framer-motion";
import { Compass, Hammer, Ship, Users } from "lucide-react";

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
  {
    icon: Ship,
    title: "Embarcación a estrenar",
    text: "Diseñada y construida a medida en astillero, con terminaciones de primer nivel.",
  },
  {
    icon: Users,
    title: "Grupos reducidos",
    text: "Salidas privadas para pocos pasajeros. Sin horarios compartidos ni recorridos masivos.",
  },
  {
    icon: Compass,
    title: "Rutas curadas",
    text: "Itinerarios por los ríos y arroyos más bellos del Delta, adaptados a cada navegación.",
  },
];

export default function About() {
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
              En construcción
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-serif text-3xl leading-tight font-light text-pearl sm:text-4xl lg:text-[2.75rem]"
          >
            Algo excepcional está tomando forma
            <span className="block text-champagne-soft italic">
              en el astillero
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-10 max-w-2xl text-[0.95rem] leading-relaxed text-pearl/65 sm:text-base"
          >
            Estamos construyendo una embarcación pensada para una sola cosa:
            recorrer el Delta del Tigre como pocos lo hicieron. Materiales
            nobles, espacios amplios y una tripulación dedicada a un único grupo
            por salida.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-pearl/45"
          >
            Cuando la botadura llegue, las primeras navegaciones serán para
            quienes ya estén en nuestra lista.
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
          {pillars.map(({ icon: Icon, title, text }) => (
            <motion.div key={title} variants={fadeUp} className="text-center">
              <Icon
                className="mx-auto h-6 w-6 text-champagne"
                strokeWidth={1}
              />
              <h3 className="mt-6 font-serif text-lg text-pearl">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-pearl/50">
                {text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
