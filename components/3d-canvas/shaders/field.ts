/** Deep-space data particles drifting toward the camera as you scroll. */
export const fieldVertex = /* glsl */ `
  uniform float uTravel;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aRandom;
  varying float vAlpha;
  varying vec3 vColor;

  const float DEPTH = 46.0;

  void main() {
    vec3 pos = position;
    pos.z = mod(position.z + uTravel * (0.6 + aRandom * 0.8), DEPTH) - 40.0;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.4 + aRandom) * uPixelRatio * (10.0 / -mv.z);

    float nearFade = 1.0 - smoothstep(2.0, 6.0, pos.z);
    float farFade = smoothstep(-40.0, -26.0, pos.z);
    vAlpha = nearFade * farFade * (0.25 + aRandom * 0.55);
    vColor = aRandom > 0.82 ? vec3(0.22, 1.0, 0.53) : (aRandom > 0.5 ? vec3(0.66, 0.33, 0.97) : vec3(0.13, 0.83, 0.93));
  }
`;

/** Perspective "infrastructure floor" grid, anti-aliased with fwidth. */
export const gridVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const gridFragment = /* glsl */ `
  uniform float uTravel;
  uniform float uOpacity;
  uniform vec3 uCamera;
  varying vec3 vWorld;

  float gridLine(vec2 p, float scale) {
    vec2 g = abs(fract(p / scale - 0.5) - 0.5) / fwidth(p / scale);
    return 1.0 - min(min(g.x, g.y), 1.0);
  }

  void main() {
    vec2 p = vec2(vWorld.x, vWorld.z - uTravel);
    float minor = gridLine(p, 1.0) * 0.35;
    float major = gridLine(p, 5.0);
    float dist = length(vWorld.xz - uCamera.xz);
    float fade = smoothstep(46.0, 6.0, dist) * smoothstep(1.0, 7.0, dist);
    vec3 col = mix(vec3(0.13, 0.83, 0.93), vec3(0.66, 0.33, 0.97), smoothstep(-30.0, 0.0, vWorld.z));
    float a = max(minor, major) * fade * uOpacity;
    gl_FragColor = vec4(col * a, a);
  }
`;
