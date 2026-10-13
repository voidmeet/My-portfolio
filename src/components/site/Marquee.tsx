import { useEffect, useRef } from 'react';
import { marqueeTech } from '@/data/portfolio';
import { motionState, prefersReducedMotion } from '@/lib/motion';

/** A ribbon that speeds up, reverses and skews with your scroll velocity. */
function Row({ items, dir, outline }: { items: string[]; dir: 1 | -1; outline?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let x = 0;
    let skew = 0;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const v = motionState.velocity;
      const flip = v < -0.5 ? -1 : 1;
      x += dt * (60 + Math.abs(v) * 28) * dir * flip;
      skew += (Math.max(-12, Math.min(12, v * 0.6)) - skew) * 0.12;
      const el = track.current;
      if (el) {
        const half = el.scrollWidth / 2;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        el.style.transform = `translate3d(${x}px,0,0) skewX(${-skew}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [dir]);

  const list = [...items, ...items];
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <div ref={track} className="flex shrink-0 will-change-transform">
        {list.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className={`px-6 font-display text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase tracking-tight ${outline ? 'text-stroke' : 'text-white'}`}>{t}</span>
            <span className="text-[clamp(1.5rem,3vw,2.5rem)] text-[var(--lime)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  const half = Math.ceil(marqueeTech.length / 2);
  return (
    <section aria-label="Technologies" className="relative z-10 -rotate-2 overflow-hidden border-y border-white/10 bg-black/50 py-6 backdrop-blur-sm">
      <Row items={marqueeTech.slice(0, half)} dir={-1} />
      <Row items={marqueeTech.slice(half)} dir={1} outline />
    </section>
  );
}
