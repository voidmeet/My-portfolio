import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { education, experienceYears, languages, profile, stats } from '@/data/portfolio';
import { CountUp, SectionTag, Spotlight, Tilt } from '@/components/fx';

const MANIFESTO =
  'I turn fragile servers into self-healing platforms. Pipelines that ship on every commit, clusters that scale on their own, and dashboards that show the problem before anyone opens a ticket.';

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity, y }} className="inline-block">
        {children}
      </motion.span>
    </span>
  );
}

function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = MANIFESTO.split(' ');
  return (
    <p ref={ref} className="font-display text-[clamp(1.75rem,4.2vw,3.75rem)] font-medium leading-[1.08] tracking-tight">
      {words.map((w, i) => {
        const start = i / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]}>
            {w}
          </Word>
        );
      })}
    </p>
  );
}

export default function About() {
  const years = Number(experienceYears());
  return (
    <section id="about" data-scene="1" className="relative z-10 px-4 py-28 sm:px-6 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionTag index="01" label="About / Whoami" />
        <div className="lg:pl-[16%]">
          <Manifesto />
        </div>

        <div className="mt-20 grid auto-rows-[minmax(160px,auto)] gap-4 sm:mt-28 md:grid-cols-6 lg:grid-cols-12">
          {/* Portrait */}
          <Tilt className="md:col-span-3 md:row-span-3 lg:col-span-4">
            <div className="portrait group relative h-full min-h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <img
                src="/meet-bundela.jpg"
                alt="Portrait of Meet Bundela"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="scanlines pointer-events-none absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--lime)]">● online · {profile.location}</div>
                <div className="mt-1 font-display text-2xl font-bold">{profile.name}</div>
                <div className="text-sm text-white/60">{profile.role}</div>
              </div>
            </div>
          </Tilt>

          {/* Summary */}
          <Spotlight className="card p-6 sm:p-8 md:col-span-3 md:row-span-2 lg:col-span-5">
            <div className="label">Summary</div>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">{profile.summary}</p>
          </Spotlight>

          {/* Stats */}
          {stats.map((s, i) => (
            <Spotlight
              key={s.label}
              className={`card flex flex-col justify-between p-6 md:col-span-3 ${i < 2 ? 'lg:col-span-3' : 'lg:col-span-4'}`}
              color={i % 2 ? 'rgba(198,255,61,0.14)' : 'rgba(139,92,255,0.18)'}
            >
              <div className="label">0{i + 1}</div>
              <div>
                <div className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
                  <CountUp to={s.dynamic ? years : s.value} decimals={s.decimals} />
                  <span className="text-[var(--lime)]">{s.suffix}</span>
                </div>
                <div className="mt-1 text-sm text-white/55">{s.label}</div>
              </div>
            </Spotlight>
          ))}

          {/* Education */}
          <Spotlight className="card p-6 md:col-span-4 lg:col-span-8">
            <div className="label">Education</div>
            <ul className="mt-4 space-y-4">
              {education.map((e) => (
                <li key={e.degree} className="flex items-start justify-between gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium text-white">{e.degree}</div>
                    <div className="text-sm text-white/50">{e.school}</div>
                  </div>
                  <div className="shrink-0 text-right font-mono text-[11px] text-white/50">
                    <div>{e.period}</div>
                    {e.note && <div className="text-[var(--lime)]">{e.note}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </Spotlight>

          {/* Languages */}
          <Spotlight className="card flex flex-col justify-between p-6 md:col-span-2 lg:col-span-4">
            <div className="label">Speaks</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {languages.map((l) => (
                <span key={l} className="chip">
                  {l}
                </span>
              ))}
            </div>
          </Spotlight>
        </div>
      </div>
    </section>
  );
}
