import { Vector3 } from "three";

export interface AnchorFrame {
  /** Centre of the DOM anchor projected onto the z = 0 plane. */
  pos: Vector3;
  /** min(width, height) of the anchor box, in world units. */
  size: number;
  /** Roughly within one screen of the viewport. */
  visible: boolean;
}

const anchor = (): AnchorFrame => ({ pos: new Vector3(), size: 1, visible: false });

/**
 * Per-frame scene snapshot, written once by <Director /> and read by every
 * other 3D component in the same frame. Never stored in React state.
 */
export const frameState = {
  /** Continuous stage: 0 hero → 1 stack → 2 pipeline → 3 contact. */
  stage: 0,
  p1: 0,
  p2: 0,
  p3: 0,
  /** World units per CSS pixel on the z = 0 plane. */
  unit: 0.01,
  /** Half of the visible world height at z = 0. */
  halfHeight: 4,
  /** Accumulated travel distance (time + scroll) for the depth field. */
  travel: 0,
  /** Smoothed scroll velocity in px/s. */
  scrollVelocity: 0,
  hero: anchor(),
  stack: [anchor(), anchor(), anchor(), anchor()] as AnchorFrame[],
  experience: anchor(),
  contact: anchor(),
};

export type Quality = "high" | "low";
