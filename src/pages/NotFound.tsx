import { useLocation } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">Error: route not found</div>
        <h1 className="mt-4 font-display text-[28vw] font-bold leading-none tracking-tighter text-stroke sm:text-[14rem]">404</h1>
        <p className="mt-2 font-mono text-sm text-white/60">
          <span className="text-[var(--cyan)]">❯</span> kubectl get page {location.pathname}
          <br />
          <span className="text-[#ff5c7a]">Error from server (NotFound)</span>
        </p>
        <a href="/" className="btn-primary mt-8">
          Roll back to home ↺
        </a>
      </div>
    </div>
  );
};

export default NotFound;
