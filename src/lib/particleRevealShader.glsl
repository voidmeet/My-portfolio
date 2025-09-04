// Vertex Shader
attribute float aReveal;
varying vec3 vColor;
varying float vReveal;

void main() {
  vColor = color;
  vReveal = aReveal;
  // Animate position based on reveal (0 = dispersed, 1 = assembled)
  vec3 animatedPosition = mix(position + normalize(position) * 120.0, position, aReveal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(animatedPosition, 1.0);
  gl_PointSize = 3.5 * aReveal;
}

// Fragment Shader
varying vec3 vColor;
varying float vReveal;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  gl_FragColor = vec4(vColor, vReveal);
} 