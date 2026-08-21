import { Anchor } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { site } from "@/lib/site";

/**
 * Barra superior del hero: marca y selector de idioma.
 *
 * Los dos viven en la misma fila flex, así que no se pueden pisar por más
 * angosta que sea la pantalla. En celular la marca va a la izquierda y el
 * selector a la derecha; desde `sm` hay lugar de sobra y la marca pasa a estar
 * centrada en la pantalla, con el selector siempre a la derecha.
 */
export default function TopBar() {
  return (
    <div className="animate-fade-in absolute inset-x-0 top-0 z-30 flex items-center gap-4 px-6 py-7 sm:px-10 sm:py-9">
      {/*
        Desde `sm` la marca se centra en la pantalla y sale del flujo, así que
        el `max-w` es lo que evita que llegue a tocar el selector si el nombre
        de la marca es largo: reserva 9rem por lado (el selector mide ~6rem más
        el padding de la barra) y lo que sobra se trunca.
      */}
      <div className="flex min-w-0 items-center gap-2.5 sm:absolute sm:top-1/2 sm:left-1/2 sm:max-w-[calc(100%-18rem)] sm:-translate-x-1/2 sm:-translate-y-1/2">
        <Anchor
          className="h-4 w-4 shrink-0 text-champagne"
          strokeWidth={1.25}
          aria-hidden="true"
        />
        <span className="truncate font-serif text-[0.8rem] tracking-[0.28em] text-pearl/90 uppercase sm:text-sm sm:tracking-[0.35em]">
          {site.brand}
        </span>
      </div>

      <LanguageSwitcher className="ml-auto" />
    </div>
  );
}
