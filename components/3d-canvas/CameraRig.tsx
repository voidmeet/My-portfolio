"use client";

import { useFrame } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import { sceneState } from "@/lib/scene-state";
import { clamp, damp } from "@/lib/utils";

/**
 * Responsive camera: widens the FOV on portrait screens so the depth effects
 * keep their drama on phones, and adds a soft pointer parallax on desktop.
 */
export function CameraRig() {
  useFrame((state, delta) => {
    const camera = state.camera as PerspectiveCamera;
    const aspect = state.size.width / Math.max(1, state.size.height);
    const targetFov = clamp(40 + (1.25 - aspect) * 16, 38, 58);
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov = damp(camera.fov, targetFov, 6, delta);
      camera.updateProjectionMatrix();
    }

    camera.position.x = damp(camera.position.x, sceneState.pointer.x * 0.35, 2.4, delta);
    camera.position.y = damp(camera.position.y, sceneState.pointer.y * 0.22, 2.4, delta);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
  }, -2);

  return null;
}
