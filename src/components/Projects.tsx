import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filters = ['All', 'Infrastructure', 'CI/CD', 'Monitoring', 'Migration'];

  const projects = [
    {
      id: 1,
      title: 'Government Data Center Migration',
      description: 'High-availability Kubernetes cluster migration for government client with zero-downtime deployment',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
      category: 'Migration',
      tech: ['Kubernetes', 'AWS EKS', 'Terraform', 'Helm'],
      featured: true,
    },
    {
      id: 2,
      title: 'Multi-Cloud CI/CD Pipeline',
      description: 'Enterprise-grade deployment automation across AWS and GCP for fintech applications',
      image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=400&fit=crop',
      category: 'CI/CD',
      tech: ['Jenkins', 'GitHub Actions', 'Docker', 'ArgoCD'],
      featured: true,
    },
    {
      id: 3,
      title: 'Infrastructure Monitoring Stack',
      description: 'End-to-end observability platform with custom dashboards and intelligent alerting',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      category: 'Monitoring',
      tech: ['Prometheus', 'Grafana', 'Alertmanager', 'ELK Stack'],
      featured: false,
    },
    {
      id: 4,
      title: 'Healthcare Cloud Infrastructure',
      description: 'HIPAA-compliant cloud architecture with automated compliance monitoring',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
      category: 'Infrastructure',
      tech: ['AWS', 'Terraform', 'CloudFormation', 'Security Groups'],
      featured: false,
    },
    {
      id: 5,
      title: 'Containerized Microservices Platform',
      description: 'Docker-based microservices deployment with service mesh and load balancing',
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop',
      category: 'Infrastructure',
      tech: ['Docker', 'Kubernetes', 'Istio', 'NGINX'],
      featured: false,
    },
    {
      id: 6,
      title: 'Automated Testing Pipeline',
      description: 'Comprehensive testing automation with security scanning and quality gates',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=400&fit=crop',
      category: 'CI/CD',
      tech: ['GitLab CI', 'SonarQube', 'OWASP ZAP', 'Selenium'],
      featured: false,
    },
  ];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-10 sm:mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            <span className="text-gradient">INFRASTRUCTURE PROJECTS</span>
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8">
            Enterprise-scale DevOps implementations that deliver reliability and performance
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 font-jetbrains ${
                  activeFilter === filter
                    ? 'bg-gradient-cyber neon-glow'
                    : 'border-gradient glass-effect hover:bg-white/10'
                } transition-all duration-300`}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.15}
              tiltMaxAngleX={12}
              tiltMaxAngleY={12}
              scale={1.04}
              transitionSpeed={1200}
              className="w-full h-full"
              key={project.id}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.6, type: 'spring' }}
              className={`group relative bg-tech-gray rounded-2xl overflow-hidden border-gradient hover:scale-105 transition-all duration-500 ${
                  isVisible ? '' : 'opacity-0'
              } ${project.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tech-gray via-transparent to-transparent opacity-60" />
                
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-cyber rounded-full text-xs font-jetbrains neon-glow">
                    ENTERPRISE
                  </div>
                )}

                {/* Status Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-black/50 rounded text-xs font-jetbrains">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400">LIVE</span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gradient font-jetbrains">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-muted rounded text-xs font-jetbrains text-neon-blue"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Project Links */}
                <div className="flex gap-3 pt-2">
                  <Button
                    size="sm"
                    className="bg-gradient-cyber hover:scale-105 transition-all duration-300 text-xs px-4"
                  >
                    View Architecture
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gradient glass-effect hover:bg-white/10 transition-all duration-300 text-xs px-4"
                  >
                    Case Study
                  </Button>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-cyber opacity-5 rounded-2xl" />
              </div>
              </motion.div>
            </Tilt>
          ))}
        </div>

        {/* Infrastructure Stats */}
        <div className={`mt-16 glass-effect p-8 rounded-2xl border-gradient ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          <h3 className="text-2xl font-bold text-gradient mb-6 font-jetbrains text-center">
            DEPLOYMENT METRICS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Total Deployments', value: '150+', icon: '🚀' },
              { label: 'Average Uptime', value: '99.95%', icon: '⚡' },
              { label: 'Response Time', value: '<200ms', icon: '⚡' },
              { label: 'Cost Optimization', value: '35%', icon: '💰' },
            ].map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="text-2xl">{metric.icon}</div>
                <div className="text-2xl font-bold text-gradient font-jetbrains">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Topology Background */}
      <div className="absolute top-20 left-1/4 w-2 h-2 bg-neon-blue rounded-full animate-pulse-neon opacity-40" />
      <div className="absolute bottom-32 right-1/3 w-3 h-3 bg-neon-purple rounded-full animate-pulse-neon opacity-30" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-10 w-16 h-px bg-gradient-to-r from-neon-blue to-transparent opacity-40" />
    </section>
  );
};

export default Projects;
