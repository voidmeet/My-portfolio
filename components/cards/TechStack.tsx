import { SectionHeading } from "@/components/ui/SectionHeading";
import { stack } from "@/lib/data";
import { TechCard } from "./TechCard";
import { ToolchainMarquee } from "./ToolchainMarquee";
import { StackSection } from "./StackSection";

const SPANS = ["lg:col-span-5", "lg:col-span-7", "lg:col-span-5", "lg:col-span-7"];

export function TechStack() {
  return (
    <StackSection>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="01"
            kicker="kubectl get stack -o wide"
            title="The stack"
            highlight="that keeps prod alive."
            subtitle="Containers, clouds, Linux and a full telemetry platform — the tooling I run in production every day."
          />
          <p className="max-w-xs font-mono text-[11px] leading-relaxed text-white/35 lg:pb-3 lg:text-right">
            <span className="text-neon-green/80">#</span> the container from the cluster above just shattered into 64
            nodes — each port below is powered by one slice of it.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
          {stack.map((category, i) => (
            <TechCard key={category.id} category={category} index={i} className={SPANS[i]} />
          ))}
        </div>

        <ToolchainMarquee className="mt-24" />
      </div>
    </StackSection>
  );
}
