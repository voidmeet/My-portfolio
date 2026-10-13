"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { SkillIcon } from "@/components/ui/SkillIcon";
import type { StackCategory } from "@/lib/data";
import { anchorRef, sceneState, type AnchorKey } from "@/lib/scene-state";
import { accentHex, cn } from "@/lib/utils";
import { TiltCard } from "./TiltCard";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Decorative shell output for cards with room to spare. */
const SNIPPETS: Record<string, { cmd: string; out: string[] }> = {
  containers: { cmd: "kubectl get pods -n prod", out: ["ctrunk-api-7d9f8   1/1   Running", "vani-web-5c4b2    1/1   Running"] },
  cloud: { cmd: "argocd app sync prod", out: ["Sync Status:    Synced", "Health Status:  Healthy"] },
  os: { cmd: "sudo nginx -t", out: ["syntax is ok", "test is successful"] },
};

interface TechCardProps {
  category: StackCategory;
  index: number;
  className?: string;
}

/**
 * Glass skill card that "boots" when the 3D voxels dock into its power port.
 * The port is a masked hole in the card body, so the WebGL layer underneath
 * shows through crisply instead of being blurred behind glass.
 */
export function TechCard({ category, index, className }: TechCardProps) {
  const card = useRef<HTMLElement>(null);
  const accent = accentHex[category.accent];
  const snippet = SNIPPETS[category.id];
  const n = category.skills.length;

  // Without WebGL nothing docks — power the card when it scrolls into view instead.
  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !sceneState.webglReady) el.dataset.powered = "true";
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <motion.article
      ref={card}
      data-tech-card
      initial={{ opacity: 0, y: 90, rotateX: -14, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.25, ease: EASE, delay: (index % 2) * 0.1 }}
      style={{ transformPerspective: 1400, "--accent": accent } as CSSProperties}
      className={cn("group/card relative", className)}
    >
      <div
        className="h-full animate-float"
        style={{ animationDelay: `${-index * 1.9}s`, animationDuration: `${7.5 + index * 0.8}s` }}
      >
        <TiltCard className="h-full rounded-[28px]">
          {/* glass body with the power-port punched out */}
          <div
            aria-hidden
            className="glass-panel port-mask absolute inset-0 rounded-[28px]"
            style={{ "--port-x": "calc(100% - 66px)", "--port-y": "66px", "--port-r": "42px" } as CSSProperties}
          />
          {/* energised border */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-1000 group-data-[powered=true]/card:opacity-100"
            style={{
              padding: 1,
              background: `linear-gradient(140deg, ${accent}, transparent 38%, transparent 62%, ${accent}66)`,
              mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-[28px] opacity-0 shadow-[0_0_70px_-25px_var(--accent)] transition-opacity duration-1000 group-data-[powered=true]/card:opacity-100"
          />

          {/* power port */}
          <div className="absolute right-6 top-6 size-[84px]">
            <div ref={anchorRef(`stack-${index}` as AnchorKey)} aria-hidden className="absolute inset-0 rounded-full" />
            <div className="absolute inset-0 rounded-full border border-white/10 transition-[border-color,box-shadow] duration-700 group-data-[powered=true]/card:border-(--accent)/60 group-data-[powered=true]/card:shadow-[0_0_28px_-4px_var(--accent),inset_0_0_22px_-6px_var(--accent)]" />
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              className="absolute -inset-2 size-[100px] animate-[spin_14s_linear_infinite] text-white/15 transition-colors duration-700 group-data-[powered=true]/card:text-(--accent)/70"
            >
              <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 7" />
            </svg>
            <span className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
              <span className="size-1.5 rounded-full bg-white/20 transition-all duration-500 group-data-[powered=true]/card:bg-(--accent) group-data-[powered=true]/card:shadow-[0_0_8px_var(--accent)]" />
              pwr
            </span>
          </div>

          <div className="relative flex h-full flex-col p-6 sm:p-7 [transform:translateZ(40px)]">
            <div className="pr-28">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
                <span className="text-(--accent)">0{index + 1}</span> · {category.namespace}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
                {category.label}
              </h3>
              <p className="mt-1 text-sm text-white/45">
                {n} services · {category.title}
              </p>
            </div>

            <ul className="mt-7 grid grid-cols-[minmax(0,1fr)] gap-2.5">
              {category.skills.map((skill, i) => (
                <li
                  key={skill.name}
                  className="flex min-w-0 items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3 transition-colors duration-500 hover:border-white/15 hover:bg-white/[0.04]"
                >
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-ink-900 text-white/45 transition-[color,box-shadow,border-color] duration-700 group-data-[powered=true]/card:border-(--accent)/30 group-data-[powered=true]/card:text-(--accent) group-data-[powered=true]/card:shadow-[0_0_24px_-8px_var(--accent)]"
                    style={{ transitionDelay: `${150 + i * 110}ms` }}
                  >
                    <SkillIcon name={skill.icon} className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[15px] font-semibold tracking-tight text-white">{skill.name}</p>
                    <p className="truncate font-mono text-[11px] text-white/40">{skill.detail}</p>
                  </div>
                  <span
                    className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-500"
                    style={{ transitionDelay: `${200 + i * 110}ms` }}
                  >
                    <span className="text-white/25 group-data-[powered=true]/card:hidden">standby</span>
                    <span className="hidden items-center gap-1.5 text-neon-green group-data-[powered=true]/card:inline-flex">
                      <span className="size-1 rounded-full bg-neon-green shadow-[0_0_6px_var(--color-neon-green)]" />
                      running
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            {snippet && (
              <div className="mt-4 flex-1 rounded-2xl border border-white/[0.05] bg-black/30 px-4 py-3 font-mono text-[11px] leading-relaxed">
                <p className="text-white/45">
                  <span className="text-neon-green/80">$</span> {snippet.cmd}
                </p>
                {snippet.out.map((line) => (
                  <p
                    key={line}
                    className="whitespace-pre text-white/20 transition-colors duration-700 group-data-[powered=true]/card:text-white/55"
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              <span>
                pods{" "}
                <span className="text-white/50 group-data-[powered=true]/card:hidden">0/{n}</span>
                <span className="hidden text-white group-data-[powered=true]/card:inline">
                  {n}/{n}
                </span>{" "}
                ready
              </span>
              <span aria-hidden className="flex h-4 items-end gap-[3px]">
                {Array.from({ length: 9 }, (_, i) => (
                  <span
                    key={i}
                    className="h-full w-[3px] origin-bottom scale-y-[0.2] rounded-full bg-white/15 transition-colors duration-700 [animation-play-state:paused] group-data-[powered=true]/card:animate-eq group-data-[powered=true]/card:bg-(--accent)/70 group-data-[powered=true]/card:[animation-play-state:running]"
                    style={{ animationDelay: `${-i * 0.13}s`, animationDuration: `${0.9 + (i % 4) * 0.18}s` }}
                  />
                ))}
              </span>
            </div>
          </div>
        </TiltCard>
      </div>
    </motion.article>
  );
}
