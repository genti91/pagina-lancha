"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

/**
 * Video de fondo en loop sin corte visible.
 *
 * Un solo <video loop> corta de golpe al volver al principio. Acá usamos dos
 * copias superpuestas: cuando a la que se está viendo le queda
 * `heroCrossfadeSeconds` para terminar, arrancamos la otra desde cero y
 * hacemos un fundido entre las dos. El salto queda escondido dentro del cruce.
 *
 * El fundido lo hace CSS (transición de opacity, compuesta en la GPU); el
 * JavaScript solo decide *cuándo* dispararlo.
 */
export default function HeroVideo() {
  const firstRef = useRef<HTMLVideoElement>(null);
  const secondRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const first = firstRef.current;
    const second = secondRef.current;
    if (!first || !second) return;

    const layers = [first, second];
    const fade = site.heroCrossfadeSeconds;
    let active = 0;
    let frame = 0;

    const start = (video: HTMLVideoElement) => {
      video.currentTime = 0;
      video.playbackRate = site.heroPlaybackRate;
      // Si el navegador bloquea el autoplay no hay nada que hacer, pero
      // tampoco queremos una promesa rechazada suelta.
      void video.play().catch(() => {});
    };

    const swap = () => {
      const current = layers[active];
      const next = layers[1 - active];

      start(next);
      next.style.opacity = "1";
      current.style.opacity = "0";
      active = 1 - active;
    };

    /** ¿Le queda menos que el fundido para terminar? */
    const maybeSwap = () => {
      const { duration, currentTime } = layers[active];

      if (
        Number.isFinite(duration) &&
        duration > fade &&
        currentTime >= duration - fade
      ) {
        swap();
      }
    };

    // Dos disparadores para el mismo chequeo:
    //  - requestAnimationFrame es preciso al fotograma, pero el navegador lo
    //    congela cuando la pestaña pasa a segundo plano.
    //  - timeupdate solo llega ~4 veces por segundo, pero sigue llegando con
    //    la pestaña oculta. Es lo que evita el corte seco al volver a ella.
    const tick = () => {
      maybeSwap();
      frame = requestAnimationFrame(tick);
    };

    /** Último recurso: si igual llegó al final, cambiamos sin fundido */
    const onEnded = (event: Event) => {
      if (event.target === layers[active]) swap();
    };

    for (const video of layers) {
      video.playbackRate = site.heroPlaybackRate;
      video.addEventListener("timeupdate", maybeSwap);
      video.addEventListener("ended", onEnded);
    }

    void first.play().catch(() => {});
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      for (const video of layers) {
        video.removeEventListener("timeupdate", maybeSwap);
        video.removeEventListener("ended", onEnded);
      }
    };
  }, []);

  const layerClass = "absolute inset-0 h-full w-full object-cover";
  const transition = `opacity ${site.heroCrossfadeSeconds}s linear`;

  return (
    <div className="absolute inset-0 bg-abyss">
      <video
        ref={firstRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className={layerClass}
        style={{ opacity: 1, transition }}
      >
        <source src={site.heroVideo} type="video/mp4" />
      </video>

      <video
        ref={secondRef}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className={layerClass}
        style={{ opacity: 0, transition }}
      >
        <source src={site.heroVideo} type="video/mp4" />
      </video>
    </div>
  );
}
