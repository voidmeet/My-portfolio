import { useLayoutEffect, useRef, useState } from 'react';
import { experience } from '@/data/portfolio';
import { RevealText, SectionTag, Spotlight } from '@/components/fx';
import { gsap, ScrollTrigger } from '@/lib/scroll';
import { prefersReducedMotion } from '@/lib/motion';

// Oldest first: the career reads like a pipeline run, commit → deploy.
const jobs = [...experience].reverse();
const STAGES = ['commit', 'build', 'test', 'deploy'];

function JobCard({ job, i }: { job: (typeof jobs)[number]; i: number }) {
  return (
    <Spotlight className="card flex h-full flex-col p-6 sm:p-8" color={job.current ? 'rgba(198,255,61,0.16)' : 'rgba(61,224,255,0.14)'}>
      <div className="flex items-start justify-between gap-4">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
          stage {i + 1}/4 · <span className="text-[var(--cyan)]">{job.stage}</span>
        </div>
        {job.current ? (
          <span className="flex items-center gap-2 rounded-full border border-volt/40 bg-volt/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--lime)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--lime)]" /> running
          </span>
        ) : (
          <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white/50">✓ passed</span>
        )}
      </div>
      <div className="mt-8 font-display text-[clamp(2.25rem,4vw,3.5rem)] font-bold leading-none tracking-tight">{job.company}</div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60">
        <span className="text-white">{job.role}</span>
        <span className="text-white/25">/</span>
        <span>{job.place}</span>
      </div>
      <div className="mt-1 font-mono text-xs text-[var(--lime)]">{job.period}</div>
      <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-white/70">
        {job.points.map((p) => (
          <li key={p} className="flex gap-3">
            <span className="mt-2.5 h-1 w-3 shrink-0 bg-[var(--cyan)]" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-2 pt-8">
        {job.stack.map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
      </div>
    </Spotlight>
  );
}

export default function Experience() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth + 48;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
            setStage(Math.min(3, Math.floor(self.progress * 4.2)));
          },
          onRefresh: () => window.dispatchEvent(new Event('scene:measure')),
        },
      });
      return () => tween.scrollTrigger?.kill();
    });
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(t);
      mm.revert();
    };
  }, []);

  return (
    <section ref={section} id="experience" data-scene="2" className="relative z-10 overflow-hidden lg:h-screen">
      <div className="flex h-full flex-col px-4 pt-24 sm:px-6 lg:pt-24">
        <div className="mx-auto w-full max-w-7xl">
          <SectionTag index="02" label="Experience / Pipeline" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <RevealText text="Career, shipped in stages." className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-tight" />
            {/* pipeline status */}
            <div className="hidden w-[420px] shrink-0 lg:block">
              <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                {STAGES.map((s, i) => (
                  <span key={s} className={i <= stage ? 'text-[var(--lime)]' : 'text-white/30'}>
                    {i <= stage ? '●' : '○'} {s}
                  </span>
                ))}
              </div>
              <div className="mt-3 h-px w-full bg-white/10">
                <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-[var(--cyan)] to-[var(--lime)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex-1 lg:mt-8 lg:flex lg:items-center lg:pb-8">
          <div ref={track} className="mx-auto flex max-w-7xl flex-col gap-4 lg:mx-0 lg:max-w-none lg:flex-row lg:gap-6 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:pr-6">
            {jobs.map((job, i) => (
              <div key={job.company} className="relative lg:h-[min(60vh,560px)] lg:w-[min(42vw,620px)] lg:shrink-0">
                <JobCard job={job} i={i} />
              </div>
            ))}
            <div className="hidden shrink-0 flex-col justify-center pl-10 pr-24 lg:flex lg:w-[28vw]">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">$ kubectl get deploy</div>
              <div className="mt-3 font-display text-5xl font-bold leading-none">
                Next stage:
                <br />
                <span className="text-gradient">your team?</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
