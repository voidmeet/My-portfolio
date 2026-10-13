"use client";

import { useSyncExternalStore } from "react";
import { ArrowUp, Mail } from "lucide-react";
import { useScrollTo } from "@/components/scroll/SmoothScroll";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { profile } from "@/lib/data";

const noop = () => () => {};

function useYear() {
  return useSyncExternalStore(noop, () => new Date().getFullYear(), () => null);
}

const socials = [
  { label: "LinkedIn", href: profile.linkedin, Icon: LinkedinIcon },
  { label: "GitHub", href: profile.github, Icon: GithubIcon },
  { label: "Email", href: `mailto:${profile.email}`, Icon: Mail },
];

export function Footer() {
  const year = useYear();
  const scrollTo = useScrollTo();

  return (
    <footer className="relative mx-auto mt-32 max-w-7xl">
      <p
        aria-hidden
        className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[15.5vw] font-bold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.07)] xl:text-[200px]"
      >
        MEET BUNDELA
      </p>
      <div className="mt-8 flex flex-col gap-6 border-t border-white/[0.06] py-8 md:flex-row md:items-center md:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
          © {year ?? ""} {profile.name} · Rajkot, IN
        </p>
        <p className="font-mono text-[11px] text-white/30">
          Next.js · React Three Fiber · GSAP · Framer Motion — deployed with care
        </p>
        <div className="flex items-center gap-2">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              aria-label={label}
              className="grid size-10 place-items-center rounded-full border border-white/10 text-white/55 transition-colors hover:border-neon-blue/50 hover:text-white"
            >
              <Icon className="size-4" />
            </a>
          ))}
          <button
            type="button"
            onClick={() => scrollTo("#top")}
            aria-label="Back to top"
            className="ml-2 grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-neon-green/50 hover:text-neon-green"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
