import About from "@/components/About";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <About />
      <WaitlistForm />
      <Footer />
    </main>
  );
}
