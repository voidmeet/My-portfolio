"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useScrollTo } from "@/components/scroll/SmoothScroll";
import { navLinks } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const scrollTo = useScrollTo();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 48));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ["top", ...navLinks.map((l) => l.id)]) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(`#${id}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5">
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-linear-to-r from-neon-blue via-neon-purple to-neon-green"
      />
      <motion.nav
        aria-label="Primary"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={cn(
          "mx-auto mt-3 flex max-w-7xl items-center justify-between gap-4 rounded-full border px-3 py-2 transition-[background-color,border-color,box-shadow] duration-500 sm:mt-4 sm:px-4",
          scrolled
            ? "border-white/10 bg-ink-950/85 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.9)] md:backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}
      >
        <a href="#top" onClick={go("top")} className="group flex items-center gap-2.5" aria-label="Back to top">
          <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl border border-white/10 bg-ink-900">
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(34_211_238/0.35),transparent_60%)] opacity-70 transition-opacity group-hover:opacity-100" />
            <span className="relative font-display text-sm font-bold tracking-tight text-white">MB</span>
          </span>
          <span className="hidden font-mono text-xs text-white/60 sm:block">
            meet<span className="text-neon-blue">@</span>bundela<span className="text-white/30">:~$</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={go(link.id)}
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors",
                  active === link.id ? "text-white" : "text-white/50 hover:text-white/90",
                )}
              >
                {active === link.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.06]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative text-neon-blue/80">{link.index}</span>
                <span className="relative">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-neon-green/20 bg-neon-green/[0.06] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-neon-green/90 lg:flex">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 animate-ping-soft rounded-full bg-neon-green" />
              <span className="relative size-1.5 rounded-full bg-neon-green" />
            </span>
            All systems operational
          </span>
          <a
            href="#contact"
            onClick={go("contact")}
            className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/85 transition-colors hover:border-neon-blue/50 hover:text-white md:hidden"
          >
            Connect
          </a>
        </div>
      </motion.nav>
    </header>
  );
}
