/**
 * Single source of truth for portfolio content.
 * Everything here is sourced from Meet's CV — keep it factual.
 */

export const profile = {
  name: "Meet Bundela",
  role: "Cloud & DevOps Engineer",
  location: "Rajkot, Gujarat, India",
  email: "meetlearns@gmail.com",
  website: "https://meetbundela.in",
  linkedin: "https://www.linkedin.com/in/meetbundela",
  github: "https://github.com/voidmeet",
  summary:
    "DevOps Engineer with 2.5+ years of hands-on experience running production infrastructure on AWS, Hetzner and DigitalOcean. Leads a team of three DevOps engineers at Multiicon, owning the observability platform, Kubernetes workloads and CI/CD across Linux and Windows Server estates.",
  short:
    "I run production infrastructure on AWS, Hetzner and DigitalOcean — Kubernetes workloads, CI/CD pipelines and the observability stack that keeps them honest.",
} as const;

export const heroStats = [
  { value: "2.5+", label: "years in production" },
  { value: "99%+", label: "uptime after k8s migration" },
  { value: "03", label: "engineers led" },
  { value: "05", label: "cloud platforms" },
] as const;

export type Accent = "blue" | "purple" | "green" | "spectrum";

export type SkillIcon =
  | "docker"
  | "kubernetes"
  | "aws"
  | "jenkins"
  | "cicd"
  | "linux"
  | "nginx"
  | "prometheus"
  | "grafana"
  | "loki"
  | "tempo"
  | "alloy";

export interface Skill {
  name: string;
  detail: string;
  icon: SkillIcon;
}

export interface StackCategory {
  id: string;
  label: string;
  title: string;
  namespace: string;
  accent: Accent;
  skills: Skill[];
}

