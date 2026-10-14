import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionState, prefersReducedMotion } from './motion';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

/** Smooth scrolling (Lenis) driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function initSmoothScroll() {
  if (prefersReducedMotion()) {
    const onScroll = () => {
      motionState.scroll = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }

  lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 1.4 });
  lenis.on('scroll', (l: Lenis) => {
    motionState.scroll = l.scroll;
    ScrollTrigger.update();
  });
  const raf = (time: number) => {
    if (!lenis) return;
    lenis.raf(time * 1000);
    motionState.velocity = lenis.isScrolling ? lenis.velocity : 0;
  };
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToId(id: string) {
  const target = id === 'top' ? 0 : document.getElementById(id);
  if (target === null) return;
  if (lenis) lenis.scrollTo(target as HTMLElement | number, { offset: 0, duration: 1.6 });
  else if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
  else (target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
}

export function setScrollLocked(locked: boolean) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

export { gsap, ScrollTrigger };
