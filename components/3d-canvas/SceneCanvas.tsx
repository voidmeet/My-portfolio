"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { sceneState } from "@/lib/scene-state";
import { cn } from "@/lib/utils";
import type { Quality } from "./frame-state";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function detectQuality(): Quality {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
  return coarse || small || weak ? "low" : "high";
}

/**
 * Client-only host for the fixed WebGL layer: capability checks, quality
 * tier, pointer tracking, and a soft fade-in once the first frame is ready.
 */
export default function SceneCanvas() {
  const [supported] = useState(detectWebGL);
  const [quality] = useState(detectQuality);
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    document.documentElement.dataset.webgl = supported ? "on" : "off";
    if (!supported) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      sceneState.webglReady = false;
    };
  }, [supported]);

  if (!supported) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-0 h-lvh transition-opacity duration-[1600ms] ease-out",
        ready ? "opacity-100" : "opacity-0",
      )}
    >
      <Scene
        quality={quality}
        reducedMotion={reducedMotion}
        onReady={() => {
          sceneState.webglReady = true;
          setReady(true);
        }}
      />
    </div>
  );
}
