"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, type Mesh, PlaneGeometry, ShaderMaterial, Vector3 } from "three";
import { lerp, seededRandom } from "@/lib/utils";
import { frameState, type Quality } from "./frame-state";
import { fieldVertex, gridFragment, gridVertex } from "./shaders/field";
import { pointFragment } from "./shaders/globe";

/**
 * Ambient depth: a particle field that streams toward the camera as you
 * scroll, over an infinite perspective grid — the "datacenter floor".
 */
export function DataField({ quality, reducedMotion }: { quality: Quality; reducedMotion: boolean }) {
  const grid = useRef<Mesh>(null);

  const particles = useMemo(() => {
    const count = quality === "low" ? 420 : 950;
    const rand = seededRandom(5);
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions.set([(rand() - 0.5) * 34, (rand() - 0.5) * 22, rand() * 46 - 40], i * 3);
      randoms[i] = rand();
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(positions, 3));
    g.setAttribute("aRandom", new BufferAttribute(randoms, 1));
    return g;
  }, [quality]);

  const particleMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: fieldVertex,
        fragmentShader: pointFragment,
        uniforms: { uTravel: { value: 0 }, uSize: { value: 2.4 }, uPixelRatio: { value: 1 } },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  );

  const gridGeometry = useMemo(() => new PlaneGeometry(120, 80, 1, 1), []);
  const gridMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: gridVertex,
        fragmentShader: gridFragment,
        uniforms: { uTravel: { value: 0 }, uOpacity: { value: 0.5 }, uCamera: { value: new Vector3(0, 0, 10) } },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  );

  useEffect(
    () => () => {
      particles.dispose();
      particleMaterial.dispose();
      gridGeometry.dispose();
      gridMaterial.dispose();
    },
    [particles, particleMaterial, gridGeometry, gridMaterial],
  );

  useFrame((state) => {
    const f = frameState;
    const travel = reducedMotion ? f.travel * 0.2 : f.travel;
    particleMaterial.uniforms.uTravel.value = travel;
    particleMaterial.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    gridMaterial.uniforms.uTravel.value = travel * 1.6;
    (gridMaterial.uniforms.uCamera.value as Vector3).copy(state.camera.position);
    // brightest under the hero, quieter behind dense content, back up for the finale
    gridMaterial.uniforms.uOpacity.value = lerp(0.55, 0.26, Math.min(1, f.stage)) + Math.max(0, f.stage - 2.5) * 0.3;
    if (grid.current) grid.current.position.y = -f.halfHeight * 0.92;
  });

  return (
    <group>
      <points geometry={particles} material={particleMaterial} frustumCulled={false} />
      <mesh ref={grid} geometry={gridGeometry} material={gridMaterial} rotation-x={-Math.PI / 2} position={[0, -3.4, -30]} />
    </group>
  );
}
