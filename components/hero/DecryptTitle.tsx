"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const GLYPHS = "01#$%&@*+=<>/\\{}[]?!XZ";
const FRAME_MS = 38;

/**
 * Matrix-style decode: letters fade in as noise, cycle through glyphs and
 * lock into place left-to-right. Deterministic glyph choice (no Math.random
 * during render) keeps it hydration-safe. Purely visual — render the real
 * text separately for assistive tech and crawlers.
 */
export function DecryptTitle({ text, delay = 0.5, className }: { text: string; delay?: number; className?: string }) {
  const reduce = usePrefersReducedMotion();
  const [frame, setFrame] = useState(-1);
  const letters = Array.from(text);
  const finalFrame = 12 + letters.length * 2.4;

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const start = performance.now() + delay * 1000;
    const loop = (now: number) => {
      const f = Math.floor((now - start) / FRAME_MS);
      if (f >= 0) setFrame(f);
      if (f <= finalFrame) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce, delay, finalFrame]);

  const current = reduce ? Number.POSITIVE_INFINITY : frame;

  return (
    <span className={cn("relative", className)}>
      {letters.map((char, i) => {
        if (char === " ") return <span key={i} aria-hidden> </span>;
        const appear = i * 0.9;
        const lock = 12 + i * 2.4;
        const visible = current >= appear;
        const locked = current >= lock;
        const glyph = locked ? char : GLYPHS[(i * 7 + Math.max(0, current) * 3) % GLYPHS.length];
        return (
          <span
            key={i}
            aria-hidden
            className={cn(
              "transition-opacity duration-300",
              visible ? "opacity-100" : "opacity-0",
              !locked && "text-neon-green [text-shadow:0_0_14px_rgb(57_255_136/0.8)]",
            )}
          >
            {glyph}
          </span>
        );
      })}
    </span>
  );
}
