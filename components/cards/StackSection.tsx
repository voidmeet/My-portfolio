"use client";

import type { ReactNode } from "react";
import { sectionRef } from "@/lib/scene-state";

export function StackSection({ children }: { children: ReactNode }) {
  return (
    <section id="stack" ref={sectionRef("stack")} className="relative z-10 px-5 py-32 sm:px-8 md:py-44">
      {children}
    </section>
  );
}
