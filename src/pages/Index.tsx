
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
// Removed Infrastructure Projects; replaced with Certs & Achievements
import CertsAchievements from '@/components/CertsAchievements';
import Contact from '@/components/Contact';
import ScrollToTop from '@/components/ScrollToTop';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Skills />
      <CertsAchievements />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
