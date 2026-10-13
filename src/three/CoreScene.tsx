import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SHAPES } from './shapes';
import { motionState, prefersReducedMotion } from '@/lib/motion';

/*
 * One particle system that follows you down the page.
 * Every [data-scene] section owns a shape; as a section boundary passes the
 * middle of the viewport the particles morph (with per-particle stagger and
 * turbulence) into the next shape while the whole object glides to a new
 * spot on screen.
 */

const vertex = /* glsl */ `
  attribute vec3 aS0;
  attribute vec3 aS1;
  attribute vec3 aS2;
  attribute vec3 aS3;
  attribute vec3 aS4;
  attribute vec3 aS5;
  attribute float aRand;

  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uVelocity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec3 vColor;
  varying float vAlpha;

  vec3 shapeAt(float i) {
    if (i < 0.5) return aS0;
    if (i < 1.5) return aS1;
    if (i < 2.5) return aS2;
    if (i < 3.5) return aS3;
    if (i < 4.5) return aS4;
    return aS5;
  }

  void main() {
    float p = clamp(uProgress, 0.0, 5.0);
    float fi = floor(p);
    float f = p - fi;
    float delay = aRand * 0.4;
    float t = smoothstep(delay, delay + 0.6, f);
    vec3 a = shapeAt(fi);
    vec3 b = shapeAt(min(fi + 1.0, 5.0));
    vec3 pos = mix(a, b, t);

    // turbulence peaks mid-morph, plus a calm idle drift
    float turb = sin(t * 3.14159);
    float drift = 0.035 + turb * 0.9 + min(abs(uVelocity) * 0.012, 0.35);
    pos += vec3(
      sin(pos.y * 1.7 + uTime * 0.9 + aRand * 6.2831),
      cos(pos.z * 1.3 + uTime * 0.7 + aRand * 3.0),
      sin(pos.x * 1.5 + uTime * 0.8 + aRand * 4.0)
    ) * drift;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.45 + aRand * 0.9) * uPixelRatio * (1.0 / -mv.z);

    float k = clamp(pos.y * 0.22 + 0.5, 0.0, 1.0);
    vec3 col = mix(uColorA, uColorB, k);
    col = mix(col, uColorC, step(0.94, aRand));
    col += turb * 0.25;
    vColor = col;
    vAlpha = 0.55 + aRand * 0.45;
  }
`;

const fragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.18, 0.0, d);
    float a = (glow * 0.55 + core) * vAlpha * uOpacity;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * (0.7 + core * 0.8), a);
  }
