import {
  ChartArea,
  Cloud,
  Combine,
  Container,
  Flame,
  Infinity as InfinityIcon,
  type LucideProps,
  Network,
  ScrollText,
  ShipWheel,
  SquareTerminal,
  Waypoints,
  Workflow,
} from "lucide-react";
import type { ComponentType } from "react";
import type { SkillIcon as SkillIconName } from "@/lib/data";

const ICONS: Record<SkillIconName, ComponentType<LucideProps>> = {
  docker: Container,
  kubernetes: ShipWheel,
  aws: Cloud,
  jenkins: Workflow,
  cicd: InfinityIcon,
  linux: SquareTerminal,
  nginx: Network,
  prometheus: Flame,
  grafana: ChartArea,
  loki: ScrollText,
  tempo: Waypoints,
  alloy: Combine,
};

export function SkillIcon({ name, ...props }: { name: SkillIconName } & LucideProps) {
  const Icon = ICONS[name];
  return <Icon aria-hidden strokeWidth={1.6} {...props} />;
}
