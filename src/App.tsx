import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useState, useEffect, useMemo, useRef as useReactRef } from 'react';
import React from 'react';

const queryClient = new QueryClient();

function FloatingModel({ url, position, scale, rotationSpeed, emissiveColor, opacity = 0.7 }) {
  const { scene } = useGLTF(url) as { scene: THREE.Group };
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += rotationSpeed;
      ref.current.position.y += Math.sin(Date.now() * 0.0005 + position[0]) * 0.002;
    }
  });
  return (
    <primitive
      ref={ref}
      object={scene}
      position={position}
      scale={scale}
      dispose={null}
      // Neon effect: override material if possible
      onUpdate={self => {
        self.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const setMaterialProps = (mat: THREE.Material) => {
              if ('transparent' in mat) mat.transparent = true;
              if ('opacity' in mat) mat.opacity = opacity;
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.emissive = new THREE.Color(emissiveColor);
                mat.emissiveIntensity = 0.2;
              }
            };
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(setMaterialProps);
            } else if (mesh.material) {
              setMaterialProps(mesh.material);
            }
          }
        });
      }}
    />
  );
}

function TechyBackground() {
  // Detect if Hero section is in view
  const [heroVisible, setHeroVisible] = useState(true);
  const heroRef = useReactRef();
  useEffect(() => {
    const hero = document.getElementById('hero-section');
    if (!hero) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const model = useMemo(() => ({
    url: '/models/clouds.glb',
    position: [0, 0, 0],
    scale: 28,
    rotationSpeed: 0.004,
    color: '#00b4ff',
    key: 'clouds-bg',
  }), []);

  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 1,
        filter: 'blur(4px)',
      }}
      camera={{ position: [0, 0, 30], fov: 60 }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={0.7} />
      <Suspense fallback={<mesh position={[0,0,0]}><boxGeometry args={[2,2,2]} /><meshStandardMaterial color="hotpink" /></mesh>}>
        <group key={model.key}>
          <FloatingModel
            url={model.url}
            position={model.position}
            scale={model.scale}
            rotationSpeed={model.rotationSpeed}
            emissiveColor={model.color}
            opacity={heroVisible ? 0.32 : 0.7}
          />
        </group>
      </Suspense>
    </Canvas>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TechyBackground />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
