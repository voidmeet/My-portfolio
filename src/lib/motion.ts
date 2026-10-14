// Tiny shared state for scroll / pointer so the WebGL scene, marquee and
// other effects can read it every frame without React re-renders.
export const motionState = {
  velocity: 0, // lenis scroll velocity (px per frame-ish)
  scroll: 0,
  pointer: { x: 0, y: 0 }, // normalised -1..1
  ready: false, // preloader finished
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      motionState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      motionState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true },
  );
}
