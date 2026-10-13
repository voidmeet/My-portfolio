"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Rocket, SquareTerminal } from "lucide-react";
import { useScrollTo } from "@/components/scroll/SmoothScroll";
import { heroStats, profile } from "@/lib/data";
import { anchorRef, sectionRef } from "@/lib/scene-state";
import { DecryptTitle } from "./DecryptTitle";
import { HeroHud } from "./HeroHud";
import { MagneticButton } from "./MagneticButton";
import { TerminalTyping } from "./TerminalTyping";

const EASE = [0.16, 1, 0.3, 1] as const;

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 26, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 1.1, ease: EASE, delay },
});

export function Hero() {
  const scrollTo = useScrollTo();
  const content = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: content, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.65], ["blur(0px)", "blur(6px)"]);

  return (
    <section
      id="top"
      ref={sectionRef("hero")}
      className="relative flex min-h-svh items-center overflow-clip px-5 pb-28 pt-28 sm:px-8 lg:pb-24"
    >
      {/* The 3D cluster renders behind this box — on desktop it sits right, on mobile behind the title. */}
      <div
        ref={anchorRef("hero")}
        aria-hidden
        className="pointer-events-none absolute left-[74%] top-[17%] aspect-square w-[min(112vw,640px)] -translate-x-1/2 -translate-y-1/2 sm:left-[70%] sm:top-[26%] lg:left-auto lg:right-[-4vw] lg:top-1/2 lg:w-[min(56vw,860px)] lg:translate-x-0"
      />

      <motion.div ref={content} style={{ y, opacity, filter: blur }} className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="max-w-3xl pt-[18vh] lg:pt-0">
          <TerminalTyping text="System Online // Infrastructure Ready" />

          <h1 className="sr-only">
            {profile.name} — {profile.role}
          </h1>
          <div aria-hidden className="relative mt-6 font-display text-[clamp(3.4rem,10.5vw,9.6rem)] font-bold leading-[0.86] tracking-[-0.055em]">
            <motion.span
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ duration: 1.6, delay: 1.5 }}
              className="pointer-events-none absolute inset-0 select-none text-gradient blur-2xl"
            >
              Meet
              <br />
              Bundela
            </motion.span>
            <DecryptTitle text="Meet" delay={0.55} className="text-gradient" />
            <br />
            <DecryptTitle text="Bundela" delay={0.75} className="text-gradient" />
          </div>

          <motion.div {...reveal(1.25)} className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="font-display text-xl font-medium tracking-tight text-white sm:text-2xl">{profile.role}</p>
            <span className="hidden h-px w-10 bg-linear-to-r from-neon-purple to-transparent sm:block" />
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/45">Rajkot · Gujarat · IN</p>
          </motion.div>

          <motion.p {...reveal(1.4)} className="mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            {profile.short}
          </motion.p>

          <motion.div {...reveal(1.55)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <MagneticButton onClick={() => scrollTo("#stack")} ariaLabel="Deploy — scroll to the tech stack">
              <Rocket className="size-4 text-neon-blue transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-12" />
              <span className="font-display text-base font-semibold tracking-tight text-white">Deploy</span>
              <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/50">
                ⏎
              </span>
              <ArrowDown className="size-4 text-white/50 transition-transform duration-500 group-hover:translate-y-0.5" />
            </MagneticButton>

            <button
              type="button"
              onClick={() => scrollTo("#contact")}
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white/55 transition-colors hover:text-neon-green"
            >
              <SquareTerminal className="size-4" aria-hidden />
              <span className="border-b border-dashed border-white/20 pb-0.5 group-hover:border-neon-green/60">ssh meet@bundela</span>
            </button>
          </motion.div>

          <motion.dl
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 1.75 } } }}
            className="mt-12 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-4"
          >
            {heroStats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } } }}
                className="bg-ink-950/90 px-4 py-4"
              >
                <dt className="font-mono text-[10px] uppercase leading-snug tracking-[0.16em] text-white/40">{stat.label}</dt>
                <dd className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-white">{stat.value}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </motion.div>

      <HeroHud />
    </section>
  );
}
