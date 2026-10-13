import type { CSSProperties, Ref } from "react";
import type { Milestone } from "@/lib/data";
import { accentHex } from "@/lib/utils";

interface MilestoneCardProps {
  ref?: Ref<HTMLElement>;
  milestone: Milestone;
  index: number;
  total: number;
  /** Horizontal distance from the card's left edge to its cable node. */
  nodeOffset: number;
}

/** A pipeline stage. `data-state` (queued → running → passed) is driven by the scroll timeline. */
export function MilestoneCard({ ref, milestone, index, total, nodeOffset }: MilestoneCardProps) {
  const accent = accentHex[milestone.accent];

  return (
    <article
      ref={ref}
      data-state="queued"
      className="group/ms relative w-[min(84vw,440px)] shrink-0 pt-14 short:pt-0 lg:w-[460px]"
      style={{ "--accent": accent } as CSSProperties}
    >
      {/* drop cable from the node to the card */}
      <span
        aria-hidden
        className="absolute top-0 h-14 w-px bg-white/10 short:hidden"
        style={{ left: nodeOffset }}
      >
        <span className="absolute inset-0 origin-top scale-y-0 bg-linear-to-b from-(--accent) to-(--accent)/20 transition-transform duration-700 ease-out group-data-[state=passed]/ms:scale-y-100 group-data-[state=running]/ms:scale-y-100" />
      </span>

      <div className="glass-panel relative overflow-hidden rounded-[26px] p-6 transition-[border-color,box-shadow,opacity] duration-700 group-data-[state=queued]/ms:opacity-55 group-data-[state=running]/ms:border-(--accent)/45 group-data-[state=running]/ms:shadow-[0_0_80px_-34px_var(--accent)] sm:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-(--accent)/10 opacity-0 blur-3xl transition-opacity duration-700 group-data-[state=running]/ms:opacity-100"
        />

        <div className="relative flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-white/55">
            stage: <span className="text-(--accent)">{milestone.stage}</span>
          </span>
          <span className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-white/35 group-data-[state=queued]/ms:inline-flex">
              <span className="size-1.5 rounded-full border border-white/40" /> queued
            </span>
            <span className="hidden items-center gap-1.5 text-(--accent) group-data-[state=running]/ms:inline-flex">
              <span className="size-2.5 animate-spin rounded-full border border-current border-t-transparent" /> running
            </span>
            <span className="hidden items-center gap-1.5 text-neon-green group-data-[state=passed]/ms:inline-flex">
              ✓ passed
            </span>
            <span className="text-white/25">
              {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
            </span>
          </span>
        </div>

        <h3 className="relative mt-5 font-display text-[22px] font-semibold leading-tight tracking-tight text-white sm:text-2xl">
          {milestone.title}
        </h3>
        <p className="relative mt-2 font-mono text-[11px] text-white/40">
          {milestone.org} <span className="text-white/20">·</span> {milestone.period}
        </p>

        <div className="relative mt-5 flex items-baseline gap-3 border-y border-white/[0.06] py-4">
          <span className="font-display text-3xl font-semibold tracking-tight text-(--accent)">{milestone.metric.value}</span>
          <span className="font-mono text-[10px] uppercase leading-snug tracking-[0.18em] text-white/45">
            {milestone.metric.label}
          </span>
        </div>

        <p className="relative mt-4 text-sm leading-relaxed text-white/65">{milestone.summary}</p>

        <ul className="relative mt-3 hidden space-y-2 tall:block">
          {milestone.points.map((point) => (
            <li key={point} className="flex gap-2.5 text-[13px] leading-relaxed text-white/45">
              <span className="mt-[0.55em] size-1 shrink-0 rounded-full bg-(--accent)/70" />
              {point}
            </li>
          ))}
        </ul>

        <ul className="relative mt-5 flex flex-wrap gap-1.5">
          {milestone.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-white/55"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
