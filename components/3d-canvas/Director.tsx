"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, type Camera, type PerspectiveCamera } from "three";
import { getAnchor, getSection, type AnchorKey } from "@/lib/scene-state";
import { damp, range } from "@/lib/utils";
import { frameState, type AnchorFrame } from "./frame-state";

const ndc = new Vector3();
const dir = new Vector3();
const STACK_KEYS: AnchorKey[] = ["stack-0", "stack-1", "stack-2", "stack-3"];

function project(key: AnchorKey, out: AnchorFrame, camera: Camera, w: number, h: number) {
  const el = getAnchor(key);
  if (!el) {
    out.visible = false;
    return;
  }
  const r = el.getBoundingClientRect();
  ndc.set(((r.left + r.width / 2) / w) * 2 - 1, -((r.top + r.height / 2) / h) * 2 + 1, 0.5).unproject(camera);
  dir.copy(ndc).sub(camera.position).normalize();
  out.pos.copy(camera.position).addScaledVector(dir, -camera.position.z / dir.z);
  out.size = Math.max(1, Math.min(r.width, r.height)) * frameState.unit;
  out.visible = r.bottom > -h && r.top < h * 2;
}

const sectionTop = (key: Parameters<typeof getSection>[0], fallback: number) =>
  getSection(key)?.getBoundingClientRect().top ?? fallback;

/**
 * Reads the DOM once per frame (all layout reads batched here) and turns it
 * into scroll stages + world-space anchors for the rest of the scene.
 */
export function Director() {
  const lastScroll = useRef(-1);

  useFrame((state, delta) => {
    const camera = state.camera as PerspectiveCamera;
    const { width: w, height: h } = state.size;
    const vh = window.innerHeight;

    frameState.halfHeight = camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
    frameState.unit = (frameState.halfHeight * 2) / h;

    // Stage transitions are measured from where each section's top edge sits.
    frameState.p1 = range(vh - sectionTop("stack", vh), 0, vh * 0.75);
    frameState.p2 = range(vh - sectionTop("experience", vh), 0, vh);
    frameState.p3 = range(vh - sectionTop("contact", vh), 0, vh * 0.8);
    frameState.stage =
      frameState.p3 > 0 ? 2 + frameState.p3 : frameState.p2 > 0 ? 1 + frameState.p2 : frameState.p1;

    project("hero", frameState.hero, camera, w, h);
    for (let i = 0; i < 4; i++) project(STACK_KEYS[i], frameState.stack[i], camera, w, h);
    project("experience", frameState.experience, camera, w, h);
    project("contact", frameState.contact, camera, w, h);

    const scroll = window.scrollY;
    const dy = lastScroll.current < 0 ? 0 : scroll - lastScroll.current;
    lastScroll.current = scroll;
    const dt = Math.max(delta, 1 / 240);
    frameState.scrollVelocity = damp(frameState.scrollVelocity, dy / dt, 8, delta);
    frameState.travel += delta * 0.45 + dy * 0.0045;
  }, -1);

  return null;
}
