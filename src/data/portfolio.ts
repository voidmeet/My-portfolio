import { calculateExperienceYears } from '@/lib/utils';

// Career started May 2024 (month index is zero-based).
export const experienceYears = () => calculateExperienceYears(2024, 4, 1).toFixed(1);

export const profile = {
  name: 'Meet Bundela',
  first: 'MEET',
  last: 'BUNDELA',
  role: 'DevOps Engineer',
  location: 'Rajkot, Gujarat, India',
  coords: '22.30°N  70.80°E',
  timezone: 'Asia/Kolkata',
  email: 'meetlearns@gmail.com',
  phone: '+91 72288 80828',
  phoneHref: 'tel:+917228880828',
  resume: '/Meet_Bundela_CV.pdf',
  summary:
    'DevOps Engineer running production infrastructure on AWS, Hetzner and DigitalOcean. I lead a team of three DevOps engineers at Multiicon, owning the observability platform, Kubernetes workloads and CI/CD across Linux and Windows Server estates. Before that I migrated a SaaS product from on-prem to Kubernetes at 99%+ uptime and operated a live Thorchain validator node on AWS EKS.',
};

export const roles = [
  'DevOps Engineer',
  'Kubernetes Operator',
  'Observability Lead',
  'CI/CD Architect',
  'Cloud Infrastructure',
];

export const socials = [
  { name: 'GitHub', handle: '@voidmeet', url: 'https://github.com/voidmeet' },
  { name: 'LinkedIn', handle: 'in/meetbundela', url: 'https://www.linkedin.com/in/meetbundela' },
  { name: 'Email', handle: 'meetlearns@gmail.com', url: 'mailto:meetlearns@gmail.com' },
  { name: 'WhatsApp', handle: 'Chat', url: 'https://wa.me/919428209494' },
];

export const stats = [
  { value: 2.5, suffix: '+', label: 'Years in production', decimals: 1, dynamic: true },
  { value: 99, suffix: '%+', label: 'Uptime after K8s migration', decimals: 0 },
  { value: 3, suffix: '', label: 'Engineers I lead', decimals: 0 },
  { value: 4, suffix: '', label: 'Clouds operated', decimals: 0 },
];

export type Job = {
  company: string;
  role: string;
  place: string;
  period: string;
  current?: boolean;
  stage: string;
  points: string[];
  stack: string[];
};

