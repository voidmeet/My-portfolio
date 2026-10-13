import { credentials, profile, roles, stack, toolchain } from "@/lib/data";
import type { ContactPayload } from "@/lib/contact";

export type Tone = "default" | "muted" | "dim" | "white" | "blue" | "purple" | "green" | "red" | "amber";

export interface Segment {
  text: string;
  tone?: Tone;
  href?: string;
}

export type Output = Segment[];

export interface TerminalContext {
  print: (...lines: Output[]) => void;
  clear: () => void;
  /** Starts the contact flow; prompts interactively for anything missing. */
  contact: (partial: Partial<ContactPayload>, opts: { sudo: boolean }) => void;
  navigate: (sectionId: string) => void;
  history: () => string[];
}

interface Command {
  description: string;
  usage?: string;
  hidden?: boolean;
  run: (args: string[], ctx: TerminalContext) => void;
}

/* ---------- output helpers ---------- */

export const seg = (text: string, tone: Tone = "default", href?: string): Segment => ({ text, tone, href });
export const line = (...segments: (Segment | string)[]): Output =>
  segments.map((s) => (typeof s === "string" ? seg(s) : s));
const blank = (): Output => [seg("")];

/* ---------- parsing ---------- */

/** Shell-ish tokenizer: respects single/double quotes, e.g. --msg "Let's work together". */
export function tokenize(input: string): string[] {
  const tokens: string[] = [];
  const pattern = /"([^"]*)"|'([^']*)'|“([^”]*)”|(\S+)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(input))) tokens.push(match[1] ?? match[2] ?? match[3] ?? match[4]);
  return tokens;
}

const FLAG_ALIASES: Record<string, keyof ContactPayload> = {
  "--email": "email",
  "-e": "email",
  "--msg": "message",
  "--message": "message",
  "-m": "message",
  "--name": "name",
  "-n": "name",
};

export function parseContactFlags(args: string[]) {
  const payload: Partial<ContactPayload> = {};
  const unknown: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const [flag, inline] = args[i].split(/=([\s\S]*)/, 2);
    const key = FLAG_ALIASES[flag];
    if (!key) {
      unknown.push(args[i]);
      continue;
    }
    const value = inline ?? args[++i];
    if (value !== undefined) payload[key] = value;
  }
  return { payload, unknown };
}

/* ---------- content ---------- */

const SECTIONS: Record<string, string> = {
  "~": "top",
  home: "top",
  top: "top",
  stack: "stack",
  skills: "stack",
  pipeline: "pipeline",
  experience: "pipeline",
  contact: "contact",
};

function about(ctx: TerminalContext) {
  ctx.print(
    line(seg("# about.md", "purple")),
    line(seg(profile.name, "white"), seg(` — ${profile.role}, ${profile.location}`, "muted")),
    blank(),
    line(seg(profile.summary)),
    blank(),
    ...credentials.achievements.map((a) => line(seg("  ★ ", "amber"), seg(a, "muted"))),
  );
}

function skills(ctx: TerminalContext) {
  ctx.print(line(seg("NAMESPACE         SERVICES", "dim")));
  for (const c of stack) {
    ctx.print(line(seg(c.namespace.padEnd(18), "blue"), seg(c.skills.map((s) => s.name).join(", "), "white")));
  }
  ctx.print(line(seg("ns/toolchain".padEnd(18), "blue"), seg(toolchain.join(", "), "muted")));
}

function gitLog(ctx: TerminalContext) {
  for (const r of roles) {
    ctx.print(
      line(
        seg("* ", "purple"),
        seg(r.hash, "amber"),
        seg(" "),
        ...("ref" in r ? [seg(`(${r.ref}) `, "green")] : []),
        seg(`${r.title} @ ${r.org}`, "white"),
      ),
      line(seg(`│   ${r.period} · ${r.place} — ${r.note}`, "muted")),
    );
  }
}

const NEOFETCH_LOGO = [
  "   ╔══════════╗  ",
  "   ║ ▓▓▓▓▓▓▓▓ ║  ",
  "   ║ ▓▓ MB ▓▓ ║  ",
  "   ║ ▓▓▓▓▓▓▓▓ ║  ",
  "   ╚══╤════╤══╝  ",
  "   ═══╧════╧═══  ",
  "                 ",
  "                 ",
];

