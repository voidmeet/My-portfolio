import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { prefersReducedMotion } from '@/lib/motion';

const BOOT = [
  '$ terraform apply -auto-approve',
  '  + module.meet_bundela ........ created',
  '$ helm upgrade --install portfolio ./chart',
  '  release "portfolio" deployed',
  '$ kubectl rollout status deploy/portfolio',
  '  deployment successfully rolled out',
  '$ curl -I https://meetbundela.in',
  '  HTTP/2 200 · all systems operational',
];

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [lines, setLines] = useState(0);
  const [open, setOpen] = useState(true);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const total = prefersReducedMotion() ? 300 : 2300;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      const eased = 1 - Math.pow(1 - t, 2.4);
      setCount(Math.round(eased * 100));
      setLines(Math.floor(t * BOOT.length + 0.5));
      if (t < 1) raf = requestAnimationFrame(tick);
      else
        window.setTimeout(() => {
          setOpen(false);
          done.current();
        }, 280);
    };
    raf = requestAnimationFrame(tick);
    document.documentElement.classList.add('is-loading');
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.classList.remove('is-loading');
      }}
    >
      {open && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#04050a] p-6 text-white sm:p-10"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-start justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            <span>MB / Portfolio v3.0</span>
            <span className="hidden sm:block">Rajkot · IN · 22.30°N 70.80°E</span>
          </div>

          <div className="max-w-xl font-mono text-[12px] leading-6 sm:text-[13px]">
            {BOOT.slice(0, lines).map((l, i) => (
              <div key={i} className={l.startsWith('$') ? 'text-white/80' : 'text-[var(--lime)]'}>
                {l}
              </div>
            ))}
            <span className="inline-block h-4 w-2 animate-pulse bg-[var(--cyan)] align-middle" />
          </div>

          <div>
            <div className="mb-4 h-px w-full overflow-hidden bg-white/10">
              <div className="h-full bg-gradient-to-r from-[var(--cyan)] via-[var(--violet)] to-[var(--lime)]" style={{ width: `${count}%` }} />
            </div>
            <div className="flex items-end justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Provisioning experience</span>
              <span className="font-display text-[22vw] font-bold leading-[0.8] tracking-tighter sm:text-[14vw]">
                {String(count).padStart(3, '0')}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
