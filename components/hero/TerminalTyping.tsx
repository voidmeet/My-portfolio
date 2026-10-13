"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const SPINNER = ["·  ", "·· ", "···", " ··", "  ·", "   "];

/** Boot-log style typing line: `[ ·· ] System Onl█` → `[ OK ] System Online // …` */
export function TerminalTyping({
  text,
  delay = 0.35,
  speed = 34,
  className,
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduce) return;
    let typed = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      typed += 1;
      setCount(typed);
      // brief pause on separators reads like a real boot log
      const pause = text[typed - 1] === "/" ? 140 : 0;
      if (typed < text.length) timer = setTimeout(step, speed + pause + (typed % 4) * 9);
    };
    timer = setTimeout(step, delay * 1000);
    return () => clearTimeout(timer);
  }, [text, delay, speed, reduce]);

  const shown = reduce ? text : text.slice(0, count);
  const done = shown.length === text.length;

  return (
    <p className={cn("font-mono text-[10px] tracking-[0.06em] sm:text-xs sm:tracking-[0.14em]", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex items-center whitespace-pre">
        <span className="text-white/35">[</span>
        <span className={cn("inline-block w-[3.2ch] text-center", done ? "text-neon-green" : "text-neon-blue")}>
          {done ? " OK" : SPINNER[count % SPINNER.length]}
        </span>
        <span className="text-white/35">]</span>
        <span className="ml-2 uppercase text-neon-green/90 sm:ml-3">{shown}</span>
        <span
          className={cn(
            "ml-1 inline-block h-[1.15em] w-[0.6em] bg-neon-green shadow-[0_0_12px_rgb(57_255_136/0.8)]",
            done && "animate-blink",
          )}
        />
      </span>
    </p>
  );
}
