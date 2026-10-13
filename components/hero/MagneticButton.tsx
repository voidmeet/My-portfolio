"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  /** How far the button travels toward the cursor (0..1 of the offset). */
  strength?: number;
  ariaLabel?: string;
}

/**
 * Magnetic CTA: a padded invisible field pulls the button toward the cursor,
 * the label lags behind for parallax, and a conic border orbits the edge.
 */
export function MagneticButton({ children, onClick, className, strength = 0.38, ariaLabel }: MagneticButtonProps) {
  const field = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 260, damping: 18, mass: 0.5 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const lx = useTransform(sx, (v) => v * 0.45);
  const ly = useTransform(sy, (v) => v * 0.45);
  const glowX = useTransform(sx, (v) => `${50 + v}%`);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !field.current) return;
    const r = field.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div ref={field} onPointerMove={onMove} onPointerLeave={reset} className="-m-6 inline-flex p-6">
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        style={{ x: sx, y: sy }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "group relative isolate inline-flex h-14 items-center overflow-hidden rounded-full p-px",
          "shadow-[0_0_0_1px_rgb(255_255_255/0.06),0_20px_60px_-20px_rgb(34_211_238/0.55)] transition-shadow duration-500",
          "hover:shadow-[0_0_0_1px_rgb(255_255_255/0.1),0_20px_70px_-15px_rgb(34_211_238/0.85)]",
          className,
        )}
      >
        <span aria-hidden className="conic-border absolute inset-[-150%] animate-spin-border" />
        <span className="relative flex h-full items-center gap-3 rounded-full bg-ink-950/95 px-7">
          <motion.span
            aria-hidden
            style={{ left: glowX }}
            className="pointer-events-none absolute top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-blue/25 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          />
          <motion.span style={{ x: lx, y: ly }} className="relative flex items-center gap-3">
            {children}
          </motion.span>
        </span>
      </motion.button>
    </div>
  );
}
