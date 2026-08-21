"use client";

import { motion } from "framer-motion";
import { Anchor, ChevronDown } from "lucide-react";
import { site } from "@/lib/site";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.18, delayChildren: 0.35 },
  },
};

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex h-[100svh] min-h-[38rem] w-full items-center justify-center overflow-hidden"
    >
      {/* Video de fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={site.heroVideo.primary} type="video/mp4" />
        <source src={site.heroVideo.fallback} type="video/mp4" />
      </video>

      {/* Capas de oscurecimiento para legibilidad */}
      <div className="absolute inset-0 bg-abyss/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-abyss/90 via-abyss/30 to-abyss" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, rgba(4,8,13,0.85) 100%)",
        }}
      />

      {/* Marca */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.15 }}
        className="absolute top-8 left-1/2 flex -translate-x-1/2 items-center gap-2.5 sm:top-10"
      >
        <Anchor className="h-4 w-4 text-champagne" strokeWidth={1.25} />
        <span className="font-serif text-sm tracking-[0.35em] text-pearl/90 uppercase">
          {site.brand}
        </span>
      </motion.div>

      {/* Contenido */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        <motion.div
          variants={rise}
          className="mb-10 flex items-center justify-center gap-4"
        >
          <span className="h-px w-8 bg-champagne/50" />
          <span className="text-[0.65rem] tracking-[0.4em] text-champagne uppercase sm:text-xs">
            {site.location}
          </span>
          <span className="h-px w-8 bg-champagne/50" />
        </motion.div>

        <motion.h1
          variants={rise}
          className="font-serif text-4xl leading-[1.15] font-light text-pearl sm:text-5xl lg:text-[4rem]"
        >
          La Nueva Experiencia
          <span className="mt-2 block text-champagne-soft italic">
            Premium en el Delta
          </span>
        </motion.h1>

        <motion.div variants={rise} className="mt-12">
          <span className="mx-auto mb-5 block h-px w-16 bg-pearl/25" />
          <p className="text-[0.7rem] tracking-[0.55em] text-pearl/55 uppercase sm:text-xs">
            {site.subtitle}
          </p>
        </motion.div>

        <motion.div variants={rise} className="mt-14">
          <a
            href="#waitlist"
            className="group relative inline-flex items-center overflow-hidden border border-champagne/50 px-10 py-4 transition-colors duration-500 hover:border-champagne"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-champagne transition-transform duration-600 ease-out group-hover:scale-x-100" />
            <span className="relative z-10 text-[0.7rem] tracking-[0.3em] text-champagne uppercase transition-colors duration-300 group-hover:text-abyss">
              Anotarse en la lista de espera
            </span>
          </a>
        </motion.div>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.a
        href="#experiencia"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.4 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-pearl/40 transition-colors hover:text-champagne"
        aria-label="Ver más"
      >
        <motion.span
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="block"
        >
          <ChevronDown className="h-5 w-5" strokeWidth={1} />
        </motion.span>
      </motion.a>
    </section>
  );
}
