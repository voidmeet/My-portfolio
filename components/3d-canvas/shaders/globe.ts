/** Fibonacci-sphere particle cloud: the "cluster" in the hero. */
export const globeVertex = /* glsl */ `
  uniform float uTime;
  uniform float uDisperse;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uOpacity;
  attribute float aRandom;
  varying float vAlpha;
  varying vec3 vColor;

  const vec3 BLUE = vec3(0.13, 0.83, 0.93);
  const vec3 PURPLE = vec3(0.66, 0.33, 0.97);
  const vec3 GREEN = vec3(0.22, 1.0, 0.53);

  void main() {
    vec3 dir = normalize(position);

    // travelling interference bands read as "load" moving across the cluster
    float n = sin(dir.x * 6.0 + uTime * 0.6) * sin(dir.y * 7.0 - uTime * 0.45) * sin(dir.z * 5.0 + uTime * 0.5);
    float pulse = smoothstep(0.12, 0.55, n);

    // when the hero scrolls away the cluster explodes outward along its normals
    float burst = uDisperse * uDisperse;
    float radius = 1.0 + burst * (0.8 + aRandom * 3.2);
    vec3 pos = dir * radius;
    float swirl = burst * (1.5 + aRandom * 2.0);
    float s = sin(swirl), c = cos(swirl);
    pos.xz = mat2(c, -s, s, c) * pos.xz;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.55 + aRandom * 0.7 + pulse * 1.3);
    gl_PointSize = size * uPixelRatio * (10.0 / -mv.z);

    vec3 nView = normalize(normalMatrix * dir);
    float facing = nView.z * 0.5 + 0.5;
    vAlpha = (0.18 + 0.82 * facing) * (0.45 + pulse * 0.9) * (1.0 - smoothstep(0.35, 1.0, uDisperse)) * uOpacity;

    vColor = mix(BLUE, PURPLE, smoothstep(-0.9, 0.9, dir.y + n * 0.6));
    vColor = mix(vColor, GREEN, pulse * step(0.86, aRandom));
  }
`;

export const pointFragment = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * a, a * vAlpha);
  }
`;

/** Great-circle arcs with a bright packet running along each one. */
export const arcVertex = /* glsl */ `
  attribute float aT;
  attribute float aSeed;
  varying float vT;
  varying float vSeed;

  void main() {
    vT = aT;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const arcFragment = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying float vT;
  varying float vSeed;

  void main() {
    float head = fract(uTime * (0.16 + vSeed * 0.12) + vSeed * 7.31);
    float dist = head - vT;
    float trail = dist >= 0.0 ? exp(-dist * 9.0) * step(dist, 0.45) : 0.0;
    vec3 col = mix(vec3(0.13, 0.83, 0.93), vec3(0.22, 1.0, 0.53), trail);
    float a = (0.07 + trail * 0.95) * uOpacity;
    gl_FragColor = vec4(col * a, a);
  }
`;
