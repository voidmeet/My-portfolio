/**
 * Holographic voxel: dark translucent body, glowing UV-edges and a fresnel rim.
 * Used by the instanced "data thread" that travels through every section.
 */
export const voxelVertex = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSeed;
  attribute float aEnergy;
  varying vec2 vUv;
  varying vec3 vColor;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  varying float vSeed;
  varying float vEnergy;

  void main() {
    vUv = uv;
    vColor = aColor;
    vSeed = aSeed;
    vEnergy = aEnergy;

    vec4 local = vec4(position, 1.0);
    vec3 n = normal;
    #ifdef USE_INSTANCING
      local = instanceMatrix * local;
      n = mat3(instanceMatrix) * n;
    #endif

    vec4 mv = modelViewMatrix * local;
    vNormalV = normalize(normalMatrix * n);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

export const voxelFragment = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;
  varying vec3 vColor;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  varying float vSeed;
  varying float vEnergy;

  void main() {
    vec2 e = min(vUv, 1.0 - vUv);
    float edge = min(e.x, e.y);
    float line = 1.0 - smoothstep(0.035, 0.11, edge);
    float fres = pow(1.0 - abs(dot(vNormalV, vViewDir)), 2.2);
    float flicker = 0.5 + 0.5 * sin(uTime * 3.2 + vSeed * 6.2831);

    float glow = line * (1.25 + vEnergy * 1.5) + fres * 0.55 + 0.1 + flicker * 0.08 + vEnergy * 0.35;
    vec3 col = mix(vColor, vec3(1.0), line * vEnergy * 0.45) * glow;
    float a = clamp(line * 0.95 + fres * 0.35 + 0.08 + vEnergy * 0.2, 0.0, 1.0) * uIntensity;
    gl_FragColor = vec4(col * a, a);
  }
`;

/** Soft additive glow sprite — a cheap stand-in for bloom. */
export const haloVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const haloFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float core = pow(max(0.0, 1.0 - d), 3.0);
    float wide = pow(max(0.0, 1.0 - d), 1.4) * 0.35;
    float ring = smoothstep(0.03, 0.0, abs(d - (0.55 + 0.05 * sin(uTime * 2.0)))) * 0.25;
    float a = (core + wide + ring) * uOpacity;
    gl_FragColor = vec4(uColor * a, a);
  }
`;

/** Fresnel energy core at the centre of the thread. */
export const coreVertex = /* glsl */ `
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormalV = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

export const coreFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  void main() {
    float fres = pow(1.0 - abs(dot(vNormalV, vViewDir)), 1.6);
    float a = (0.25 + fres * 0.9) * uOpacity;
    gl_FragColor = vec4(mix(uColor, vec3(1.0), 0.35) * a, a);
  }
`;
