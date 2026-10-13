import { toolchain } from "@/lib/data";
import { cn } from "@/lib/utils";

function Row({ items, reverse }: { items: readonly string[]; reverse?: boolean }) {
  return (
    <div className="mask-fade-x overflow-hidden">
      <ul
        className={cn(
          "flex w-max animate-marquee gap-3 py-1.5 hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ "--marquee-duration": reverse ? "56s" : "46s" } as React.CSSProperties}
      >
        {[...items, ...items].map((item, i) => (
          <li
            key={`${item}-${i}`}
            aria-hidden={i >= items.length}
            className="whitespace-nowrap rounded-full border border-white/[0.08] bg-ink-950/80 px-4 py-2 font-mono text-xs text-white/60 transition-colors hover:border-neon-blue/40 hover:text-white"
          >
            <span className="mr-2 text-neon-green/70">›</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Infinite dual marquee of the wider toolchain from the CV. */
export function ToolchainMarquee({ className }: { className?: string }) {
  const half = Math.ceil(toolchain.length / 2);
  return (
    <div className={cn("relative", className)}>
      <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.3em] text-white/35">
        <span className="text-neon-green/80">{"//"}</span> also in the toolchain
      </p>
      <div className="space-y-2">
        <Row items={toolchain.slice(0, half)} />
        <Row items={toolchain.slice(half)} reverse />
      </div>
    </div>
  );
}
