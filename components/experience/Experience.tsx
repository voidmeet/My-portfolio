"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { GitCommitHorizontal } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { credentials, milestones, roles } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";
import { anchorRef, sectionRef } from "@/lib/scene-state";
import { accentHex } from "@/lib/utils";
import { MilestoneCard } from "./MilestoneCard";
import { PipelineCable, type PipelineCableHandle } from "./PipelineCable";

const NODE_OFFSET = 40;

interface Geometry {
  width: number;
  nodes: { x: number; accent: string }[];
}

/**
 * Pinned horizontal timeline. Vertical scroll is converted into horizontal
 * travel; the fixed playhead (where the 3D packet rides) lights the cable and
 * advances each stage queued → running → passed as its node crosses.
 */
export function Experience() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const playhead = useRef<HTMLDivElement>(null);
  const cable = useRef<PipelineCableHandle>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const stageText = useRef<HTMLSpanElement>(null);
  const percentText = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const status = useRef<HTMLDivElement>(null);
  const sync = useRef<() => void>(() => {});
  const [geometry, setGeometry] = useState<Geometry>({ width: 0, nodes: [] });

  const setSection = useCallback((el: HTMLElement | null) => {
    section.current = el;
    return sectionRef("experience")(el);
  }, []);

  // re-apply the lit state once the cable has (re)rendered at its measured size
  useEffect(() => sync.current(), [geometry]);

  // measure the track so the SVG cable and its nodes match the real layout
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () =>
      setGeometry({
        width: el.scrollWidth,
        nodes: cards.current.map((card, i) => ({
          x: (card?.offsetLeft ?? 0) + NODE_OFFSET,
          accent: accentHex[milestones[i].accent],
        })),
      });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const sectionEl = section.current;
      const trackEl = track.current;
      if (!sectionEl || !trackEl) return;

      let nodeXs: number[] = [];
      let lastStage = "";
      const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);

      const update = (progress: number) => {
        const tx = Number(gsap.getProperty(trackEl, "x")) || 0;
        const lit = (playhead.current?.offsetLeft ?? 0) - tx;
        cable.current?.setLit(lit);

        let current = -1;
        nodeXs.forEach((x, i) => {
          if (x <= lit) current = i;
        });
        const complete = progress >= 0.995;
        cards.current.forEach((card, i) => {
          if (!card) return;
          const state = complete || i < current ? "passed" : i === current ? "running" : "queued";
          if (card.dataset.state !== state) card.dataset.state = state;
        });

        const label = complete
          ? "pipeline succeeded"
          : current < 0
            ? "awaiting trigger"
            : `stage ${String(current + 1).padStart(2, "0")}/${String(milestones.length).padStart(2, "0")} · ${milestones[current].stage}`;
        if (label !== lastStage && stageText.current) {
          stageText.current.textContent = label;
          lastStage = label;
        }
        if (status.current) status.current.dataset.complete = String(complete);
        if (percentText.current) percentText.current.textContent = `${Math.round(progress * 100)}%`.padStart(4, "0");
        if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
      };

      const mm = gsap.matchMedia();
      mm.add("(min-height: 560px)", () => {
        // ScrollTrigger refreshes (and fires onUpdate) inside gsap.to(), before assignment
        let tween: gsap.core.Tween | null = null;
        tween = gsap.to(trackEl, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: () => {
              nodeXs = cards.current.map((card) => (card?.offsetLeft ?? 0) + NODE_OFFSET);
            },
          },
          onUpdate: () => update(tween?.progress() ?? 0),
        });
        nodeXs = cards.current.map((card) => (card?.offsetLeft ?? 0) + NODE_OFFSET);
        sync.current = () => update(tween?.progress() ?? 0);
        sync.current();
        return () => {
          sync.current = () => {};
        };
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section
      id="pipeline"
      ref={setSection}
      className="relative z-10 h-svh overflow-hidden short:h-auto short:overflow-visible short:py-24"
      style={{ "--line-y": "clamp(230px, 35svh, 330px)" } as CSSProperties}
    >
      {/* header */}
      <div className="absolute inset-x-0 top-0 z-20 px-5 pt-24 sm:px-8 sm:pt-28 short:static short:pt-0">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            index="02"
            kicker="git log --graph --deploys"
            title="The pipeline"
            className="[&_h2]:text-[clamp(2.1rem,4.6vw,3.8rem)]"
          />
          <div ref={status} data-complete="false" className="group/status w-full max-w-xs font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 md:pb-2">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="relative flex size-1.5">
                  <span className="absolute inset-0 animate-ping-soft rounded-full bg-neon-blue group-data-[complete=true]/status:bg-neon-green" />
                  <span className="relative size-1.5 rounded-full bg-neon-blue group-data-[complete=true]/status:bg-neon-green" />
                </span>
                <span ref={stageText} className="text-white/70 group-data-[complete=true]/status:text-neon-green">
                  awaiting trigger
                </span>
              </span>
              <span ref={percentText} className="tabular-nums text-white/35">
                000%
              </span>
            </div>
            <span className="mt-3 block h-px w-full overflow-hidden bg-white/10">
              <span
                ref={bar}
                className="block h-full origin-left scale-x-0 bg-linear-to-r from-neon-blue via-neon-purple to-neon-green"
              />
            </span>
          </div>
        </div>
      </div>

      {/* playhead: the 3D data packet rides here */}
      <div
        ref={playhead}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-(--line-y) z-10 size-[116px] -translate-x-1/2 -translate-y-1/2 short:invisible"
      >
        <div ref={anchorRef("experience")} className="absolute inset-0" />
        <span className="absolute left-1/2 top-[-34px] -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.3em] text-neon-blue/80">
          head
        </span>
        <span className="absolute inset-0 rounded-full border border-dashed border-white/10" />
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 top-[calc(var(--line-y)+70px)] w-px -translate-x-1/2 bg-linear-to-b from-white/10 to-transparent short:hidden"
      />

      {/* horizontally travelling track */}
      <div
        ref={track}
        className="absolute left-0 top-(--line-y) flex h-[calc(100svh-var(--line-y))] w-max items-start gap-8 pl-[calc(50vw+90px)] pr-[6vw] will-change-transform short:static short:h-auto short:w-auto short:flex-col short:px-5 short:pt-10 lg:gap-12"
      >
        {/* origin: where every deploy starts */}
        <div className="pointer-events-none absolute left-[max(20px,5vw)] top-14 hidden w-[min(34vw,380px)] font-mono md:block short:hidden">
          <p className="text-[11px] text-white/45">
            <span className="text-neon-green">$</span> git push origin main
          </p>
          <p className="mt-2 text-[11px] text-white/30">
            → triggered pipeline <span className="text-neon-blue/80">#2024-05</span> · {milestones.length} stages
          </p>
          <p className="mt-6 max-w-xs font-sans text-sm leading-relaxed text-white/45">
            Every role shipped something to production. Scroll to run the pipeline — each stage turns green as the packet
            passes through.
          </p>
        </div>

        {milestones.map((milestone, i) => (
          <MilestoneCard
            key={milestone.stage}
            ref={(el) => {
              cards.current[i] = el;
            }}
            milestone={milestone}
            index={i}
            total={milestones.length}
            nodeOffset={NODE_OFFSET}
          />
        ))}

        <aside className="w-[min(84vw,430px)] shrink-0 pt-14 short:pt-0 lg:w-[440px]">
          <div className="glass-panel rounded-[26px] p-6 font-mono text-xs sm:p-7">
            <p className="text-white/45">
              <span className="text-neon-green">$</span> git log --oneline --decorate
            </p>
            <ol className="mt-5 space-y-3.5">
              {roles.map((role) => (
                <li key={role.hash} className="flex gap-3">
                  <GitCommitHorizontal className="mt-0.5 size-3.5 shrink-0 text-neon-purple/70" aria-hidden />
                  <div className="min-w-0">
                    <p className="leading-relaxed text-white/80">
                      <span className="text-neon-blue/80">{role.hash}</span>{" "}
                      {"ref" in role && <span className="text-neon-green/90">({role.ref}) </span>}
                      {role.title} @ {role.org}
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/35">
                      {role.period} · {role.place} — {role.note}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 space-y-1.5 border-t border-white/[0.06] pt-4 text-[11px] text-white/40">
              <p>
                <span className="text-neon-purple/80">edu</span> {credentials.education}
              </p>
              <p>
                <span className="text-neon-purple/80">cert</span> {credentials.certification}
              </p>
            </div>
          </div>
        </aside>

        {geometry.width > 0 && <PipelineCable ref={cable} width={geometry.width} nodes={geometry.nodes} />}
      </div>
    </section>
  );
}
