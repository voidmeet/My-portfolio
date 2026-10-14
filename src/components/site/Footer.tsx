import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { profile } from '@/data/portfolio';
import { scrollToId } from '@/lib/scroll';

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], ['40%', '0%']);
  const clip = useTransform(scrollYProgress, [0.2, 1], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']);

  return (
    <footer ref={ref} className="relative z-10 overflow-hidden border-t border-white/10 bg-black/60 px-4 pt-14 backdrop-blur-sm sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {profile.name} · Built with React, Three.js & GSAP</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--lime)]" /> All systems operational
        </span>
        <button onClick={() => scrollToId('top')} className="text-left text-white/70 hover:text-[var(--lime)]">
          Back to top ↑
        </button>
      </div>
      <motion.div style={{ y }} className="relative mt-10 select-none">
        <div className="text-stroke whitespace-nowrap text-center font-display text-[13.5vw] font-bold uppercase leading-[0.8] tracking-[-0.05em]">{profile.name}</div>
        <motion.div style={{ clipPath: clip }} className="text-gradient absolute inset-0 whitespace-nowrap text-center font-display text-[13.5vw] font-bold uppercase leading-[0.8] tracking-[-0.05em]" aria-hidden>
          {profile.name}
        </motion.div>
      </motion.div>
    </footer>
  );
}
