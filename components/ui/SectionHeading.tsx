"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

interface SectionHeadingProps {
  index: string;
  kicker: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  className?: string;
}

/** Kicker + masked word-by-word headline reveal. */
export function SectionHeading({ index, kicker, title, highlight, subtitle, className }: SectionHeadingProps) {
  const words = title.split(" ");

  return (
    <div className={cn("relative", className)}>
      <motion.p
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-neon-green/85"
      >
        <span className="text-white/40">{index}</span>
        <span className="h-px w-10 bg-linear-to-r from-neon-green/80 to-transparent" />
        <span>{kicker}</span>
      </motion.p>

      <h2 className="mt-5 font-display text-[clamp(2.5rem,6.6vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-white">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, ease: EASE, delay: 0.05 * i }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
        {highlight && (
          <span className="block overflow-hidden pb-[0.1em]">
            <motion.span
              className="inline-block text-gradient"
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, ease: EASE, delay: 0.05 * words.length + 0.05 }}
            >
              {highlight}
            </motion.span>
          </span>
        )}
      </h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: EASE, delay: 0.25 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
