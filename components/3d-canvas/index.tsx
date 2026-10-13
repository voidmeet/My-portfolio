"use client";

import dynamic from "next/dynamic";

/** Client-only entry so capability checks can run synchronously on mount. */
export const SceneLayer = dynamic(() => import("./SceneCanvas"), { ssr: false });
