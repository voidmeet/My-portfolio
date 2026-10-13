"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  type Group,
  LineBasicMaterial,
  type LineLoop,
  type Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  Vector3,
} from "three";
import { sceneState } from "@/lib/scene-state";
import { range, seededRandom } from "@/lib/utils";
import { frameState, type Quality } from "./frame-state";
import { arcFragment, arcVertex, globeVertex, pointFragment } from "./shaders/globe";

const TAU = Math.PI * 2;

function fibonacciSphere(count: number, seed: number) {
  const rand = seededRandom(seed);
  const positions = new Float32Array(count * 3);
  const randoms = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    // tiny jitter so the lattice never reads as a perfect pattern
    const j = 1 + (rand() - 0.5) * 0.025;
    positions.set([Math.cos(theta) * r * j, y * j, Math.sin(theta) * r * j], i * 3);
    randoms[i] = rand();
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aRandom", new BufferAttribute(randoms, 1));
  return geometry;
}

function randomUnit(rand: () => number, out: Vector3) {
  const u = rand() * 2 - 1;
  const t = rand() * TAU;
  const s = Math.sqrt(1 - u * u);
  return out.set(s * Math.cos(t), u, s * Math.sin(t));
}

/** Data-flow arcs between random cluster nodes, merged into one draw call. */
function arcGeometry(arcs: number, segments: number, seed: number) {
  const rand = seededRandom(seed);
  const positions = new Float32Array(arcs * segments * 2 * 3);
  const ts = new Float32Array(arcs * segments * 2);
  const seeds = new Float32Array(arcs * segments * 2);
  const a = new Vector3();
  const b = new Vector3();
  const p = new Vector3();
  let v = 0;

  for (let k = 0; k < arcs; k++) {
    let omega = 0;
    do {
      randomUnit(rand, a);
      randomUnit(rand, b);
      omega = a.angleTo(b);
    } while (omega < 0.7 || omega > 2.2);
    const s = rand();
    const sinO = Math.sin(omega);
    const point = (t: number) => {
      p.copy(a).multiplyScalar(Math.sin((1 - t) * omega) / sinO).addScaledVector(b, Math.sin(t * omega) / sinO);
      return p.normalize().multiplyScalar(1 + Math.sin(Math.PI * t) * 0.18 * omega);
    };
    for (let i = 0; i < segments; i++) {
      for (const t of [i / segments, (i + 1) / segments]) {
        point(t).toArray(positions, v * 3);
        ts[v] = t;
        seeds[v] = s;
        v++;
      }
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aT", new BufferAttribute(ts, 1));
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));
  return geometry;
}

function circleGeometry(segments = 128) {
  const positions = new Float32Array(segments * 3);
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * TAU;
    positions.set([Math.cos(a), 0, Math.sin(a)], i * 3);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  return geometry;
}

const ORBITS = [
  { radius: 1.38, tilt: [0.42, 0, 0.28], speed: 0.45, color: "#22d3ee" },
  { radius: 1.62, tilt: [-0.3, 0, -0.55], speed: -0.3, color: "#a855f7" },
] as const;

/**
 * Hero visual: a particle "cluster" globe with orbiting satellites,
 * flowing data arcs and a latitude scanner. Explodes outward as you scroll.
 */
