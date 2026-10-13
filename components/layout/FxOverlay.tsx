/**
 * Static post-processing done in CSS: vignette, colour wash, film grain and
 * faint scanlines. No blend modes — they would force full-screen re-composites.
 */
export function FxOverlay() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1]">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_0%,rgb(168_85_247/0.10),transparent_70%),radial-gradient(50%_45%_at_100%_100%,rgb(34_211_238/0.08),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_40%,rgb(5_5_5/0.72)_100%)]" />
      <div className="noise absolute inset-0 opacity-[0.045]" />
      <div className="scanlines absolute inset-0" />
    </div>
  );
}
