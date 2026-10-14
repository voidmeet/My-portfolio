import { useEffect, useRef, useState, type ReactNode, type CSSProperties, type ElementType } from 'react';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { cn } from '@/lib/utils';
import { isTouch, prefersReducedMotion } from '@/lib/motion';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFKX';

/** Decodes text through random glyphs, like a terminal resolving a value. */
export function ScrambleText({
  text,
  className,
  speed = 28,
  trigger = true,
}: {
  text: string;
  className?: string;
  speed?: number;
  trigger?: boolean;
}) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!trigger || prefersReducedMotion()) {
      setOut(text);
      return;
    }
    let frame = 0;
    const total = text.length + 12;
    const id = window.setInterval(() => {
      frame++;
      const res = text
        .split('')
        .map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < frame - 10) return ch;
          if (i < frame) return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          return '';
        })
        .join('');
      setOut(res);
      if (frame >= total) {
        window.clearInterval(id);
        setOut(text);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, trigger, speed]);
  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}

/** Cycles through words with a scramble transition. */
export function RotatingScramble({ words, className, interval = 2600 }: { words: string[]; className?: string; interval?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);
  return <ScrambleText key={i} text={words[i]} className={className} />;
}

/** Wrapper that leans towards the pointer. */
export function Magnetic({ children, className, strength = 0.35 }: { children: ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });
  const onMove = (e: React.PointerEvent) => {
    if (isTouch()) return;
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset} className={cn('inline-block', className)}>
      {children}
    </motion.div>
  );
}

/** Card with a light that follows the pointer across its border and surface. */
export function Spotlight({
  children,
  className,
  color = 'rgba(61,224,255,0.16)',
  style,
}: {
  children: ReactNode;
  className?: string;
  color?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    ref.current!.style.setProperty('--mx', `${e.clientX - r.left}px`);
    ref.current!.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={cn('spotlight group/spot relative overflow-hidden rounded-3xl', className)}
      style={{ ...style, ['--spot' as string]: color }}
    >
      <div className="spotlight-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100" />
      {children}
    </div>
  );
}

/** 3D tilt + holographic glare. */
export function Tilt({ children, className, max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 160, damping: 18 });
  const ry = useSpring(0, { stiffness: 160, damping: 18 });
  const onMove = (e: React.PointerEvent) => {
    if (isTouch()) return;
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    ref.current!.style.setProperty('--gx', `${px * 100}%`);
    ref.current!.style.setProperty('--gy', `${py * 100}%`);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };
  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="tilt-card relative h-full w-full"
      >
        {children}
        <div className="holo pointer-events-none absolute inset-0 rounded-[inherit]" />
      </motion.div>
    </div>
  );
}

/** Counts up when scrolled into view. */
export function CountUp({ to, decimals = 0, className }: { to: number; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const ctrl = animate(0, to, {
      duration: prefersReducedMotion() ? 0 : 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals);
      },
    });
    return () => ctrl.stop();
  }, [inView, to, decimals]);
  return (
    <span ref={ref} className={className}>
      {(0).toFixed(decimals)}
    </span>
  );
}

/** Masked line-by-line reveal for headings. */
export function RevealText({
  text,
  className,
  delay = 0,
  as: Tag = 'h2',
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const words = text.split(' ');
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={{ y: '110%', rotate: 4 }}
            animate={inView ? { y: '0%', rotate: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.06 }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Small mono label used above section titles. */
export function SectionTag({ index, label }: { index: string; label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
      <span className="text-[var(--lime)]">{index}</span>
      <span className="h-px w-10 bg-white/20" />
      <span>{label}</span>
    </div>
  );
}
