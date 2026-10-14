// Procedural point clouds the core morphs between while scrolling.
// Each returns a Float32Array of length count * 3.

const TAU = Math.PI * 2;

// Deterministic PRNG so every shape lines up the same particle indices.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gauss = (r: () => number) => {
  const u = 1 - r();
  const v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
};

/** Hero: a dense planet-core with an orbiting ring. */
export function sphere(count: number) {
  const out = new Float32Array(count * 3);
  const r = rng(1);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const ringCount = Math.floor(count * 0.22);
  const shellCount = count - ringCount;
  for (let i = 0; i < shellCount; i++) {
    const y = 1 - (i / (shellCount - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    const R = 1.9 + gauss(r) * 0.03;
    out[i * 3] = Math.cos(th) * rad * R;
    out[i * 3 + 1] = y * R;
    out[i * 3 + 2] = Math.sin(th) * rad * R;
  }
  for (let j = 0; j < ringCount; j++) {
    const i = shellCount + j;
    const a = r() * TAU;
    const R = 2.9 + gauss(r) * 0.18;
    const x = Math.cos(a) * R;
    const z = Math.sin(a) * R;
    const tilt = 0.42;
    out[i * 3] = x;
    out[i * 3 + 1] = z * Math.sin(tilt) + gauss(r) * 0.03;
    out[i * 3 + 2] = z * Math.cos(tilt);
  }
  return out;
}

/** About: a (3,5) torus knot — one continuous line, like a career. */
export function torusKnot(count: number) {
  const out = new Float32Array(count * 3);
  const r = rng(2);
  const p = 3;
  const q = 5;
  for (let i = 0; i < count; i++) {
    const t = (i / count) * TAU;
    const rr = 1.55 + 0.6 * Math.cos(q * t);
    const cx = rr * Math.cos(p * t);
    const cy = rr * Math.sin(p * t);
    const cz = 0.6 * Math.sin(q * t);
    const tube = 0.16 * Math.sqrt(r());
    const a = r() * TAU;
    out[i * 3] = cx + Math.cos(a) * tube;
    out[i * 3 + 1] = cy + Math.sin(a) * tube;
    out[i * 3 + 2] = cz + Math.cos(a + 1.3) * tube;
  }
  return out;
}

/** Experience: a double helix pipeline with rungs. */
export function helix(count: number) {
  const out = new Float32Array(count * 3);
  const r = rng(3);
  const H = 7;
  const turns = 3.2;
  for (let i = 0; i < count; i++) {
    const kind = r();
    const t = r();
    const y = (t - 0.5) * H;
    const a = t * TAU * turns;
    if (kind < 0.8) {
      const strand = kind < 0.4 ? 0 : Math.PI;
      const R = 1.25 + gauss(r) * 0.05;
      out[i * 3] = Math.cos(a + strand) * R;
      out[i * 3 + 1] = y + gauss(r) * 0.04;
      out[i * 3 + 2] = Math.sin(a + strand) * R;
    } else {
      // rungs at discrete steps
      const step = Math.round(t * 34) / 34;
      const ya = (step - 0.5) * H;
      const aa = step * TAU * turns;
      const s = r() * 2 - 1;
      out[i * 3] = Math.cos(aa) * 1.25 * s;
      out[i * 3 + 1] = ya;
      out[i * 3 + 2] = Math.sin(aa) * 1.25 * s;
    }
  }
  return out;
}

/** Work: a cluster — 3x3x3 lattice of node cubes joined by edges. */
export function cluster(count: number) {
  const out = new Float32Array(count * 3);
  const r = rng(4);
  const g = 3;
  const spacing = 1.35;
  const half = ((g - 1) * spacing) / 2;
  for (let i = 0; i < count; i++) {
    const nx = Math.floor(r() * g);
    const ny = Math.floor(r() * g);
    const nz = Math.floor(r() * g);
    const cx = nx * spacing - half;
    const cy = ny * spacing - half;
    const cz = nz * spacing - half;
    if (r() < 0.62) {
      // small cube node: points on its edges
      const s = 0.26;
      const axis = Math.floor(r() * 3);
      const u = (r() * 2 - 1) * s;
      const v = (r() < 0.5 ? -1 : 1) * s;
      const w = (r() < 0.5 ? -1 : 1) * s;
      const p = axis === 0 ? [u, v, w] : axis === 1 ? [v, u, w] : [v, w, u];
      out[i * 3] = cx + p[0];
      out[i * 3 + 1] = cy + p[1];
      out[i * 3 + 2] = cz + p[2];
    } else {
      // links between neighbouring nodes
      const axis = Math.floor(r() * 3);
      const t = r() * spacing;
      const p = [cx, cy, cz];
      if (p[axis] + t <= half + 0.001) p[axis] += t;
      else p[axis] -= t;
      out[i * 3] = p[0];
      out[i * 3 + 1] = p[1];
      out[i * 3 + 2] = p[2];
    }
  }
  return out;
}

/** Stack: a spiral galaxy — everything orbiting one core. */
export function galaxy(count: number) {
  const out = new Float32Array(count * 3);
  const r = rng(5);
  const arms = 4;
  for (let i = 0; i < count; i++) {
    const radius = Math.pow(r(), 1.6) * 3.6 + 0.1;
    const arm = (i % arms) / arms * TAU;
    const spin = radius * 1.1;
    const spread = 0.35 * radius * 0.35;
    const a = arm + spin;
    out[i * 3] = Math.cos(a) * radius + gauss(r) * spread;
    out[i * 3 + 1] = gauss(r) * 0.12 * (1.2 - radius / 3.6);
    out[i * 3 + 2] = Math.sin(a) * radius + gauss(r) * spread;
  }
  return out;
}

/** Contact: a portal — concentric rings pulling inward. */
export function portal(count: number) {
  const out = new Float32Array(count * 3);
  const r = rng(6);
  for (let i = 0; i < count; i++) {
    const ring = Math.floor(r() * 7);
    const R = 0.5 + ring * 0.42 + gauss(r) * 0.02;
    const a = r() * TAU;
    out[i * 3] = Math.cos(a) * R;
    out[i * 3 + 1] = Math.sin(a) * R;
    out[i * 3 + 2] = -ring * 0.55 + gauss(r) * 0.03;
  }
  return out;
}

export const SHAPES = [sphere, torusKnot, helix, cluster, galaxy, portal];
