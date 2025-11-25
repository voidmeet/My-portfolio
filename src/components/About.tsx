import { useState, useEffect, useRef } from 'react';
import { calculateExperienceYears } from '@/lib/utils';
import Tilt from 'react-parallax-tilt';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  // Add this for tab state
  const [activeTab, setActiveTab] = useState<'education' | 'experience'>('experience');

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

  const stats = [
    { number: `${calculateExperienceYears(2024, 3, 1).toFixed(1)}+`, label: 'Years Experience' },
    { number: '10+', label: 'Projects Deployed' },
    { number: '7', label: 'Cloud Platforms' },
    { number: '90.0%', label: 'Uptime Achieved' },
  ];

  return (
    <>
      <section id="about-section" ref={sectionRef} className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-dark relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left: Avatar/DevOps Dashboard */}
            <div className={`relative ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 mx-auto">
                <div className="absolute inset-0 bg-gradient-cyber rounded-2xl blur-xl opacity-30 animate-pulse-neon" />
                <div className="relative w-full h-full rounded-2xl border-gradient overflow-hidden" style={{ backgroundColor: '#ACAA9D' }}>
                  <img
                    src="/meet-bundela.jpg"
                    alt="Meet Bundela"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tech-gray/90 via-transparent to-transparent" />
                  {/* DevOps Status Indicators */}
                  <div className="absolute top-4 left-4 space-y-2">
                    <div className="flex items-center gap-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-jetbrains border border-white/10">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 font-bold">SYSTEMS ONLINE</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-jetbrains border border-white/10">
                      <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse-neon" />
                      <span className="text-neon-blue font-bold">CI/CD ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Content */}
            <div className={`space-y-6 sm:space-y-8 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                  <span className="text-gradient">ABOUT ME</span>
                </h2>
                <div className="space-y-3 sm:space-y-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  <p>
                    A focused <span className="text-neon-blue font-medium">Cloud/DevOps Engineer</span> having {calculateExperienceYears(2024, 3, 1).toFixed(1)} years of hands-on experience
                    in companies tying up with government and enterprise clients. I design and maintain resilient, high availability infrastructures across AWS, Azure, GCP, Hetzner, DigitalOcean, Contabo and IONOS.
                    I excel at rapidly resolving <span className="text-neon-purple font-medium">production issues</span>,
                    while upholding robust security practices and comprehensive configuration management.
                  </p>
                  <p>
                    Specializing in <span className="text-neon-purple font-medium">Kubernetes orchestration, CI/CD automation and multi-cloud deployments</span>, I've architected critical pipelines from government websites to fintech platforms that deliver seamless, scalable solutions. I streamline deployments, Monitor them to optimize performance and empower teams to scale confidently with evolving business needs.
                  </p>
                </div>
              </div>
              {/* DevOps Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`glass-effect p-6 rounded-xl border-gradient text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'
                      }`}
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-gradient font-jetbrains">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              {/* Key Specializations */}
              <div className={`glass-effect p-6 rounded-xl border-gradient ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                <h3 className="text-xl font-bold text-gradient mb-4 font-jetbrains">
                  CORE EXPERTISE
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {['Kubernetes & Docker', 'AWS & GCP', 'Jenkins & GitHub Actions', 'Prometheus & Grafana', 'Terraform & IaC', 'Linux Administration'].map((skill) => (
                    <div key={skill} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-neon-blue rounded-full" />
                      <span className="text-muted-foreground">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-20 right-20 w-px h-20 bg-gradient-to-b from-neon-blue to-transparent opacity-50" />
        <div className="absolute bottom-20 left-20 w-20 h-px bg-gradient-to-r from-neon-purple to-transparent opacity-50" />
        <div className="absolute top-1/2 right-10 w-3 h-3 border border-neon-blue rounded-full opacity-40 animate-pulse-neon" />
      </section>
      <section id="exp-edu-section" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="flex justify-center gap-4 mb-12">
          <button
            className={`px-8 py-3 rounded-full font-extrabold text-2xl md:text-3xl border-2 border-gradient glass-effect transition-all duration-300 tracking-wide shadow-md uppercase focus:outline-none focus:ring-4 focus:ring-neon-blue/30 backdrop-blur-md
              ${activeTab === 'education' ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white neon-glow scale-105 shadow-lg ring-2 ring-neon-blue/40' : 'bg-white/10 text-neon-blue hover:bg-gradient-to-r hover:from-neon-blue/20 hover:to-neon-purple/20 opacity-80'}`}
            onClick={() => setActiveTab('education')}
            style={{ minWidth: '180px', letterSpacing: '0.05em' }}
          >
            Education
          </button>
          <button
            className={`px-8 py-3 rounded-full font-extrabold text-2xl md:text-3xl border-2 border-gradient glass-effect transition-all duration-300 tracking-wide shadow-md uppercase focus:outline-none focus:ring-4 focus:ring-neon-blue/30 backdrop-blur-md
              ${activeTab === 'experience' ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white neon-glow scale-105 shadow-lg ring-2 ring-neon-blue/40' : 'bg-white/10 text-neon-blue hover:bg-gradient-to-r hover:from-neon-blue/20 hover:to-neon-purple/20 opacity-80'}`}
            onClick={() => setActiveTab('experience')}
            style={{ minWidth: '180px', letterSpacing: '0.05em' }}
          >
            Experience
          </button>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex-1">
            {activeTab === 'education' && (
              <div className="animate-fade-in">
                <ol className="relative border-l-4 border-gradient-cyber ml-4">
                  <li className="mb-10 ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-neon-blue rounded-full -left-4 ring-4 ring-white dark:ring-gray-900">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V6h2v4z" /></svg>
                    </span>
                    <h4 className="font-bold text-lg text-neon-blue">Masters of Computer Applications</h4>
                    <p className="text-muted-foreground text-sm">The Oxford College of Engineering, Bangalore</p>
                    <p className="text-neon-yellow text-xs">2023</p>
                  </li>
                  <li className="mb-10 ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-neon-blue rounded-full -left-4 ring-4 ring-white dark:ring-gray-900">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V6h2v4z" /></svg>
                    </span>
                    <h4 className="font-bold text-lg text-neon-blue">Bachelor of Computer Applications</h4>
                    <p className="text-muted-foreground text-sm">Atmiya Institute of Technology & Science, Rajkot</p>
                    <p className="text-neon-yellow text-xs">2019</p>
                  </li>
                  <li className="mb-10 ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-neon-blue rounded-full -left-4 ring-4 ring-white dark:ring-gray-900">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V6h2v4z" /></svg>
                    </span>
                    <h4 className="font-bold text-lg text-neon-blue">12th</h4>
                    <p className="text-muted-foreground text-sm">Shree P.V. Modi High School, Rajkot</p>
                    <p className="text-neon-yellow text-xs">2016</p>
                  </li>
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-neon-blue rounded-full -left-4 ring-4 ring-white dark:ring-gray-900">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V6h2v4z" /></svg>
                    </span>
                    <h4 className="font-bold text-lg text-neon-blue">10th</h4>
                    <p className="text-muted-foreground text-sm">Shree P.V. Modi High School, Rajkot</p>
                    <p className="text-neon-yellow text-xs">2014</p>
                  </li>
                </ol>
              </div>
            )}
            {activeTab === 'experience' && (
              <div className="animate-fade-in">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Project: RRB Ahmedabad */}
                  <Tilt glareEnable={true} glareMaxOpacity={0.15} tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.04} transitionSpeed={1200} className="w-full h-full">
                    <div className="group relative bg-tech-gray rounded-2xl overflow-hidden border-gradient hover:scale-105 transition-all duration-500">
                      {/* Project Image */}
                      <div className="relative overflow-hidden h-48">
                        <img
                          src="/thumbnails/rrb-train.jpg"
                          alt="RRB Ahmedabad train"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-tech-gray via-transparent to-transparent opacity-60" />
                        {/* Status Indicator */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-black/50 rounded text-xs font-jetbrains">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-green-400">LIVE</span>
                        </div>
                      </div>
                      {/* Project Info */}
                      <div className="p-6 flex flex-col flex-1">
                        <h4 className="text-xl font-bold text-gradient mb-2 font-jetbrains">RRB Ahmedabad</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-2">Govt. website - Code pipeline for frequent automatic deployments in govt servers.</p>
                        <p className="text-xs text-neon-green mb-4">Set up and managed CI/CD pipelines for secure, automated deployments to government infrastructure.</p>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="mt-auto">
                          <button className="btn-neon-gradient px-4 py-2 rounded font-bold">More Details</button>
                        </a>
                      </div>
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-cyber opacity-5 rounded-2xl" />
                      </div>
                    </div>
                  </Tilt>
                  {/* Project: Brooon */}
                  <Tilt glareEnable={true} glareMaxOpacity={0.15} tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.04} transitionSpeed={1200} className="w-full h-full">
                    <div className="group relative bg-tech-gray rounded-2xl overflow-hidden border-gradient hover:scale-105 transition-all duration-500">
                      {/* Project Image */}
                      <div className="relative overflow-hidden h-48">
                        <img
                          src="/thumbnails/brooon-realestate.jpg"
                          alt="Brooon real estate"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-tech-gray via-transparent to-transparent opacity-60" />
                        {/* Status Indicator */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-black/50 rounded text-xs font-jetbrains">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-green-400">LIVE</span>
                        </div>
                      </div>
                      {/* Project Info */}
                      <div className="p-6 flex flex-col flex-1">
                        <h4 className="text-xl font-bold text-gradient mb-2 font-jetbrains">Brooon</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-2">Real Estate site & app - Dockerising, staging and prod server management and monitoring, CI/CD for both, production live issues.</p>
                        <p className="text-xs text-neon-green mb-4">Handled Dockerization, CI/CD, and live issue resolution for both web and app platforms.</p>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="mt-auto">
                          <button className="btn-neon-gradient px-4 py-2 rounded font-bold">More Details</button>
                        </a>
                      </div>
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-cyber opacity-5 rounded-2xl" />
                      </div>
                    </div>
                  </Tilt>
                  {/* Project: cTrunk */}
                  <Tilt glareEnable={true} glareMaxOpacity={0.15} tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.04} transitionSpeed={1200} className="w-full h-full">
                    <div className="group relative bg-tech-gray rounded-2xl overflow-hidden border-gradient hover:scale-105 transition-all duration-500">
                      {/* Project Image */}
                      <div className="relative overflow-hidden h-48">
                        <img
                          src="/thumbnails/ctrunk-courier.jpg"
                          alt="cTrunk courier box"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-tech-gray via-transparent to-transparent opacity-60" />
                        {/* Status Indicator */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-black/50 rounded text-xs font-jetbrains">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-green-400">LIVE</span>
                        </div>
                      </div>
                      {/* Project Info */}
                      <div className="p-6 flex flex-col flex-1">
                        <h4 className="text-xl font-bold text-gradient mb-2 font-jetbrains">cTrunk</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-2">Courier Management Software - Custom mail server with AWS SES, staging deployment.</p>
                        <p className="text-xs text-neon-green mb-4">Integrated AWS SES for transactional emails and managed staging deployments.</p>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="mt-auto">
                          <button className="btn-neon-gradient px-4 py-2 rounded font-bold">More Details</button>
                        </a>
                      </div>
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-cyber opacity-5 rounded-2xl" />
                      </div>
                    </div>
                  </Tilt>
                  {/* Project: Captain Tractors */}
                  <Tilt glareEnable={true} glareMaxOpacity={0.15} tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.04} transitionSpeed={1200} className="w-full h-full">
                    <div className="group relative bg-tech-gray rounded-2xl overflow-hidden border-gradient hover:scale-105 transition-all duration-500">
                      {/* Project Image */}
                      <div className="relative overflow-hidden h-48">
                        <img
                          src="/thumbnails/captain-tractor.jpg"
                          alt="Captain Tractors"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-tech-gray via-transparent to-transparent opacity-60" />
                        {/* Status Indicator */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-black/50 rounded text-xs font-jetbrains">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-green-400">LIVE</span>
                        </div>
                      </div>
                      {/* Project Info */}
                      <div className="p-6 flex flex-col flex-1">
                        <h4 className="text-xl font-bold text-gradient mb-2 font-jetbrains">Captain Tractors</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-2">Manufacturers & Exporters of Compact Tractors - Staging and prod deployments with CI/CD pipelines.</p>
                        <p className="text-xs text-neon-green mb-4">Built and maintained CI/CD for staging and production environments.</p>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="mt-auto">
                          <button className="btn-neon-gradient px-4 py-2 rounded font-bold">More Details</button>
                        </a>
                      </div>
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-cyber opacity-5 rounded-2xl" />
                      </div>
                    </div>
                  </Tilt>
                  {/* Project: Alpha Rep Services */}
                  <Tilt glareEnable={true} glareMaxOpacity={0.15} tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.04} transitionSpeed={1200} className="w-full h-full">
                    <div className="group relative bg-tech-gray rounded-2xl overflow-hidden border-gradient hover:scale-105 transition-all duration-500">
                      {/* Project Image */}
                      <div className="relative overflow-hidden h-48">
                        <img
                          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop"
                          alt="Alpha Rep Services"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-tech-gray via-transparent to-transparent opacity-60" />
                        {/* Status Indicator */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-black/50 rounded text-xs font-jetbrains">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-green-400">LIVE</span>
                        </div>
                      </div>
                      {/* Project Info */}
                      <div className="p-6 flex flex-col flex-1">
                        <h4 className="text-xl font-bold text-gradient mb-2 font-jetbrains">Alpha Rep Services</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-2">Field Activity Management - CI/CD Pipelines.</p>
                        <p className="text-xs text-neon-green mb-4">Implemented and managed CI/CD for field activity management platform.</p>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="mt-auto">
                          <button className="btn-neon-gradient px-4 py-2 rounded font-bold">More Details</button>
                        </a>
                      </div>
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-cyber opacity-5 rounded-2xl" />
                      </div>
                    </div>
                  </Tilt>
                  {/* Project: Airbrush Events */}
                  <Tilt glareEnable={true} glareMaxOpacity={0.15} tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.04} transitionSpeed={1200} className="w-full h-full">
                    <div className="group relative bg-tech-gray rounded-2xl overflow-hidden border-gradient hover:scale-105 transition-all duration-500">
                      {/* Project Image */}
                      <div className="relative overflow-hidden h-48">
                        <img
                          src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop"
                          alt="Airbrush Events"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-tech-gray via-transparent to-transparent opacity-60" />
                        {/* Status Indicator */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-black/50 rounded text-xs font-jetbrains">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-green-400">LIVE</span>
                        </div>
                      </div>
                      {/* Project Info */}
                      <div className="p-6 flex flex-col flex-1">
                        <h4 className="text-xl font-bold text-gradient mb-2 font-jetbrains">Airbrush Events</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-2">Event management for artists - Prod deployment.</p>
                        <p className="text-xs text-neon-green mb-4">Managed production deployment for event management platform.</p>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="mt-auto">
                          <button className="btn-neon-gradient px-4 py-2 rounded font-bold">More Details</button>
                        </a>
                      </div>
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-cyber opacity-5 rounded-2xl" />
                      </div>
                    </div>
                  </Tilt>
                </div>
                {/* Evolution Infosystem */}
                <div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-neon-cyan">Evolution Infosystem</h3>
                      <div className="text-muted-foreground text-lg font-jetbrains">Cloud DevOps Engineer</div>
                      <div className="text-neon-yellow font-medium">April 2025 - Current</div>
                      <div className="text-sm text-muted-foreground">Rajkot, Gujarat</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Project: theemiclub */}
                    <Tilt glareEnable={true} glareMaxOpacity={0.15} tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.04} transitionSpeed={1200} className="w-full h-full">
                      <div className="group relative bg-tech-gray rounded-2xl overflow-hidden border-gradient hover:scale-105 transition-all duration-500">
                        {/* Project Image */}
                        <div className="relative overflow-hidden h-48">
                          <img
                            src="/thumbnails/theemiclub-money.jpg"
                            alt="theemiclub money"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-tech-gray via-transparent to-transparent opacity-60" />
                          {/* Status Indicator */}
                          <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 bg-black/50 rounded text-xs font-jetbrains">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-green-400">LIVE</span>
                          </div>
                        </div>
                        {/* Project Info */}
                        <div className="p-6 flex flex-col flex-1">
                          <h4 className="text-xl font-bold text-gradient mb-2 font-jetbrains">theemiclub</h4>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-2">Financial app - Staging setup and prod migration from server to Kubernetes.</p>
                          <p className="text-xs text-neon-green mb-4">Led migration to Kubernetes for improved scalability and reliability.</p>
                          <a href="#" target="_blank" rel="noopener noreferrer" className="mt-auto">
                            <button className="btn-neon-gradient px-4 py-2 rounded font-bold">More Details</button>
                          </a>
                        </div>
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-cyber opacity-5 rounded-2xl" />
                        </div>
                      </div>
                    </Tilt>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
