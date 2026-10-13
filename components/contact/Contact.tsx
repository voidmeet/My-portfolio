"use client";

import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/lib/data";
import { sectionRef } from "@/lib/scene-state";
import { OpsMap } from "./OpsMap";
import { Terminal } from "./Terminal";

export function Contact() {
  return (
    <section id="contact" ref={sectionRef("contact")} className="relative z-10 px-5 pt-32 sm:px-8 md:pt-44">
      <div className="mx-auto grid max-w-7xl gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:grid-rows-[auto_1fr]">
        <SectionHeading
          index="03"
          kicker="ssh guest@meetbundela.in"
          title="Open a"
          highlight="connection."
          subtitle="Send a message straight from the terminal below — or poke around with a few commands first."
        />

        <div className="relative lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <OpsMap className="mx-auto max-w-[620px] opacity-90" />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-[11px] text-white/45 lg:justify-start">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-1.5 transition-colors hover:text-neon-blue"
            >
              {profile.email}
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <span>IST (UTC+05:30)</span>
          </div>
        </div>

        <Terminal className="lg:col-start-1 lg:row-start-2" />
      </div>

      <Footer />
    </section>
  );
}
