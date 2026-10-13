"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BoxGeometry,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  EdgesGeometry,
  Euler,
  IcosahedronGeometry,
  InstancedBufferAttribute,
  type InstancedMesh,
  LineBasicMaterial,
  type LineSegments,
  type Mesh,
  Object3D,
  PlaneGeometry,
  Quaternion,
  ShaderMaterial,
  Vector3,
} from "three";
import { getAnchor, sceneState, type AnchorKey } from "@/lib/scene-state";
import { clamp, damp, easeInOutCubic, lerp, range, seededRandom } from "@/lib/utils";
import { frameState } from "./frame-state";
import { coreFragment, coreVertex, haloFragment, haloVertex, voxelFragment, voxelVertex } from "./shaders/voxel";

const COUNT = 64;
const CARDS = 4;
/** Maximum per-voxel start delay inside a transition (the rest is flight time). */
const SPREAD = 0.38;
const FLIGHT = 1 - SPREAD;
const TAU = Math.PI * 2;
const ACCENTS = ["#22d3ee", "#a855f7", "#39ff88", "#7c8cff"];
const PORTS: AnchorKey[] = ["stack-0", "stack-1", "stack-2", "stack-3"];

interface Voxel {
  grid: Vector3;
  card: number;
  slot: number;
  delay: number;
  lift: number;
  axis: Vector3;
  phase: number;
  seed: number;
}

/**
 * 64 voxels = a 4×4×4 "container". Each vertical slice belongs to one tech
 * card, so when the container shatters every slice powers a different card.
 */
const VOXELS: Voxel[] = (() => {
  const rand = seededRandom(42);
  return Array.from({ length: COUNT }, (_, i) => ({
    grid: new Vector3((i % 4) - 1.5, (Math.floor(i / 4) % 4) - 1.5, Math.floor(i / 16) - 1.5),
    card: i % 4,
    slot: Math.floor(i / 4),
    delay: rand() * SPREAD,
    lift: 0.45 + rand() * 0.9,
    axis: new Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(),
    phase: rand() * TAU,
    seed: rand(),
  }));
})();

/** Transition progress at which every voxel of a card has docked / starts leaving. */
const CARD_ARRIVE = Array.from({ length: CARDS }, (_, c) =>
  Math.max(...VOXELS.filter((v) => v.card === c).map((v) => v.delay)) + FLIGHT,
);
const CARD_LEAVE = Array.from({ length: CARDS }, (_, c) =>
  Math.min(...VOXELS.filter((v) => v.card === c).map((v) => v.delay)),
);

const ENERGY_BASE = [0.12, 0.55, 0.3, 0.08];

// scratch objects — the frame loop never allocates
const dummy = new Object3D();
const posA = new Vector3();
const posB = new Vector3();
const qA = new Quaternion();
const qB = new Quaternion();
const qTumble = new Quaternion();
const local = new Vector3();
const euler = new Euler();
const rotHero = new Quaternion();
const rotContact = new Quaternion();
const rotGyro = new Quaternion();
const ringQ = [new Quaternion().setFromEuler(new Euler(0, 1.15, 0)), new Quaternion().setFromEuler(new Euler(1.2, 0, 0.35))];
const stackMid = new Vector3();
const centerA = new Vector3();
const centerB = new Vector3();
const Z_AXIS = new Vector3(0, 0, 1);
const haloSizes = [0, 0, 0, 0];
const haloOpacity = [0.85, 0, 0.8, 0.5];
const coreSizes = [0, 0, 0, 0];

function centre(idx: number, out: Vector3) {
  const f = frameState;
  return out.copy(idx === 0 ? f.hero.pos : idx === 1 ? stackMid : idx === 2 ? f.experience.pos : f.contact.pos);
}

interface Shared {
  time: number;
  breathe: number;
  heroEdge: number;
  contactEdge: number;
  gyroRadius: number;
}
const shared: Shared = { time: 0, breathe: 1, heroEdge: 1, contactEdge: 1, gyroRadius: 1 };

function cube(v: Voxel, center: Vector3, edge: number, rot: Quaternion, out: Vector3, q: Quaternion) {
  const spacing = edge / 4;
  out.copy(v.grid).multiplyScalar(spacing * shared.breathe).applyQuaternion(rot).add(center);
  q.copy(rot);
  return spacing * 0.66;
}

