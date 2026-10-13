/**
 * Bridge between the DOM (sections, anchors, scroll) and the WebGL scene.
 *
 * Everything here is plain mutable state read inside `useFrame`, so scrolling
 * never triggers a React render. DOM components register "anchors" — empty
 * elements whose on-screen box tells the 3D thread where to live — and the
 * scene projects those boxes into world space every frame.
 */

export type SectionKey = "hero" | "stack" | "experience" | "contact";
export type AnchorKey =
  | "hero"
  | "stack-0"
  | "stack-1"
  | "stack-2"
  | "stack-3"
  | "experience"
  | "contact";

export const sceneState = {
  /** Pointer position normalised to -1..1 (y up). */
  pointer: { x: 0, y: 0 },
  /** True once the WebGL canvas is created and drawing. */
  webglReady: false,
};

const anchors = new Map<AnchorKey, HTMLElement>();
const sections = new Map<SectionKey, HTMLElement>();

export const getAnchor = (key: AnchorKey) => anchors.get(key) ?? null;
export const getSection = (key: SectionKey) => sections.get(key) ?? null;

/** Ref callback factory: `<div ref={anchorRef("hero")} />` (React 19 cleanup refs). */
export function anchorRef(key: AnchorKey) {
  return (el: HTMLElement | null) => {
    if (!el) return;
    anchors.set(key, el);
    return () => {
      if (anchors.get(key) === el) anchors.delete(key);
    };
  };
}

export function sectionRef(key: SectionKey) {
  return (el: HTMLElement | null) => {
    if (!el) return;
    sections.set(key, el);
    return () => {
      if (sections.get(key) === el) sections.delete(key);
    };
  };
}
