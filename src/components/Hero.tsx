import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { calculateExperienceYears } from '@/lib/utils';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden tech-grid px-4 sm:px-6 pb-[env(safe-area-inset-bottom)]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-cyber opacity-20 rounded-full blur-3xl animate-float"
          style={{
            left: `${mousePosition.x * 0.1}%`,
            top: `${mousePosition.y * 0.1}%`,
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-br from-neon-purple to-transparent opacity-30 rounded-full blur-2xl animate-float"
          style={{
            right: `${mousePosition.x * 0.05}%`,
            bottom: `${mousePosition.y * 0.05}%`,
            animationDelay: '2s',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-animated-gradient-strong text-flicker">MEET BUNDELA</span>
          </h1>

          <div className="relative mb-8">
            <p className="text-base sm:text-xl md:text-2xl font-light leading-relaxed">
              <span className="text-neon-cyan font-medium">DevOps Engineer</span> specializing in <span className="text-neon-green font-medium">cloud infrastructure</span> and <span className="text-neon-magenta font-medium">CI/CD automation</span>.
            </p>
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="flex justify-center items-center gap-3 sm:gap-4 text-xs sm:text-sm font-jetbrains">
                <span className="px-3 py-1 badge-glass-neon rounded-full text-neon-yellow">
                  {`${calculateExperienceYears(2024, 4, 1).toFixed(1)}+ Years Experience`}
                </span>
              </div>
              <a
                href="https://aws.amazon.com/verification"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-foreground/80 hover:text-neon-green transition-colors px-3 py-1 rounded-full border-gradient glass-effect"
                aria-label="AWS Certified Cloud Practitioner — verify"
              >
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="font-jetbrains">AWS Certified Cloud Practitioner</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="btn-neon-gradient hover:scale-105 transition-all duration-300 px-8 py-3 text-lg font-medium"
              onClick={() => {
                const arsenal = document.getElementById('arsenal-section');
                if (arsenal) {
                  arsenal.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  console.warn('No element with id="arsenal-section" found.');
                }
              }}
            >
              View My Arsenal
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="btn-filled-magenta glass-effect transition-all duration-300 px-8 py-3 text-lg"
            >
              Download Resume
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-pulse-neon relative flex flex-col items-center">
            <ChevronDown className="w-8 h-8 mx-auto text-neon-cyan animate-bounce" />
            <div className="relative inline-block mt-2">
              <div
                className="pointer-events-none absolute -inset-2 z-0 transition-all duration-200"
                style={{
                  left: `${mousePosition.x * 0.5}%`,
                  top: `${mousePosition.y * 0.1}%`,
                  width: '120%',
                  height: '120%',
                  background: 'radial-gradient(circle, #00fff7cc 0%, transparent 70%)',
                  filter: 'blur(16px)',
                  opacity: 0.5,
                  transform: 'translate(-10%, -30%)',
                }}
              />
              <span
                className="text-lg md:text-2xl text-neon-cyan font-jetbrains relative z-10 font-bold tracking-wider px-2 cursor-pointer hover:underline transition-all duration-200"
                onClick={() => {
                  console.log('Explore More clicked');
                  const about = document.getElementById('about-section');
                  if (about) {
                    about.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    console.warn('No element with id="about-section" found.');
                  }
                }}
              >
                Explore More
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DevOps Floating Elements */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-neon-blue rounded-full animate-pulse-neon opacity-60" />
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-neon-purple rounded-full animate-pulse-neon opacity-40" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-neon-blue rounded-full animate-pulse-neon opacity-80" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-neon-purple rounded-full animate-pulse-neon opacity-50" style={{ animationDelay: '3s' }} />
      
      {/* Server rack indicators */}
      <div className="absolute top-20 right-32 flex flex-col gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-6 h-1 bg-neon-blue opacity-30 animate-pulse-neon" style={{ animationDelay: `${i * 0.5}s` }} />
        ))}
      </div>
    </section>
  );
};

export default Hero;
