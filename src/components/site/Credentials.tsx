import { useState } from 'react';
import { motion } from 'framer-motion';
import { achievements, certification } from '@/data/portfolio';
import { RevealText, SectionTag, Spotlight, Tilt } from '@/components/fx';

export default function Credentials() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(certification.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <section id="credentials" className="relative z-10 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionTag index="05" label="Credentials / Recognition" />
        <RevealText text="Verified, recorded, published." className="mb-14 max-w-3xl font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-tight" />

        <div className="grid gap-4 lg:grid-cols-12">
          <Tilt className="lg:col-span-5" max={8}>
            <div className="holo-card relative flex h-full min-h-[340px] flex-col justify-between overflow-hidden rounded-3xl border border-white/15 p-7">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">{certification.issuer}</div>
                  <div className="mt-3 font-display text-3xl font-bold leading-tight">{certification.name}</div>
                </div>
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/20 bg-black/30 font-display text-lg font-bold">AWS</div>
              </div>
              <div>
                <div className="grid grid-cols-2 gap-4 font-mono text-[11px] uppercase tracking-wider">
                  <div>
                    <div className="text-white/40">Issued</div>
                    <div className="mt-1 text-white">{certification.issued}</div>
                  </div>
                  <div>
                    <div className="text-white/40">Valid until</div>
                    <div className="mt-1 text-white">{certification.expires}</div>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <button onClick={copy} className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 font-mono text-xs text-white transition-colors hover:border-[var(--lime)]" data-cursor="Copy">
                    {copied ? '✓ copied' : certification.code}
                  </button>
                  <a href={certification.verify} target="_blank" rel="noreferrer" className="rounded-lg bg-white px-3 py-2 font-mono text-xs font-bold uppercase text-black transition-colors hover:bg-[var(--lime)]">
                    Verify ↗
                  </a>
                </div>
              </div>
            </div>
          </Tilt>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {achievements.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 30, rotateX: -12 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              >
                <Spotlight className="card h-full p-6" color={i % 2 ? 'rgba(198,255,61,0.14)' : 'rgba(255,138,61,0.16)'}>
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                    <span className="text-white/35">0{i + 1}</span>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-white/55">{a.tag}</span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-bold tracking-tight">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{a.detail}</p>
                </Spotlight>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
