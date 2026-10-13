import { motion } from 'framer-motion';
import { skillGroups } from '@/data/portfolio';
import { RevealText, SectionTag, Spotlight } from '@/components/fx';
import Terminal from './Terminal';

const ICONS: Record<string, string> = {
  cloud: '☁',
  k8s: '⎈',
  pipeline: '⟳',
  o11y: '◉',
  sys: '▣',
  lang: '{ }',
};

const TINTS = [
  'rgba(61,224,255,0.16)',
  'rgba(139,92,255,0.18)',
  'rgba(198,255,61,0.14)',
  'rgba(255,138,61,0.16)',
  'rgba(255,61,129,0.14)',
  'rgba(61,224,255,0.16)',
];

export default function Skills() {
  return (
    <section id="stack" data-scene="4" className="relative z-10 px-4 py-28 sm:px-6 sm:py-40">
      <div className="mx-auto max-w-7xl">
        <SectionTag index="04" label="Stack / Toolchain" />
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <RevealText text="The toolchain behind the uptime." className="max-w-3xl font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-tight" />
          <p className="max-w-xs text-sm text-white/50">Poke the terminal. It’s a real (tiny) shell with commands for everything on this page.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:row-span-2">
            <Terminal />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {skillGroups.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 2) * 0.08 }}
              >
                <Spotlight className="card h-full p-6" color={TINTS[i]}>
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 font-mono text-lg text-white/80">{ICONS[g.code]}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                      {String(g.items.length).padStart(2, '0')} tools
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold tracking-tight">{g.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <span key={s} className="chip chip-hover">
                        {s}
                      </span>
                    ))}
                  </div>
                </Spotlight>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
