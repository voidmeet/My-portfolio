"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { MotionConfig } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

/**
 * Lenis drives the scroll, GSAP's ticker drives Lenis, and ScrollTrigger
 * listens to Lenis — one clock for every scroll-linked animation.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    if (reduce) return () => window.removeEventListener("load", refresh);

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.1,
    });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const frame = requestAnimationFrame(() => setLenis(instance));

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LenisContext.Provider>
  );
}

/** Smoothly scroll to a section id (falls back to native smooth scrolling). */
export function useScrollTo() {
  const lenis = useContext(LenisContext);
  return useCallback(
    (target: string | number) => {
      const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : null;
      if (lenis) {
        lenis.scrollTo(el ?? target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
      } else if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    },
    [lenis],
  );
}
