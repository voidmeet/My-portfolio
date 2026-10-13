"use client";

import { motion } from "framer-motion";
import { locations } from "@/lib/data";
import { LiveClock } from "./LiveClock";

const corner = "pointer-events-none absolute size-4 border-white/20";

/** Heads-up display chrome framing the hero: corners, coordinates, clock, scroll cue. */
export function HeroHud() {
  const { lat, lon } = locations.rajkot;

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 2 }}
      className="pointer-events-none absolute inset-3 z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 sm:inset-6"
    >
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />

      <div className="absolute bottom-4 left-4 hidden space-y-1 sm:block">
        <p>
          <span className="text-neon-blue/80">lat</span> {lat.toFixed(4)}° N · <span className="text-neon-blue/80">lon</span>{" "}
          {lon.toFixed(4)}° E
        </p>
        <p className="text-white/25">node rjk-01 · zone in-west</p>
      </div>

      <div className="absolute bottom-4 right-4 text-right">
        <p>
          <span className="text-neon-green/80">ist</span> <LiveClock className="tabular-nums text-white/60" />
        </p>
        <p className="hidden text-white/25 sm:block">local time · rajkot</p>
      </div>

      <div className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 tall:flex">
        <span className="tracking-[0.35em] text-white/45">scroll to deploy</span>
        <span className="relative h-12 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-0 animate-scan bg-linear-to-b from-transparent via-neon-blue to-transparent" />
        </span>
      </div>

      <div className="absolute left-0 top-1/2 hidden -translate-y-1/2 -rotate-90 origin-left translate-x-3 whitespace-nowrap text-white/20 xl:block">
        {"// build 2026.10 · prod-cluster"}
      </div>
    </motion.div>
  );
}
