"use client";

import { locations } from "@/lib/data";
import { cityPoints, graticule, linkPath, MAP_HEIGHT, MAP_WIDTH, mapDots, outlinePath } from "@/lib/geo";
import { anchorRef } from "@/lib/scene-state";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

function Pin({ x, y, tone, primary }: { x: number; y: number; tone: string; primary?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} style={{ color: tone }}>
      <circle r={primary ? 30 : 22} fill="currentColor" fillOpacity="0.07" />
      <circle
        r={primary ? 14 : 11}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.7"
        className="origin-center animate-ping-soft [transform-box:fill-box]"
      />
      <circle r={primary ? 7 : 5.5} fill="#050505" stroke="currentColor" strokeWidth="1.5" />
      <circle r={primary ? 3 : 2.4} fill="currentColor" />
    </g>
  );
}

/**
 * Dot-matrix map of Gujarat with the two operational bases. The 3D thread
 * finishes its journey docked above the Rajkot pin (see the contact anchor).
 */
export function OpsMap({ className }: { className?: string }) {
  const reduce = usePrefersReducedMotion();
  const rj = cityPoints.rajkot;
  const am = cityPoints.ahmedabad;

  return (
    <div className={cn("relative w-full", className)} style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}>
      <div
        aria-hidden
        className="absolute inset-[-10%] bg-[radial-gradient(closest-side,rgb(34_211_238/0.10),transparent)]"
        style={{ backgroundPosition: `${pct(rj.x, MAP_WIDTH)} ${pct(rj.y, MAP_HEIGHT)}` }}
      />
      <svg
        role="img"
        aria-label="Map of Gujarat highlighting Rajkot (base of operations) and Ahmedabad"
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="absolute inset-0 size-full overflow-visible"
      >
        <defs>
          <linearGradient id="ops-link" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#39ff88" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>

        <g stroke="rgb(255 255 255 / 0.05)" strokeDasharray="2 6">
          {graticule.lats.map((g) => (
            <line key={g.lat} x1="0" x2={MAP_WIDTH} y1={g.y} y2={g.y} />
          ))}
          {graticule.lons.map((g) => (
            <line key={g.lon} x1={g.x} x2={g.x} y1="0" y2={MAP_HEIGHT} />
          ))}
        </g>

        <path d={outlinePath} fill="rgb(34 211 238 / 0.025)" stroke="rgb(124 140 255 / 0.28)" strokeWidth="1" strokeLinejoin="round" />

        <g>
          {mapDots.map((d) => (
            <circle
              key={`${d.x}-${d.y}`}
              cx={d.x}
              cy={d.y}
              r={1.5 + d.heat * 1.1}
              fill={d.heat > 0.35 ? "#7ee8fa" : "#7c8cff"}
              fillOpacity={0.16 + d.heat * 0.6}
            />
          ))}
        </g>

        <path d={linkPath} fill="none" stroke="url(#ops-link)" strokeOpacity="0.25" strokeWidth="6" />
        <path d={linkPath} fill="none" stroke="url(#ops-link)" strokeWidth="1.5" strokeDasharray="4 8" className="animate-flow" />
        {!reduce && (
          <circle r="3.5" fill="#fff">
            <animateMotion dur="3.4s" repeatCount="indefinite" path={linkPath} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
          </circle>
        )}

        <Pin x={am.x} y={am.y} tone="#22d3ee" />
        <Pin x={rj.x} y={rj.y} tone="#39ff88" primary />
      </svg>

      {/* where the 3D container docks — hovering just above the Rajkot pin */}
      <div
        ref={anchorRef("contact")}
        aria-hidden
        className="pointer-events-none absolute size-14 -translate-x-1/2 -translate-y-[150%]"
        style={{ left: pct(rj.x, MAP_WIDTH), top: pct(rj.y, MAP_HEIGHT) }}
      />

      <div
        className="pointer-events-none absolute -translate-x-1/2 translate-y-6 rounded-md bg-void/85 px-2 py-1 text-center"
        style={{ left: pct(rj.x, MAP_WIDTH), top: pct(rj.y, MAP_HEIGHT) }}
      >
        <p className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-neon-green">
          {locations.rajkot.code} · {locations.rajkot.name}
        </p>
        <p className="mt-0.5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
          {locations.rajkot.role}
        </p>
      </div>
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+18px)] rounded-md bg-void/85 px-2 py-1 text-center"
        style={{ left: pct(am.x, MAP_WIDTH), top: pct(am.y, MAP_HEIGHT) }}
      >
        <p className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-neon-blue">
          {locations.ahmedabad.code} · {locations.ahmedabad.name}
        </p>
        <p className="mt-0.5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
          {locations.ahmedabad.role}
        </p>
      </div>
    </div>
  );
}