`;

type Layout = { x: number; y: number; s: number; rx: number; rz: number; o: number };

// Where the object sits for each section (desktop).
const LAYOUT: Layout[] = [
  { x: 2.4, y: 0.1, s: 1.0, rx: 0.15, rz: 0, o: 1 }, // hero
  { x: -3.0, y: 0, s: 0.85, rx: 0.3, rz: 0.2, o: 0.65 }, // about
  { x: 0, y: -0.2, s: 0.95, rx: 0.2, rz: Math.PI / 2, o: 0.45 }, // experience
  { x: 3.1, y: 0, s: 0.85, rx: 0.5, rz: 0.4, o: 0.55 }, // work
  { x: 0, y: -0.4, s: 1.15, rx: 0.55, rz: 0, o: 0.6 }, // stack
  { x: 0, y: 0.2, s: 1.05, rx: 0, rz: 0, o: 0.7 }, // contact
];

const PALETTE: [string, string, string][] = [
  ['#3de0ff', '#8b5cff', '#c6ff3d'],
  ['#c6ff3d', '#3de0ff', '#ffffff'],
  ['#ff8a3d', '#ff3d81', '#ffd23d'],
  ['#5b8cff', '#3de0ff', '#c6ff3d'],
  ['#8b5cff', '#ff3d81', '#3de0ff'],
  ['#3de0ff', '#c6ff3d', '#ffffff'],
];
const COLORS = PALETTE.map((set) => set.map((c) => new THREE.Color(c)));

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Reads the [data-scene] sections and turns scroll into 0..5 progress. */
function useSceneProgress() {
  const bounds = useRef<number[]>([]);
  useEffect(() => {
    const measure = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
      els.sort((a, b) => Number(a.dataset.scene) - Number(b.dataset.scene));
      bounds.current = els.slice(1).map((el) => el.getBoundingClientRect().top + window.scrollY);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('resize', measure);
    window.addEventListener('scene:measure', measure);
    const id = window.setInterval(measure, 1500);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scene:measure', measure);
      window.clearInterval(id);
    };
  }, []);

  return () => {
    const vh = window.innerHeight;
    const mid = window.scrollY + vh * 0.5;
    let p = 0;
    for (const b of bounds.current) {
      p += Math.min(1, Math.max(0, (mid - (b - vh * 0.45)) / (vh * 0.9)));
    }
    return p;
  };
}

function Core({ count, mobile }: { count: number; mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const getProgress = useSceneProgress();
  const intro = useRef(0);
  const reduced = useMemo(prefersReducedMotion, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const shapes = SHAPES.map((fn) => fn(count));
    geo.setAttribute('position', new THREE.BufferAttribute(shapes[0].slice(), 3));
    shapes.forEach((arr, i) => geo.setAttribute(`aS${i}`, new THREE.BufferAttribute(arr, 3)));
    const rand = new Float32Array(count);
    for (let i = 0; i < count; i++) rand[i] = Math.random();
    geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);
    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uProgress: { value: 0 },
          uTime: { value: 0 },
          uSize: { value: mobile ? 34 : 42 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
          uVelocity: { value: 0 },
          uOpacity: { value: 0 },
          uColorA: { value: COLORS[0][0].clone() },
          uColorB: { value: COLORS[0][1].clone() },
          uColorC: { value: COLORS[0][2].clone() },
        },
      }),
    [gl, mobile],
  );

  const tmpA = useMemo(() => new THREE.Color(), []);
  const smoothP = useRef(0);

  useFrame((state, delta) => {
    const u = material.uniforms;
    const target = getProgress();
    smoothP.current = THREE.MathUtils.damp(smoothP.current, target, reduced ? 20 : 4, delta);
    const p = smoothP.current;
    u.uProgress.value = p;
    u.uTime.value += reduced ? 0 : delta;
    u.uVelocity.value = THREE.MathUtils.damp(u.uVelocity.value, motionState.velocity, 6, delta);

    if (motionState.ready) intro.current = Math.min(1, intro.current + delta * 0.6);
    const introE = 1 - Math.pow(1 - intro.current, 3);

    const i = Math.min(4, Math.floor(p));
    const f = smooth(Math.min(1, Math.max(0, p - i)));
    const A = LAYOUT[i];
    const B = LAYOUT[Math.min(5, i + 1)];
    const L = {
      x: mobile ? 0 : lerp(A.x, B.x, f),
      y: lerp(A.y, B.y, f) + (mobile ? 0.6 : 0),
      s: lerp(A.s, B.s, f) * (mobile ? 0.62 : 1),
      rx: lerp(A.rx, B.rx, f),
      rz: lerp(A.rz, B.rz, f),
      o: lerp(A.o, B.o, f) * (mobile ? 0.6 : 1),
    };

    // colour palette blend
    (['uColorA', 'uColorB', 'uColorC'] as const).forEach((key, k) => {
      tmpA.copy(COLORS[i][k]).lerp(COLORS[Math.min(5, i + 1)][k], f);
      u[key].value.lerp(tmpA, Math.min(1, delta * 4));
    });

    u.uOpacity.value = L.o * introE;

    const g = group.current!;
    const px = motionState.pointer.x;
    const py = motionState.pointer.y;
    g.position.x = THREE.MathUtils.damp(g.position.x, L.x + px * 0.25, 3, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, L.y + py * 0.15, 3, delta);
    const s = L.s * (0.6 + 0.4 * introE);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 4, delta));
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, L.rx - py * 0.25, 3, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, L.rz, 3, delta);

    const spin = reduced ? 0 : delta * (0.12 + Math.min(Math.abs(motionState.velocity) * 0.004, 0.6));
    inner.current!.rotation.y += spin;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.35, 3, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, mobile ? 9.5 : 8, 2, delta);
  });

  return (
    <group ref={group}>
      <group ref={inner}>
        <points geometry={geometry} material={material} />
      </group>
    </group>
  );
}

/** Slow background starfield for depth. */
function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = -Math.random() * 18 - 2;
    }
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return g;
  }, [count]);
  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = -(window.scrollY / window.innerHeight) * 0.9;
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, -target, 3, delta);
    ref.current.rotation.z += delta * 0.004;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.035} color="#9fb4ff" transparent opacity={0.45} depthWrite={false} sizeAttenuation />
    </points>
  );
}

export default function CoreScene() {
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = mobile ? 5500 : 11000;
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 11], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Dust count={mobile ? 300 : 700} />
        <Core count={count} mobile={mobile} />
      </Canvas>
    </div>
  );
}
