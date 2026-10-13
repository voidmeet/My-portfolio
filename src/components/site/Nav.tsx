import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { navLinks, profile } from '@/data/portfolio';
import { scrollToId } from '@/lib/scroll';

function useLocalTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: profile.timezone }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setT(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return t;
}

export default function Nav({ ready }: { ready: boolean }) {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const time = useLocalTime();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const els = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 400);
      last = y;
      if (y < window.innerHeight * 0.5) setActive('');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <motion.div className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[var(--cyan)] via-[var(--violet)] to-[var(--lime)]" style={{ scaleX: progress }} />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={ready ? { y: hidden && !open ? -100 : 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button onClick={() => go('top')} className="group flex items-center gap-3" aria-label="Back to top">
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-white/10 bg-black/40 font-display text-sm font-bold backdrop-blur-xl">
              <span className="transition-transform duration-500 group-hover:-translate-y-8">MB</span>
              <span className="absolute translate-y-8 text-[var(--lime)] transition-transform duration-500 group-hover:translate-y-0">↑</span>
            </span>
            <span className="hidden flex-col text-left font-mono text-[10px] uppercase leading-4 tracking-[0.2em] text-white/50 md:flex">
              <span className="text-white/80">{profile.name}</span>
              <span>Rajkot · {time}</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1.5 backdrop-blur-xl lg:flex">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-white"
              >
                {active === l.id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/15" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
                <span className="relative">{l.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 backdrop-blur-xl sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--lime)] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--lime)]" />
              </span>
              Open to work
            </span>
            <a
              href={`mailto:${profile.email}`}
              className="hidden rounded-full bg-white px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-black transition-colors hover:bg-[var(--lime)] sm:inline-block"
            >
              Hire me
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-px w-5 bg-white transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-px w-5 bg-white transition-all duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-[#04050a]/95 px-6 pb-10 pt-24 backdrop-blur-2xl lg:hidden"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="space-y-2">
              {navLinks.map((l, i) => (
                <motion.li key={l.id} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.06 }}>
                  <button onClick={() => go(l.id)} className="flex w-full items-baseline gap-4 border-b border-white/10 py-3 text-left">
                    <span className="font-mono text-xs text-[var(--lime)]">0{i + 1}</span>
                    <span className="font-display text-5xl font-bold tracking-tight">{l.label}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 flex justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span>{time}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