/** Writes voxel `v`'s pose in formation `k` and returns its scale. */
function formation(k: number, v: Voxel, out: Vector3, q: Quaternion): number {
  const f = frameState;
  const t = shared.time;
  switch (k) {
    case 0:
      return cube(v, f.hero.pos, shared.heroEdge, rotHero, out, q);
    case 1: {
      // two counter-rotating orbits inside each card's power port
      const anchor = f.stack[v.card];
      const port = anchor.size * 0.5;
      const outer = v.slot >= 8;
      const n = v.slot % 8;
      const r = port * (outer ? 0.74 : 0.46);
      const a = (n / 8) * TAU + (outer ? TAU / 16 : 0) + t * (outer ? -0.6 : 0.95) + v.card * 0.8;
      const tilt = outer ? -0.95 : 1.05;
      local
        .set(Math.cos(a) * r, Math.sin(a) * r * Math.cos(tilt), Math.sin(a) * r * Math.sin(tilt))
        .applyAxisAngle(Z_AXIS, v.card * 0.7);
      out.copy(anchor.pos).add(local);
      q.setFromEuler(euler.set(t * 1.3 + v.phase, t * 1.05 + v.phase, 0));
      return port * (outer ? 0.12 : 0.15);
    }
    case 2: {
      // gyroscope "data packet" riding the pipeline
      const ring = v.slot % 2;
      const n = (v.card + Math.floor(v.slot / 2) * 4) / 32;
      const a = n * TAU + t * (ring ? 0.9 : -0.9);
      local.set(Math.cos(a), Math.sin(a), 0).multiplyScalar(shared.gyroRadius);
      local.applyQuaternion(ringQ[ring]).applyQuaternion(rotGyro);
      out.copy(f.experience.pos).add(local);
      q.setFromAxisAngle(Z_AXIS, a).premultiply(ringQ[ring]).premultiply(rotGyro);
      return shared.gyroRadius * 0.085;
    }
    default:
      return cube(v, f.contact.pos, shared.contactEdge, rotContact, out, q);
  }
}

/**
 * The thread that ties the page together: a holographic container that sits
 * in the hero cluster, shatters to power the stack cards, reassembles into a
 * packet riding the pipeline, and finally docks over Rajkot on the ops map.
 */