function neofetch(ctx: TerminalContext) {
  const info: [string, string][] = [
    ["", "guest@meetbundela"],
    ["", "─────────────────"],
    ["OS", "MeetOS 2.5 LTS x86_64"],
    ["Host", "Rajkot, Gujarat, IN"],
    ["Uptime", "2.5+ years in production"],
    ["Clouds", "AWS · GCP · Azure · Hetzner · DO"],
    ["Orchestr.", "Kubernetes · Helm · ArgoCD"],
    ["Telemetry", "Prometheus · Grafana · Loki · Tempo · Alloy"],
  ];
  info.forEach(([k, v], i) => {
    ctx.print(
      line(
        seg(NEOFETCH_LOGO[i] ?? "".padEnd(17), i % 2 ? "purple" : "blue"),
        ...(k ? [seg(`${k}: `, "green"), seg(v, "white")] : [seg(v, i === 0 ? "white" : "dim")]),
      ),
    );
  });
}

/* ---------- registry ---------- */

export const COMMANDS: Record<string, Command> = {
  help: {
    description: "list available commands",
    run: (_, ctx) => {
      ctx.print(line(seg("Available commands:", "white")));
      for (const [name, cmd] of Object.entries(COMMANDS)) {
        if (cmd.hidden) continue;
        ctx.print(line(seg(`  ${(cmd.usage ?? name).padEnd(22)}`, "green"), seg(cmd.description, "muted")));
      }
      ctx.print(
        blank(),
        line(seg("tip: ", "dim"), seg('sudo contact --email you@company.com --msg "Let\'s work together"', "blue")),
      );
    },
  },
  about: { description: "who is Meet?", run: (_, ctx) => about(ctx) },
  skills: { description: "the stack, by namespace", run: (_, ctx) => skills(ctx) },
  experience: { description: "deploy history (alias: git log)", run: (_, ctx) => gitLog(ctx) },
  contact: {
    description: "send Meet a message",
    usage: "contact [--email --msg]",
    run: (args, ctx) => {
      const { payload, unknown } = parseContactFlags(args);
      if (unknown.length) ctx.print(line(seg(`contact: ignoring unknown argument(s): ${unknown.join(" ")}`, "amber")));
      ctx.contact(payload, { sudo: false });
    },
  },
  socials: {
    description: "links: LinkedIn, GitHub, email",
    run: (_, ctx) =>
      ctx.print(
        line(seg("linkedin  ", "dim"), seg(profile.linkedin.replace("https://www.", ""), "blue", profile.linkedin)),
        line(seg("github    ", "dim"), seg(profile.github.replace("https://", ""), "blue", profile.github)),
        line(seg("email     ", "dim"), seg(profile.email, "blue", `mailto:${profile.email}`)),
        line(seg("web       ", "dim"), seg(profile.website.replace("https://", ""), "blue", profile.website)),
      ),
  },
  neofetch: { description: "system information", run: (_, ctx) => neofetch(ctx) },
  cd: {
    description: "jump to a section (stack, pipeline, ~)",
    usage: "cd <section>",
    run: (args, ctx) => {
      const target = SECTIONS[(args[0] ?? "~").replace(/^\/+|\/+$/g, "")];
      if (!target) return ctx.print(line(seg(`cd: no such section: ${args[0]}`, "red")));
      ctx.navigate(target);
      ctx.print(line(seg(`→ navigating to /${target === "top" ? "" : target}`, "muted")));
    },
  },
  clear: { description: "clear the screen (ctrl+l)", run: (_, ctx) => ctx.clear() },

  // ---- hidden / easter eggs ----
  whoami: { description: "", hidden: true, run: (_, ctx) => ctx.print(line(seg("guest", "white"), seg("  — but you're probably looking for `about`", "muted"))) },
  ls: {
    description: "",
    hidden: true,
    run: (args, ctx) => {
      if (args[0]?.startsWith("skills")) return skills(ctx);
      ctx.print(line(seg("about.md  ", "white"), seg("skills/  ", "blue"), seg("experience.log  ", "white"), seg("contact.sh", "green")));
    },
  },
  cat: {
    description: "",
    hidden: true,
    run: (args, ctx) => {
      const file = args[0] ?? "";
      if (file.startsWith("about")) return about(ctx);
      if (file.startsWith("experience")) return gitLog(ctx);
      if (file.startsWith("contact")) return ctx.print(line(seg("#!/bin/sh", "muted")), line(seg('exec contact "$@"', "muted")));
      ctx.print(line(seg(`cat: ${file || "(missing operand)"}: No such file or directory`, "red")));
    },
  },
  "./contact.sh": { description: "", hidden: true, run: (args, ctx) => COMMANDS.contact.run(args, ctx) },
  git: {
    description: "",
    hidden: true,
    run: (args, ctx) => {
      if (args[0] === "log") return gitLog(ctx);
      if (args[0] === "status") return ctx.print(line(seg("On branch main — nothing to commit, working tree clean", "muted")));
      ctx.print(line(seg(`git: '${args[0] ?? ""}' is not a git command here. Try 'git log'.`, "amber")));
    },
  },
  kubectl: {
    description: "",
    hidden: true,
    run: (args, ctx) => {
      if (args.join(" ").startsWith("get pod")) {
        ctx.print(
          line(seg("NAME                         READY   STATUS    RESTARTS   AGE", "dim")),
          line(seg("portfolio-web-7d9f8c6b5-x2kq   1/1     ", "white"), seg("Running", "green"), seg("   0          2y", "white")),
          line(seg("contact-relay-5c4b2d9f-m8zt    1/1     ", "white"), seg("Running", "green"), seg("   0          2y", "white")),
          line(seg("coffee-daemon-0                1/1     ", "white"), seg("Running", "green"), seg("   ∞          2y", "white")),
        );
        return;
      }
      ctx.print(line(seg("kubectl: try `kubectl get pods`", "amber")));
    },
  },
  ping: {
    description: "",
    hidden: true,
    run: (args, ctx) =>
      ctx.print(line(seg(`64 bytes from ${args[0] ?? "meet.bundela"}: icmp_seq=1 ttl=64 time=0.42 ms — host is up`, "green"))),
  },
  date: { description: "", hidden: true, run: (_, ctx) => ctx.print(line(seg(new Date().toString(), "white"))) },
  echo: { description: "", hidden: true, run: (args, ctx) => ctx.print(line(seg(args.join(" "), "white"))) },
  history: {
    description: "",
    hidden: true,
    run: (_, ctx) => ctx.history().forEach((h, i) => ctx.print(line(seg(String(i + 1).padStart(4) + "  ", "dim"), seg(h, "white")))),
  },
  sudo: {
    description: "",
    hidden: true,
    run: (args, ctx) => {
      if (args[0] === "contact") {
        const { payload, unknown } = parseContactFlags(args.slice(1));
        if (unknown.length) ctx.print(line(seg(`contact: ignoring unknown argument(s): ${unknown.join(" ")}`, "amber")));
        return ctx.contact(payload, { sudo: true });
      }
      if (args[0] === "rm") return COMMANDS.rm.run(args.slice(1), ctx);
      ctx.print(line(seg("guest is not in the sudoers file. This incident will be reported. ", "red"), seg("(except for `sudo contact`)", "muted")));
    },
  },
  rm: {
    description: "",
    hidden: true,
    run: (_, ctx) => ctx.print(line(seg("rm: permission denied — this cluster has backups, and opinions.", "red"))),
  },
  exit: {
    description: "",
    hidden: true,
    run: (_, ctx) => ctx.print(line(seg("logout… just kidding. There is no escape from the pipeline.", "muted"))),
  },
};

export const ALIASES: Record<string, string> = {
  "?": "help",
  man: "help",
  bio: "about",
  stack: "skills",
  log: "experience",
  links: "socials",
  social: "socials",
  email: "socials",
  mail: "contact",
  cls: "clear",
};

export const COMPLETIONS = [...Object.keys(COMMANDS), ...Object.keys(ALIASES)].sort();