export function ParticleGlobe({ quality, reducedMotion }: { quality: Quality; reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const scanner = useRef<LineLoop>(null);
  const satellites = useRef<(Mesh | null)[]>([]);

  const points = useMemo(() => fibonacciSphere(quality === "low" ? 2000 : 4200, 11), [quality]);
  const arcs = useMemo(() => arcGeometry(quality === "low" ? 9 : 14, 48, 23), [quality]);
  const circle = useMemo(() => circleGeometry(), []);

  const pointMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: globeVertex,
        fragmentShader: pointFragment,
        uniforms: {
          uTime: { value: 0 },
          uDisperse: { value: 0 },
          uSize: { value: quality === "low" ? 2.6 : 2.4 },
          uPixelRatio: { value: 1 },
          uOpacity: { value: 1 },
        },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [quality],
  );

  const arcMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: arcVertex,
        fragmentShader: arcFragment,
        uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 } },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  );

  const ringMaterials = useMemo(
    () =>
      ORBITS.map(
        (o) =>
          new LineBasicMaterial({
            color: new Color(o.color),
            transparent: true,
            opacity: 0.32,
            depthWrite: false,
            blending: AdditiveBlending,
          }),
      ),
    [],
  );
  const scannerMaterial = useMemo(
    () =>
      new LineBasicMaterial({
        color: new Color("#39ff88"),
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  );
  const satelliteMaterial = useMemo(
    () => new MeshBasicMaterial({ color: new Color("#e0fbff"), transparent: true, depthWrite: false, blending: AdditiveBlending }),
    [],
  );

  useEffect(
    () => () => {
      points.dispose();
      arcs.dispose();
      circle.dispose();
      pointMaterial.dispose();
      arcMaterial.dispose();
      ringMaterials.forEach((m) => m.dispose());
      scannerMaterial.dispose();
      satelliteMaterial.dispose();
    },
    [points, arcs, circle, pointMaterial, arcMaterial, ringMaterials, scannerMaterial, satelliteMaterial],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const f = frameState;
    const disperse = range(f.p1, 0, 0.85);
    g.visible = disperse < 0.999 && f.hero.visible;
    if (!g.visible) return;

    const motion = reducedMotion ? 0.2 : 1;
    const time = state.clock.elapsedTime * motion;
    const radius = f.hero.size * 0.41;
    g.position.copy(f.hero.pos);
    g.scale.setScalar(radius);

    if (spin.current) {
      spin.current.rotation.y += delta * 0.09 * motion + f.scrollVelocity * 0.000004;
      spin.current.rotation.x = 0.32 + sceneState.pointer.y * 0.12;
      spin.current.rotation.z = sceneState.pointer.x * -0.08;
    }

    // dim the cluster on narrow screens where it sits behind the headline
    const dim = state.size.width < 1024 ? 0.6 : 1;
    pointMaterial.uniforms.uTime.value = time;
    pointMaterial.uniforms.uDisperse.value = disperse;
    pointMaterial.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    pointMaterial.uniforms.uOpacity.value = dim;
    arcMaterial.uniforms.uTime.value = time;
    arcMaterial.uniforms.uOpacity.value = (1 - range(disperse, 0, 0.4)) * dim;
    const ringFade = 1 - range(disperse, 0, 0.35);
    ringMaterials.forEach((m) => (m.opacity = 0.32 * ringFade * dim));
    scannerMaterial.opacity = 0.5 * ringFade * dim;
    satelliteMaterial.opacity = ringFade;

    if (scanner.current) {
      const phi = Math.sin(time * 0.55) * 1.25;
      scanner.current.position.y = Math.sin(phi) * 1.01;
      scanner.current.scale.setScalar(Math.cos(phi) * 1.01);
    }

    ORBITS.forEach((o, i) => {
      for (let k = 0; k < 2; k++) {
        const sat = satellites.current[i * 2 + k];
        if (!sat) continue;
        const a = time * o.speed + k * Math.PI;
        sat.position.set(Math.cos(a) * o.radius, 0, Math.sin(a) * o.radius);
      }
    });
  });

  return (
    <group ref={group}>
      <group ref={spin}>
        <points geometry={points} material={pointMaterial} frustumCulled={false} />
        <lineSegments geometry={arcs} material={arcMaterial} frustumCulled={false} />
        <lineLoop ref={scanner} geometry={circle} material={scannerMaterial} />
      </group>
      {ORBITS.map((o, i) => (
        <group key={o.radius} rotation={[o.tilt[0], o.tilt[1], o.tilt[2]]}>
          <lineLoop geometry={circle} material={ringMaterials[i]} scale={o.radius} />
          {[0, 1].map((k) => (
            <mesh
              key={k}
              ref={(el) => {
                satellites.current[i * 2 + k] = el;
              }}
              material={satelliteMaterial}
            >
              <icosahedronGeometry args={[0.028, 1]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
