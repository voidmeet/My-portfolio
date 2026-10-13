"use client";

import { useId, useImperativeHandle, useRef, type Ref } from "react";

export interface PipelineCableHandle {
  /** Light the cable up to `x` (track coordinates) and arm the nodes it has passed. */
  setLit: (x: number) => void;
}

interface PipelineCableProps {
  ref?: Ref<PipelineCableHandle>;
  width: number;
  nodes: { x: number; accent: string }[];
}

const H = 64;
const MID = H / 2;

/**
 * The network cable running through the pipeline: a dim double-rail sheath,
 * a gradient core that lights up behind the playhead, and packets streaming
 * along the lit part. No SVG filters — the glow is layered strokes, which
 * stays cheap while the track is being scrubbed.
 */
export function PipelineCable({ ref, width, nodes }: PipelineCableProps) {
  const id = useId().replace(/:/g, "");
  const litRect = useRef<SVGRectElement>(null);
  const spark = useRef<SVGGElement>(null);
  const nodeEls = useRef<(SVGGElement | null)[]>([]);
  const lastLit = useRef(-1);

  useImperativeHandle(
    ref,
    () => ({
      setLit(x: number) {
        const lit = Math.max(0, Math.min(width, x));
        if (Math.abs(lit - lastLit.current) < 0.5) return;
        lastLit.current = lit;
        litRect.current?.setAttribute("width", lit.toFixed(1));
        spark.current?.setAttribute("transform", `translate(${lit.toFixed(1)} ${MID})`);
        nodes.forEach((node, i) => {
          const el = nodeEls.current[i];
          const active = String(node.x <= lit);
          if (el && el.dataset.active !== active) el.dataset.active = active;
        });
      },
    }),
    [width, nodes],
  );

  if (!width) return null;

  return (
    <svg
      aria-hidden
      width={width}
      height={H}
      viewBox={`0 0 ${width} ${H}`}
      className="pointer-events-none absolute left-0 overflow-visible short:hidden"
      style={{ top: -MID }}
    >
      <defs>
        <linearGradient id={`${id}-grad`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={width} y2="0">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.45" stopColor="#a855f7" />
          <stop offset="0.75" stopColor="#7c8cff" />
          <stop offset="1" stopColor="#39ff88" />
        </linearGradient>
        <clipPath id={`${id}-lit`}>
          <rect ref={litRect} x="0" y="0" width="0" height={H} />
        </clipPath>
      </defs>

      {/* sheath */}
      <line x1="0" x2={width} y1={MID - 7} y2={MID - 7} stroke="rgb(255 255 255 / 0.05)" />
      <line x1="0" x2={width} y1={MID + 7} y2={MID + 7} stroke="rgb(255 255 255 / 0.05)" />
      <line x1="0" x2={width} y1={MID} y2={MID} stroke="rgb(255 255 255 / 0.1)" strokeWidth="2" />
      <line
        x1="0"
        x2={width}
        y1={MID}
        y2={MID}
        stroke="rgb(255 255 255 / 0.14)"
        strokeWidth="2"
        strokeDasharray="1 23"
      />

      {/* energised core */}
      <g clipPath={`url(#${id}-lit)`}>
        <line x1="0" x2={width} y1={MID} y2={MID} stroke={`url(#${id}-grad)`} strokeWidth="14" strokeOpacity="0.08" />
        <line x1="0" x2={width} y1={MID} y2={MID} stroke={`url(#${id}-grad)`} strokeWidth="6" strokeOpacity="0.25" />
        <line x1="0" x2={width} y1={MID} y2={MID} stroke={`url(#${id}-grad)`} strokeWidth="2" />
        <line
          x1="0"
          x2={width}
          y1={MID}
          y2={MID}
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="3 47"
          className="animate-flow"
        />
      </g>

      {nodes.map((node, i) => (
        <g
          key={node.x}
          ref={(el) => {
            nodeEls.current[i] = el;
          }}
          data-active="false"
          transform={`translate(${node.x} ${MID})`}
          className="group/node"
          style={{ color: node.accent }}
        >
          <circle
            r="20"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.5"
            className="origin-center opacity-0 [transform-box:fill-box] group-data-[active=true]/node:animate-ping-soft"
          />
          <circle r="12" fill="#06070a" stroke="rgb(255 255 255 / 0.18)" className="transition-[stroke] duration-500 group-data-[active=true]/node:stroke-current" />
          <circle r="4.5" fill="rgb(255 255 255 / 0.18)" className="transition-[fill] duration-500 group-data-[active=true]/node:fill-current" />
        </g>
      ))}

      {/* leading spark at the playhead */}
      <g ref={spark} transform={`translate(0 ${MID})`}>
        <circle r="10" fill="#fff" fillOpacity="0.08" />
        <circle r="3" fill="#fff" />
      </g>
    </svg>
  );
}