export const experience: Job[] = [
  {
    company: 'Multiicon',
    role: 'DevOps Engineer · Team Lead',
    place: 'Rajkot, Gujarat',
    period: 'May 2026 — Present',
    current: true,
    stage: 'deploy',
    points: [
      'Lead a team of 3 DevOps engineers: plan and assign work, review infrastructure and pipeline changes.',
      'Built a central observability stack (Prometheus, Grafana, Loki, Tempo, Alloy) covering metrics, logs and traces for Ubuntu and Windows Server hosts.',
      'Reworked CI/CD for higher availability and faster deploys; run Docker and Kubernetes workloads across mixed-OS AWS and hybrid estates.',
      'Python tooling to migrate and sync Jira with self-hosted OpenProject; built a Jira analytics app and set up Backstage as the developer portal.',
    ],
    stack: ['Prometheus', 'Grafana', 'Loki', 'Tempo', 'Alloy', 'Kubernetes', 'Backstage', 'Python'],
  },
  {
    company: 'Pedals Up',
    role: 'DevOps Engineer',
    place: 'Ahmedabad, Gujarat',
    period: 'Aug 2025 — Apr 2026',
    stage: 'test',
    points: [
      'Deployed and operated a Thorchain validator node on AWS EKS using StatefulSets, Persistent Volumes and Helm. The node went live on mainnet.',
      'Owned the cluster lifecycle for high availability: upgrades, scaling, secrets and incident response.',
      'Set up CI/CD pipelines with Prometheus and Grafana alerting.',
    ],
    stack: ['AWS EKS', 'Helm', 'StatefulSets', 'Thorchain', 'Prometheus'],
  },
  {
    company: 'Evolution Infosystem',
    role: 'DevOps Engineer (Dedicated)',
    place: 'Rajkot, Gujarat',
    period: 'Apr 2025 — Aug 2025',
    stage: 'build',
    points: [
      'Sole DevOps owner for the company SaaS products: cloud infrastructure, CI/CD and deployments end to end.',
      'Deployed Prometheus and Grafana with Node Exporter and alert rules.',
      'Configured NGINX reverse proxy, Certbot SSL and a bastion host. Migrated a financial app from servers to Kubernetes.',
    ],
    stack: ['Kubernetes', 'NGINX', 'Certbot', 'Node Exporter', 'Grafana'],
  },
  {
    company: 'Wings Tech Solutions',
    role: 'DevOps Engineer',
    place: 'Rajkot, Gujarat',
    period: 'May 2024 — Mar 2025',
    stage: 'commit',
    points: [
      'Sole DevOps owner for cTrunk (courier management) and Vani (studio SaaS) on Hetzner Cloud.',
      'Led the move from on-prem to cloud, containerised both with Docker and ran them on Kubernetes at 99%+ uptime with auto-healing and rolling deploys.',
      'Managed infrastructure and Jenkins CI/CD for RRB Ahmedabad (Government of India), Captain Tractors and Brooon across AWS and DigitalOcean.',
    ],
    stack: ['Hetzner', 'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'DigitalOcean'],
  },
];

export type Project = {
  title: string;
  client: string;
  kind: string;
  blurb: string;
  impact: string;
  tags: string[];
  image?: string;
  accent: string;
};

export const projects: Project[] = [
  {
    title: 'Thorchain Validator on EKS',
    client: 'Pedals Up',
    kind: 'Blockchain infra',
    blurb: 'A live mainnet validator node on AWS EKS built from StatefulSets, Persistent Volumes and Helm charts, with alerting wired into Prometheus and Grafana.',
    impact: 'Live on mainnet',
    tags: ['AWS EKS', 'Helm', 'StatefulSets', 'Grafana'],
    accent: '#7cf7d4',
  },
  {
    title: 'Unified Observability Platform',
    client: 'Multiicon',
    kind: 'Observability',
    blurb: 'Metrics, logs and traces for Linux and Windows Server hosts in one place. Prometheus, Loki and Tempo behind Grafana, with Alloy as the collector.',
    impact: 'Full-stack telemetry',
    tags: ['Prometheus', 'Loki', 'Tempo', 'Alloy'],
    accent: '#ff8a3d',
  },
  {
    title: 'cTrunk: Courier Management',
    client: 'Wings Tech',
    kind: 'Cloud migration',
    blurb: 'Moved from on-prem to Hetzner Cloud, containerised with Docker and run on Kubernetes with auto-healing and rolling deploys. Custom mail flow on AWS SES.',
    impact: '99%+ uptime',
    tags: ['Hetzner', 'Kubernetes', 'Docker', 'AWS SES'],
    image: '/thumbnails/ctrunk-courier.jpg',
    accent: '#5b8cff',
  },
  {
    title: 'RRB Ahmedabad',
    client: 'Government of India',
    kind: 'CI/CD',
    blurb: 'A code pipeline for frequent, automatic and secure deployments to government servers.',
    impact: 'Automated gov deploys',
    tags: ['Jenkins', 'CI/CD', 'Linux', 'Security'],
    image: '/thumbnails/rrb-train.jpg',
    accent: '#ffd23d',
  },
  {
    title: 'Brooon Real Estate',
    client: 'Wings Tech',
    kind: 'Platform ops',
    blurb: 'Dockerised the web and mobile backends, managed staging and production servers and monitoring, built CI/CD for both and handled live production issues.',
    impact: 'Web + app shipped',
    tags: ['Docker', 'DigitalOcean', 'CI/CD', 'Monitoring'],
    image: '/thumbnails/brooon-realestate.jpg',
    accent: '#c084fc',
  },
  {
    title: 'TheEMIClub Money',
    client: 'Evolution Infosystem',
    kind: 'K8s migration',
    blurb: 'Set up staging for a financial app and migrated production from plain servers to Kubernetes for better scalability and reliability.',
    impact: 'Servers → Kubernetes',
    tags: ['Kubernetes', 'NGINX', 'Certbot', 'Bastion'],
    image: '/thumbnails/theemiclub-money.jpg',
    accent: '#3dffa0',
  },
  {
    title: 'Captain Tractors',
    client: 'Wings Tech',
    kind: 'CI/CD',
    blurb: 'Staging and production deployments with CI/CD pipelines for a manufacturer and exporter of compact tractors.',
    impact: 'Staging + prod pipelines',
    tags: ['Jenkins', 'AWS', 'Staging', 'Prod'],
    image: '/thumbnails/captain-tractor.jpg',
    accent: '#ff5c7a',
  },
  {
    title: 'Jira → OpenProject Sync',
    client: 'Multiicon',
    kind: 'Automation',
    blurb: 'Python scripts that migrate data from Jira to self-hosted OpenProject and keep both in sync over their APIs. Plus a Jira analytics app, ready for open source.',
    impact: 'Cut manual admin work',
    tags: ['Python', 'REST APIs', 'OpenProject', 'Backstage'],
    accent: '#3de0ff',
  },
];

export const skillGroups = [
  { title: 'Cloud', code: 'cloud', items: ['AWS EC2', 'S3', 'VPC', 'EKS', 'GCP', 'Azure', 'Hetzner Cloud', 'DigitalOcean'] },
  { title: 'Containers', code: 'k8s', items: ['Kubernetes', 'Docker', 'Podman', 'Helm', 'ArgoCD'] },
  { title: 'IaC & CI/CD', code: 'pipeline', items: ['Terraform', 'Ansible', 'CloudFormation', 'GitHub Actions', 'GitLab CI', 'Jenkins'] },
  { title: 'Observability', code: 'o11y', items: ['Prometheus', 'Grafana', 'Loki', 'Tempo', 'Alloy', 'Node Exporter', 'Alerting'] },
  { title: 'Systems', code: 'sys', items: ['Ubuntu Linux', 'Windows Server', 'NGINX', 'Git', 'Backstage', 'MongoDB', 'Redis'] },
  { title: 'Code', code: 'lang', items: ['Python', 'Shell', 'YAML', 'HCL'] },
];

export const marqueeTech = [
  'KUBERNETES', 'TERRAFORM', 'AWS', 'PROMETHEUS', 'GRAFANA', 'DOCKER', 'HELM', 'ARGOCD',
  'ANSIBLE', 'JENKINS', 'GITHUB ACTIONS', 'LOKI', 'TEMPO', 'NGINX', 'HETZNER', 'GCP', 'AZURE', 'LINUX',
];

export const certification = {
  name: 'AWS Certified Cloud Practitioner',
  issuer: 'Amazon Web Services',
  issued: 'Mar 2023',
  expires: 'Mar 2026',
  code: 'MT19KE5KR11QQKKW',
  verify: 'https://aws.amazon.com/verification',
};

export const achievements = [
  { title: 'Guinness World Record', detail: 'Participant in the IIT Madras × GUVI 24-hour programming-teaching record.', tag: 'Record' },
  { title: 'Ideathon Winner', detail: 'Won the ideathon with a Zebra energy innovation.', tag: 'Winner' },
  { title: 'Published Researcher', detail: '“Third Eye”: IoT intrusion detection, presented at ICRACSIT.', tag: 'Research' },
  { title: 'Built an IoT Device', detail: 'Designed and built the Third Eye hardware prototype.', tag: 'Hardware' },
];

export const education = [
  { degree: 'Master of Computer Applications (MCA)', school: 'The Oxford College of Engineering, Bangalore', period: '2021 — 2023', note: 'CGPA 8.0 / 10' },
  { degree: 'Bachelor’s Degree', school: 'Atmiya Institute of Technology & Science, Rajkot', period: '2019', note: '' },
];

export const languages = ['English', 'Hindi', 'Gujarati'];

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
];
