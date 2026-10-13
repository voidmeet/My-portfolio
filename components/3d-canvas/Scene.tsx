"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor, Preload } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { DataField } from "./DataField";
import { DataThread } from "./DataThread";
import { Director } from "./Director";
import type { Quality } from "./frame-state";
import { ParticleGlobe } from "./ParticleGlobe";

interface SceneProps {
  quality: Quality;
  reducedMotion: boolean;
  onReady: () => void;
}

/**
 * The single, page-wide WebGL canvas. It never scrolls — everything inside is
 * positioned from DOM anchors, so the 3D layer follows the layout responsively.
 */
export default function Scene({ quality, reducedMotion, onReady }: SceneProps) {
  const maxDpr = quality === "low" ? 1.5 : 2;
  const [dpr, setDpr] = useState(quality === "low" ? 1.25 : 1.5);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 10], fov: 40, near: 0.1, far: 120 }}
      gl={{ antialias: quality === "high", alpha: false, stencil: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#050505", 1);
        onReady();
      }}
    >
      <PerformanceMonitor
        flipflops={3}
        onIncline={() => setDpr((d) => Math.min(maxDpr, d + 0.25))}
        onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
        onFallback={() => setDpr(1)}
      />
      <CameraRig />
      <Director />
      <DataField quality={quality} reducedMotion={reducedMotion} />
      <ParticleGlobe quality={quality} reducedMotion={reducedMotion} />
      <DataThread reducedMotion={reducedMotion} />
      <Preload all />
    </Canvas>
  );
}
