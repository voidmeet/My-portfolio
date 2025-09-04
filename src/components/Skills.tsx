import { useState, useEffect, useRef } from 'react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const skillCategories = [
    {
      title: 'Cloud & Infrastructure',
      skills: [
        { name: 'AWS (EC2, EKS, S3)', level: 85 },
        { name: 'Google Cloud (GKE)', level: 80 },
        { name: 'Terraform & IaC', level: 88 },
        { name: 'VPC & Networking', level: 82 },
      ],
    },
    {
      title: 'Containers & Orchestration',
      skills: [
        { name: 'Docker & Compose', level: 92 },
        { name: 'Kubernetes', level: 85 },
        { name: 'Helm Charts', level: 78 },
        { name: 'Container Security', level: 80 },
      ],
    },
    {
      title: 'CI/CD & Monitoring',
      skills: [
        { name: 'Jenkins Pipelines', level: 88 },
        { name: 'GitHub Actions', level: 90 },
        { name: 'Prometheus & Grafana', level: 85 },
        { name: 'Git & GitOps', level: 95 },
      ],
    },
  ];

  return (
    <section id="arsenal-section" ref={sectionRef} className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-10 sm:mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            <span className="text-gradient">DEVOPS ARSENAL</span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Technologies and platforms I use to build scalable, resilient infrastructure
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {skillCategories.map((category, categoryIndex) => (
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.18}
              tiltMaxAngleX={12}
              tiltMaxAngleY={12}
              scale={1.06}
              transitionSpeed={1200}
              className="w-full h-full"
              key={category.title}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 30 }}
                animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + categoryIndex * 0.12, duration: 0.6, type: 'spring' }}
                className={`glass-effect p-8 rounded-2xl border-gradient bg-gradient-to-br from-tech-gray/80 via-neon-blue/10 to-tech-gray/60 shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-neon-blue hover:border-neon-blue hover:bg-gradient-to-br hover:from-neon-blue/30 hover:to-tech-gray/80 hover:ring-2 hover:ring-neon-blue/40 relative overflow-hidden`}
                style={{ animationDelay: `${categoryIndex * 0.2}s` }}
              >
                {/* Animated Glow Border - removed harsh hover shadow */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300" />
                <h3
                  className="text-2xl font-extrabold text-animated-gradient-strong mb-6 font-jetbrains flex items-center gap-2 transition-all duration-300"
                  style={{ textShadow: '0 0 2px #00fff7, 0 0 4px #6f7cff' }}
                >
                  <span className="inline-block transition-transform duration-300">{category.title}</span>
                  <span className="w-3 h-3 bg-neon-blue rounded-full group-hover:animate-pulse-neon" />
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground font-medium group-hover:text-neon-blue transition-colors duration-300">{skill.name}</span>
                        <span className="text-sm text-neon-blue font-jetbrains">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 relative overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-cyber rounded-full transition-all duration-1000 ease-out group-hover:shadow-[0_0_12px_2px_rgba(0,255,255,0.25)]"
                          style={{
                            width: isVisible ? `${skill.level}%` : '0%',
                            transitionDelay: `${(categoryIndex * 0.2) + (skillIndex * 0.1)}s`,
                          }}
                          animate={isVisible ? { width: `${skill.level}%` } : { width: '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>

        {/* DevOps Tech Stack Icons */}
        <div className={`mt-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          <div className="flex flex-wrap justify-center gap-6">
            {['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform', 'Prometheus', 'Linux', 'Nginx'].map((tech, index) => (
              <div 
                key={tech}
                className="px-4 py-2 bg-tech-gray rounded-full border border-muted hover:border-neon-blue transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
              >
                <span className="text-sm font-jetbrains text-muted-foreground hover:text-neon-blue transition-colors">
                  {tech}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure Status Panel */}
        <div className={`mt-12 glass-effect p-6 rounded-2xl border-gradient max-w-2xl mx-auto ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
          <h3 className="text-xl font-bold text-gradient mb-4 font-jetbrains text-center">
            CURRENT INFRASTRUCTURE STATUS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Clusters', value: '12', color: 'text-green-400' },
              { label: 'Deployments', value: '47', color: 'text-neon-blue' },
              { label: 'Uptime', value: '99.9%', color: 'text-neon-purple' },
              { label: 'Pipelines', value: 'Active', color: 'text-green-400' },
            ].map((metric) => (
              <div key={metric.label} className="space-y-1">
                <div className={`text-lg font-bold font-jetbrains ${metric.color}`}>
                  {metric.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Lines Background */}
      <div className="absolute top-1/4 left-10 w-32 h-px bg-gradient-to-r from-neon-blue to-transparent opacity-30" />
      <div className="absolute bottom-1/4 right-10 w-px h-32 bg-gradient-to-b from-neon-purple to-transparent opacity-30" />
    </section>
  );
};

export default Skills;
