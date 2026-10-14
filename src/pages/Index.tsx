import { lazy, Suspense, useEffect, useState } from 'react';
import Preloader from '@/components/site/Preloader';
import Cursor from '@/components/site/Cursor';
import Nav from '@/components/site/Nav';
import Hero from '@/components/site/Hero';
import Marquee from '@/components/site/Marquee';
import About from '@/components/site/About';
import Experience from '@/components/site/Experience';
import Projects from '@/components/site/Projects';
import Skills from '@/components/site/Skills';
import Credentials from '@/components/site/Credentials';
import Contact from '@/components/site/Contact';
import Footer from '@/components/site/Footer';
import { initSmoothScroll, ScrollTrigger } from '@/lib/scroll';
import { motionState } from '@/lib/motion';

// three.js is the heaviest chunk; let the page paint first.
const CoreScene = lazy(() => import('@/three/CoreScene'));

const Index = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    return initSmoothScroll();
  }, []);

  const onLoaded = () => {
    motionState.ready = true;
    setReady(true);
    window.setTimeout(() => ScrollTrigger.refresh(), 100);
  };

  return (
    <div className="relative">
      <Preloader onDone={onLoaded} />
      <Cursor />
      <Suspense fallback={null}>
        <CoreScene />
      </Suspense>
      <div className="noise pointer-events-none fixed inset-0 z-[1]" aria-hidden />
      <div className="vignette pointer-events-none fixed inset-0 z-[1]" aria-hidden />
      <Nav ready={ready} />
      <main className="relative">
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
