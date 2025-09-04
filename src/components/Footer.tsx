
const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-cyber-dark border-t border-muted">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          {/* Unique DevOps status and infrastructure indicators */}
          <div className="flex justify-center items-center gap-6 text-xs font-jetbrains">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400">CI/CD: ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse-neon" />
              <span className="text-neon-blue">MONITORING: LIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse-neon" />
              <span className="text-neon-purple">UPTIME: 99.9%</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center items-center gap-2">
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse-neon opacity-60" />
            <span className="text-xs text-muted-foreground">Infrastructure optimized for performance</span>
            <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse-neon opacity-60" />
          </div>

          <p className="mt-6 text-sm text-muted-foreground font-jetbrains">
            © {new Date().getFullYear()} Built with React & TypeScript.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
