import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { experienceYears, profile, roles } from '@/data/portfolio';
import { Magnetic, RotatingScramble } from '@/components/fx';
import { scrollToId } from '@/lib/scroll';

const ease = [0.16, 1, 0.3, 1] as const;

function Letters({ word, ready, delay, className }: { word: string; ready: boolean; delay: number; className?: string }) {
  return (
    <span className={`flex overflow-hidden ${className ?? ''}`} aria-hidden>
      {word.split('').map((c, i) => (
        <motion.span
          key={i}
          className="hero-letter inline-block"
          initial={{ y: '105%' }}
          animate={ready ? { y: '0%' } : {}}
          transition={{ duration: 1.1, ease, delay: delay + i * 0.05 }}
        >
          {c}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-35%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.8], ['blur(0px)', 'blur(10px)']);
  const years = experienceYears();

  return (
    <section ref={ref} id="top" data-scene="0" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-4 pb-8 pt-28 sm:px-6 lg:pb-10">
      <motion.div style={{ y, opacity, filter: blur }} className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/55"
        >
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 backdrop-blur">v3.0 · {new Date().getFullYear()}</span>
          <span>DevOps Engineer · Team Lead @ Multiicon</span>
        </motion.div>

        <h1 className="font-display font-bold uppercase leading-[0.82] tracking-[-0.05em]" aria-label={profile.name}>
          <Letters word={profile.first} ready={ready} delay={0.15} className="text-[clamp(4.5rem,17vw,17rem)]" />
          <Letters word={profile.last} ready={ready} delay={0.3} className="text-stroke text-[clamp(4.5rem,17vw,17rem)]" />
        </h1>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-12 lg:items-end">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 30 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 0.75 }}
          >
            <p className="max-w-md text-base leading-relaxed text-white/65 sm:text-lg">
              I build and run the platforms that keep production boring:{' '}
              <span className="text-white">Kubernetes, CI/CD and observability</span> on AWS, Hetzner and DigitalOcean.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Magnetic>
                <button onClick={() => scrollToId('work')} className="btn-primary" data-cursor="View">
                  <span>View my work</span>
                  <span aria-hidden>↘</span>
                </button>
              </Magnetic>
              <Magnetic>
                <a href={profile.resume} target="_blank" rel="noreferrer" className="btn-ghost">
                  Download CV
                </a>
              </Magnetic>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-4 lg:col-start-9"
            initial={{ opacity: 0, y: 30 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease, delay: 0.9 }}
          >
            <div className="glass rounded-2xl p-5 font-mono text-xs">
              <div className="mb-3 flex items-center justify-between text-white/40">
                <span>meet@infra:~</span>
                <span className="flex gap-1.5">
                  <i className="h-2 w-2 rounded-full bg-white/20" />
                  <i className="h-2 w-2 rounded-full bg-white/20" />
                  <i className="h-2 w-2 rounded-full bg-[var(--lime)]" />
                </span>
              </div>
              <div className="text-white/50">$ whoami --role</div>
              <div className="mt-1 text-lg text-white">
                <span className="text-[var(--cyan)]">›</span> <RotatingScramble words={roles} />
                <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-[var(--lime)] align-middle" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
                <div>
                  <div className="font-display text-xl text-white">{years}+</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40">years</div>
                </div>
                <div>
                  <div className="font-display text-xl text-white">99%+</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40">uptime</div>
                </div>
                <div>
                  <div className="font-display text-xl text-white">4</div>
                  <div className="text-[10px] uppercase tracking-wider text-white/40">clouds</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-10 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40"
        >
          <span>{profile.coords}</span>
          <button onClick={() => scrollToId('about')} className="flex items-center gap-3 hover:text-white">
            Scroll to deploy
            <span className="relative block h-8 w-px overflow-hidden bg-white/15">
              <span className="scroll-line absolute left-0 top-0 h-3 w-px bg-[var(--lime)]" />
            </span>
          </button>
          <span className="hidden sm:inline">{profile.location}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
