import { useEffect, useRef, useState } from 'react';
import { isTouch } from '@/lib/motion';

/**
 * Dot + trailing ring cursor. The ring grows over interactive elements and
 * shows a label for anything with [data-cursor="label"].
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [hover, setHover] = useState(false);
  const [enabled] = useState(() => !isTouch());

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-cursor');
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let raf = 0;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    };
    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor], input, textarea');
      setHover(!!t);
      setLabel(t?.dataset.cursor ?? '');
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[200] mix-blend-difference">
        <div className="-ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-white" />
      </div>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[199]">
        <div
          className={`flex items-center justify-center rounded-full border transition-all duration-300 ease-out ${
            label
              ? 'border-transparent bg-[var(--lime)] text-black'
              : hover
                ? '-ml-7 -mt-7 h-14 w-14 border-[var(--cyan)] bg-cyan-300/10'
                : '-ml-4 -mt-4 h-8 w-8 border-white/40'
          }`}
          style={label ? { width: 88, height: 88, marginLeft: -44, marginTop: -44 } : undefined}
        >
          {label && <span className="font-mono text-[10px] font-bold uppercase tracking-widest">{label}</span>}
        </div>
      </div>
    </>
  );
}
