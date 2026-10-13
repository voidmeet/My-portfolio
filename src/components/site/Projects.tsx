import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { projects, type Project } from '@/data/portfolio';
import { RevealText, SectionTag } from '@/components/fx';

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** For projects without a screenshot: a manifest that describes the work. */
function Manifest({ p }: { p: Project }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#06070d] p-6">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl" style={{ background: p.accent, opacity: 0.25 }} />
      <pre className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-5 font-mono text-[12px] leading-6 text-white/70 backdrop-blur sm:text-[13px]">
        <span className="text-white/35"># {slug(p.title)}.yaml</span>
        {'\n'}
        <span style={{ color: p.accent }}>apiVersion</span>: platform/v1{'\n'}
        <span style={{ color: p.accent }}>kind</span>: {p.kind.replace(/\s+/g, '')}{'\n'}
        <span style={{ color: p.accent }}>metadata</span>:{'\n'}
        {'  '}name: {slug(p.title)}{'\n'}
        {'  '}owner: meet-bundela{'\n'}
        <span style={{ color: p.accent }}>spec</span>:{'\n'}
        {'  '}stack:{'\n'}
        {p.tags.map((t) => (
          <span key={t}>
            {'    '}- {t}
            {'\n'}
          </span>
        ))}
        <span style={{ color: p.accent }}>status</span>: <span className="text-[var(--lime)]">“{p.impact}”</span>
      </pre>
    </div>
  );
}

function Card({ p, i, total, progress }: { p: Project; i: number; total: number; progress: MotionValue<number> }) {
  const target = 1 - (total - i) * 0.035;
  // card i is on top at progress i/(total-1); the next one covers it by (i+1)/(total-1)
  const step = 1 / (total - 1);
  const scale = useTransform(progress, [i * step, 1], [1, target]);
  const dim = useTransform(progress, [(i + 0.5) * step, (i + 1) * step], [0, i === total - 1 ? 0 : 0.6]);
  return (
    <div className="sticky top-0 flex h-[100svh] items-start justify-center px-4 pt-[11svh] sm:px-6">
      <motion.article
        style={{ scale, top: `calc(${i * 22}px)` }}
        className="relative w-full max-w-6xl origin-top overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0b12]/95 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl"
        data-cursor="Case"
      >
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }} />
        <div className="grid md:h-[74svh] md:max-h-[640px] md:grid-cols-2">
          <div className="flex flex-col p-6 sm:p-8 lg:p-10">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
              <span>
                <span style={{ color: p.accent }}>{String(i + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
              </span>
              <span>{p.kind}</span>
            </div>
            <h3 className="mt-8 font-display text-[clamp(2rem,4.2vw,3.75rem)] font-bold leading-[0.95] tracking-tight">{p.title}</h3>
            <div className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-white/45">{p.client}</div>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/65 sm:text-base">{p.blurb}</p>
            <div className="mt-auto pt-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-black" style={{ background: p.accent }}>
                ↗ {p.impact}
              </div>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className={`group relative overflow-hidden md:h-auto ${p.image ? 'h-40' : 'hidden md:block'} border-t border-white/10 md:border-l md:border-t-0`}>
            {p.image ? (
              <>
                <img src={p.image} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover grayscale-[60%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 mix-blend-color opacity-40 transition-opacity duration-700 group-hover:opacity-0" style={{ background: p.accent }} />
              </>
            ) : (
              <Manifest p={p} />
            )}
          </div>
        </div>
        <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-black" />
      </motion.article>
    </div>
  );
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return (
    <section id="work" data-scene="3" className="relative z-10 pt-28 sm:pt-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTag index="03" label="Selected work" />
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <RevealText text="Infrastructure I’ve built, migrated and kept alive." className="max-w-4xl font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-tight" />
          <p className="max-w-xs text-sm text-white/50">Production systems for a government railway board, fintech, logistics, real estate and a blockchain validator.</p>
        </div>
      </div>
      <div ref={ref} className="relative mt-10">
        {projects.map((p, i) => (
          <Card key={p.title} p={p} i={i} total={projects.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
