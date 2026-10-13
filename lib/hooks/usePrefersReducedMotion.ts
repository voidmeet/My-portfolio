"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * Hydration-safe reduced-motion flag: renders `false` on the server and during
 * hydration, then re-renders with the real preference. (framer-motion's
 * `useReducedMotion` reads the media query during hydration, which makes
 * SSR'd text animations mismatch.)
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