export const stack: StackCategory[] = [
  {
    id: "containers",
    label: "Containerization",
    title: "Containers & Orchestration",
    namespace: "ns/containers",
    accent: "blue",
    skills: [
      { name: "Docker", detail: "Image builds · Compose · Podman", icon: "docker" },
      { name: "Kubernetes", detail: "EKS · Helm · ArgoCD · StatefulSets", icon: "kubernetes" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & CI/CD",
    title: "Cloud & Delivery",
    namespace: "ns/delivery",
    accent: "purple",
    skills: [
      { name: "AWS", detail: "EC2 · S3 · VPC · EKS", icon: "aws" },
      { name: "Jenkins", detail: "Multi-env pipelines for production clients", icon: "jenkins" },
      { name: "CI/CD Pipelines", detail: "GitHub Actions · GitLab CI · rolling deploys", icon: "cicd" },
    ],
  },
  {
    id: "os",
    label: "OS & Admin",
    title: "Systems & Edge",
    namespace: "ns/systems",
    accent: "green",
    skills: [
      { name: "Linux (Ubuntu)", detail: "Hardening · shell automation · Windows Server too", icon: "linux" },
      { name: "Nginx", detail: "Reverse proxy · Certbot TLS · bastion hosts", icon: "nginx" },
    ],
  },
  {
    id: "observability",
    label: "Observability",
    title: "Telemetry Platform",
    namespace: "ns/monitoring",
    accent: "spectrum",
    skills: [
      { name: "Prometheus", detail: "Metrics · Node Exporter · alert rules", icon: "prometheus" },
      { name: "Grafana", detail: "Dashboards & alerting", icon: "grafana" },
      { name: "Loki", detail: "Centralised log aggregation", icon: "loki" },
      { name: "Tempo", detail: "Distributed tracing", icon: "tempo" },
      { name: "Alloy", detail: "Unified telemetry collector", icon: "alloy" },
    ],
  },
];

export const toolchain = [
  "Terraform",
  "Ansible",
  "Helm",
  "ArgoCD",
  "Podman",
  "GitHub Actions",
  "GitLab CI",
  "CloudFormation",
  "GCP",
  "Azure",
  "Hetzner Cloud",
  "DigitalOcean",
  "Python",
  "Shell",
  "Backstage",
  "Windows Server",
  "MongoDB",
  "Redis",
  "Git",
] as const;

export interface Milestone {
  stage: string;
  title: string;
  org: string;
  period: string;
  metric: { value: string; label: string };
  summary: string;
  points: string[];
  tags: string[];
  accent: Accent;
}

export const milestones: Milestone[] = [
  {
    stage: "provision",
    title: "Scalable cloud infrastructure & automated delivery",
    org: "Wings Tech Solutions · Evolution Infosystem",
    period: "May 2024 — Aug 2025",
    metric: { value: "99%+", label: "uptime after migration" },
    summary:
      "Sole DevOps owner for SaaS products — moved cTrunk and Vani from on-prem to Hetzner Cloud on Kubernetes.",
    points: [
      "Containerised both products with Docker and ran them on Kubernetes with auto-healing and rolling deployments.",
      "Ran Jenkins CI/CD and cloud infrastructure for RRB Ahmedabad (Govt. of India), Captain Tractors and Brooon across AWS and DigitalOcean.",
    ],
    tags: ["Kubernetes", "Docker", "Jenkins", "Hetzner", "AWS", "DigitalOcean"],
    accent: "blue",
  },
  {
    stage: "observe",
    title: "Central observability & telemetry stack",
    org: "Multiicon · Evolution Infosystem",
    period: "Apr 2025 — Present",
    metric: { value: "3", label: "signals: metrics · logs · traces" },
    summary:
      "Built a central platform with Prometheus, Grafana, Loki, Tempo and Alloy covering Ubuntu Linux and Windows Server hosts.",
    points: [
      "Shipped Prometheus + Grafana with Node Exporter and alert rules, fronted by an NGINX reverse proxy with Certbot TLS and a bastion host.",
      "Reworked CI/CD pipelines for higher availability and faster deployments across mixed-OS AWS and hybrid estates.",
    ],
    tags: ["Prometheus", "Grafana", "Loki", "Tempo", "Alloy", "NGINX"],
    accent: "purple",
  },
  {
    stage: "automate",
    title: "Custom automation: Jira → OpenProject",
    org: "Multiicon",
    period: "May 2026 — Present",
    metric: { value: "2-way", label: "Jira ⇄ OpenProject API sync" },
    summary:
      "Wrote Python tooling to migrate Jira data into self-hosted OpenProject and keep both in sync over their APIs.",
    points: [
      "Cut recurring manual admin work by automating the migration and ongoing synchronisation.",
      "Built a Jira analytics app from scratch, ready for open source, and set up Backstage as the developer portal.",
    ],
    tags: ["Python", "Jira API", "OpenProject", "Backstage"],
    accent: "green",
  },
  {
    stage: "validate",
    title: "Web3 infrastructure: THORNode on AWS EKS",
    org: "Pedals Up",
    period: "Aug 2025 — Apr 2026",
    metric: { value: "Mainnet", label: "validator node live" },
    summary:
      "Deployed and operated a Thorchain validator node on AWS EKS using StatefulSets, Persistent Volumes and Helm charts.",
    points: [
      "Owned the cluster lifecycle for high availability — upgrades, scaling, secrets and incident response.",
      "Set up CI/CD pipelines with Prometheus and Grafana alerting around the node.",
    ],
    tags: ["AWS EKS", "Helm", "StatefulSets", "Thorchain", "Prometheus"],
    accent: "blue",
  },
];

export const roles = [
  { hash: "a3f9c1e", ref: "HEAD -> main", title: "DevOps Engineer", org: "Multiicon", place: "Rajkot", period: "May 2026 — Present", note: "Leading a team of 3 DevOps engineers" },
  { hash: "7be04d2", title: "DevOps Engineer", org: "Pedals Up", place: "Ahmedabad", period: "Aug 2025 — Apr 2026", note: "Thorchain validator on AWS EKS" },
  { hash: "c51a8f0", title: "DevOps Engineer (Dedicated)", org: "Evolution Infosystem", place: "Rajkot", period: "Apr 2025 — Aug 2025", note: "Sole DevOps owner for SaaS products" },
  { hash: "19d6e3b", title: "DevOps Engineer", org: "Wings Tech Solutions", place: "Rajkot", period: "May 2024 — Mar 2025", note: "On-prem → Kubernetes at 99%+ uptime" },
] as const;

export const credentials = {
  education: "MCA — The Oxford College of Engineering, Bangalore (2021 – 2023, CGPA 8.0)",
  certification: "AWS Certified Cloud Practitioner (2023 – 2026)",
  achievements: [
    "Guinness World Record participant — IIT Madras × GUVI 24-hour programming-teaching record",
    "Ideathon winner (Zebra energy innovation)",
    "Published researcher — “Third Eye” IoT intrusion detection, ICRACSIT",
  ],
} as const;

export const navLinks = [
  { id: "stack", index: "01", label: "Stack" },
  { id: "pipeline", index: "02", label: "Pipeline" },
  { id: "contact", index: "03", label: "Contact" },
] as const;

export const locations = {
  rajkot: { name: "Rajkot", code: "RJK", lat: 22.3039, lon: 70.8022, role: "Base of operations" },
  ahmedabad: { name: "Ahmedabad", code: "AMD", lat: 23.0225, lon: 72.5714, role: "Operational node" },
} as const;
