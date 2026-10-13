"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Maximum tilt in degrees. */
  max?: number;
}

/**
 * Pointer-driven 3D tilt with a cursor-following spotlight. Children can use
 * `translateZ()` to float above the card plane (preserve-3d).
 */
export function TiltCard({ children, className, style, max = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const spring = { stiffness: 170, damping: 18, mass: 0.6 };
  const rotateX = useSpring(rx, spring);
  const rotateY = useSpring(ry, spring);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (e.pointerType !== "mouse" || !el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ ...style, rotateX, rotateY, transformPerspective: 1200, transformStyle: "preserve-3d" }}
      className={cn("group/tilt relative", className)}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgb(255 255 255 / 0.07), transparent 45%)",
        }}
      />
    </motion.div>
  );
}
