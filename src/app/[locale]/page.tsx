import { setRequestLocale } from "next-intl/server";
import About from "@/components/About";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import WaitlistForm from "@/components/WaitlistForm";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const activo = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  return (
    <>
      {/*
        Google lee el JSON-LD esté donde esté dentro del documento, y no
        distingue si vino del <head> o del <body>. Va acá porque React no
        eleva los <script> en línea al <head>, y este es el lugar que
        recomienda la documentación de Next para datos estructurados.
      */}
      <JsonLd locale={activo} />

      <main className="relative">
        <Hero />
        <About />
        <WaitlistForm />
        <Footer />
      </main>
    </>
  );
}
