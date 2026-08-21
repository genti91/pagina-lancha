import { setRequestLocale } from "next-intl/server";
import About from "@/components/About";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import WaitlistForm from "@/components/WaitlistForm";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="relative">
      <Hero />
      <About />
      <WaitlistForm />
      <Footer />
    </main>
  );
}