export function DataThread({ reducedMotion }: { reducedMotion: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  const shell = useRef<LineSegments>(null);
  const halo = useRef<Mesh>(null);
  const core = useRef<Mesh>(null);
  const powered = useRef<boolean[]>([false, false, false, false]);
  const flash = useRef<number[]>([0, 0, 0, 0]);

  const geometry = useMemo(() => {
    const g = new BoxGeometry(1, 1, 1);
    const colors = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    const c = new Color();
    VOXELS.forEach((v, i) => {
      c.set(ACCENTS[v.card]).lerp(new Color("#ffffff"), 0.08 + v.seed * 0.1);
      c.toArray(colors, i * 3);
      seeds[i] = v.seed;
    });
    g.setAttribute("aColor", new InstancedBufferAttribute(colors, 3));
    g.setAttribute("aSeed", new InstancedBufferAttribute(seeds, 1));
    const energy = new InstancedBufferAttribute(new Float32Array(COUNT), 1);
    energy.setUsage(DynamicDrawUsage);
    g.setAttribute("aEnergy", energy);
    return g;
  }, []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: voxelVertex,
        fragmentShader: voxelFragment,
        uniforms: { uTime: { value: 0 }, uIntensity: { value: 1 } },
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        blending: AdditiveBlending,
      }),
    [],
  );

  const shellGeometry = useMemo(() => new EdgesGeometry(new BoxGeometry(1, 1, 1)), []);
  const shellMaterial = useMemo(
    () => new LineBasicMaterial({ color: new Color("#9be7ff"), transparent: true, opacity: 0.6, depthWrite: false, blending: AdditiveBlending }),
    [],
  );
  const haloGeometry = useMemo(() => new PlaneGeometry(1, 1), []);
  const haloMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: haloVertex,
        fragmentShader: haloFragment,
        uniforms: { uColor: { value: new Color("#38bdf8") }, uOpacity: { value: 1 }, uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  );
  const coreGeometry = useMemo(() => new IcosahedronGeometry(1, 2), []);
  const coreMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: coreVertex,
        fragmentShader: coreFragment,
        uniforms: { uColor: { value: new Color("#7dd3fc") }, uOpacity: { value: 1 } },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  );

  useEffect(
    () => () => {
      [geometry, shellGeometry, haloGeometry, coreGeometry].forEach((g) => g.dispose());
      [material, shellMaterial, haloMaterial, coreMaterial].forEach((m) => m.dispose());
    },
    [geometry, shellGeometry, haloGeometry, coreGeometry, material, shellMaterial, haloMaterial, coreMaterial],
  );

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const f = frameState;
    const motion = reducedMotion ? 0.25 : 1;
    const time = state.clock.elapsedTime * motion;
    const { pointer } = sceneState;

    shared.time = time;
    shared.breathe = 1 + Math.sin(time * 1.6) * 0.05;
    shared.heroEdge = f.hero.size * 0.41 * 0.6;
    shared.contactEdge = f.contact.size * 0.95;
    shared.gyroRadius = f.experience.size * 0.5;
    rotHero.setFromEuler(euler.set(time * 0.35 + pointer.y * 0.35, time * 0.5 + pointer.x * 0.45, 0.18));
    rotContact.setFromEuler(euler.set(time * 0.28, time * 0.42, 0.22));
    const spin = clamp(Math.abs(f.scrollVelocity) * 0.0006, 0, 1.2);
    rotGyro.setFromEuler(euler.set(time * 0.45 + spin, time * 0.3, Math.sin(time * 0.4) * 0.2));

    const stage = clamp(f.stage, 0, 3);
    const k = Math.min(2, Math.floor(stage));
    const t = stage - k;
    const liftScale = f.halfHeight * 0.32;

    // card power-state follows the voxels actually docked in each port
    for (let c = 0; c < CARDS; c++) {
      const on = (k === 0 && t >= CARD_ARRIVE[c]) || (k === 1 && t <= CARD_LEAVE[c]);
      if (on !== powered.current[c]) {
        powered.current[c] = on;
        if (on) flash.current[c] = 1;
        const card = getAnchor(PORTS[c])?.closest<HTMLElement>("[data-tech-card]");
        if (card) card.dataset.powered = String(on);
      }
      flash.current[c] = damp(flash.current[c], 0, 3.5, delta);
    }

    const energy = geometry.getAttribute("aEnergy") as InstancedBufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      const v = VOXELS[i];
      const sA = formation(k, v, posA, qA);
      const local01 = t <= 0 ? 0 : range(t, v.delay, v.delay + FLIGHT);
      let scale = sA;
      let arc = 0;
      if (local01 > 0) {
        const e = easeInOutCubic(local01);
        const sB = formation(k + 1, v, posB, qB);
        arc = Math.sin(Math.PI * e);
        posA.lerp(posB, e);
        posA.x += Math.cos(v.phase) * arc * liftScale * 0.45;
        posA.y += Math.sin(v.phase) * arc * liftScale * 0.45;
        posA.z += arc * v.lift * liftScale;
        qA.slerp(qB, e).multiply(qTumble.setFromAxisAngle(v.axis, arc * Math.PI * 1.4));
        scale = lerp(sA, sB, e) * (1 + arc * 0.35);
        energy.setX(i, lerp(ENERGY_BASE[k], ENERGY_BASE[k + 1], e) + arc * 0.9 + (k === 0 ? flash.current[v.card] : 0));
      } else {
        energy.setX(i, ENERGY_BASE[k] + (k === 1 ? flash.current[v.card] : 0));
      }
      dummy.position.copy(posA);
      dummy.quaternion.copy(qA);
      dummy.scale.setScalar(Math.max(scale, 1e-4));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    energy.needsUpdate = true;
    material.uniforms.uTime.value = time;
    material.uniforms.uIntensity.value = state.size.width < 1024 ? lerp(0.7, 1, clamp(stage)) : 1;

    // core, halo and shell travel between formation centres
    stackMid.set(0, 0, 0);
    for (let c = 0; c < CARDS; c++) stackMid.add(f.stack[c].pos);
    stackMid.multiplyScalar(1 / CARDS);
    const te = easeInOutCubic(t);
    centre(k, centerA);
    centre(k + 1, centerB);
    centerA.lerp(centerB, te);

    haloSizes[0] = shared.heroEdge * 3.4;
    haloSizes[2] = shared.gyroRadius * 2.9;
    haloSizes[3] = shared.contactEdge * 3.6;
    coreSizes[0] = shared.heroEdge * 0.17;
    coreSizes[2] = shared.gyroRadius * 0.24;
    coreSizes[3] = shared.contactEdge * 0.12;

    if (halo.current) {
      const size = lerp(haloSizes[k], haloSizes[k + 1], te);
      halo.current.visible = size > 1e-3;
      halo.current.position.copy(centerA);
      halo.current.quaternion.copy(state.camera.quaternion);
      halo.current.scale.setScalar(Math.max(size, 1e-4));
      haloMaterial.uniforms.uOpacity.value = lerp(haloOpacity[k], haloOpacity[k + 1], te);
      haloMaterial.uniforms.uTime.value = time;
    }
    if (core.current) {
      const size = lerp(coreSizes[k], coreSizes[k + 1], te) * (1 + Math.sin(time * 2.4) * 0.08);
      core.current.visible = size > 1e-3;
      core.current.position.copy(centerA);
      core.current.scale.setScalar(Math.max(size, 1e-4));
      core.current.rotation.set(time * 0.6, time * 0.8, 0);
    }
    if (shell.current) {
      const fromHero = k === 0;
      const opacity = fromHero ? 1 - range(t, 0, 0.22) : k === 2 ? range(t, 0.78, 1) : 0;
      shell.current.visible = opacity > 0.001;
      shellMaterial.opacity = opacity * 0.55;
      shell.current.position.copy(fromHero ? f.hero.pos : f.contact.pos);
      shell.current.quaternion.copy(fromHero ? rotHero : rotContact);
      shell.current.scale.setScalar((fromHero ? shared.heroEdge : shared.contactEdge) * 1.22 * shared.breathe);
    }
  });

  return (
    <group>
      <instancedMesh ref={mesh} args={[geometry, material, COUNT]} frustumCulled={false} />
      <lineSegments ref={shell} geometry={shellGeometry} material={shellMaterial} frustumCulled={false} />
      <mesh ref={core} geometry={coreGeometry} material={coreMaterial} frustumCulled={false} />
      <mesh ref={halo} geometry={haloGeometry} material={haloMaterial} frustumCulled={false} renderOrder={-1} />
    </group>
  );
}
