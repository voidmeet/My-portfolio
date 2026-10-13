"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useInView } from "framer-motion";
import { useScrollTo } from "@/components/scroll/SmoothScroll";
import { contactRelayConfigured, EMAIL_PATTERN, sendContactMessage, type ContactPayload } from "@/lib/contact";
import { profile } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  ALIASES,
  COMMANDS,
  COMPLETIONS,
  line,
  seg,
  tokenize,
  type Output,
  type Segment,
  type TerminalContext,
  type Tone,
} from "./terminal-commands";

type Step = "name" | "email" | "message";

interface Wizard {
  queue: Step[];
  data: Partial<ContactPayload>;
  sudo: boolean;
}

interface TermLine {
  id: number;
  segments: Segment[];
}

const TONES: Record<Tone, string> = {
  default: "text-white/75",
  muted: "text-white/45",
  dim: "text-white/30",
  white: "text-white",
  blue: "text-neon-blue",
  purple: "text-neon-purple",
  green: "text-neon-green",
  red: "text-rose-400",
  amber: "text-amber-300",
};

const PROMPTS: Record<Step, string> = {
  name: "your name (optional)",
  email: "your email",
  message: "message",
};

const MAX_LINES = 400;
const EXAMPLE = `sudo contact --email you@company.com --msg "Let's work together"`;

const QUICK = [
  { label: "help", run: "help" },
  { label: "about", run: "about" },
  { label: "skills", run: "skills" },
  { label: "git log", run: "git log" },
  { label: "neofetch", run: "neofetch" },
  { label: "contact", run: "contact" },
] as const;

const bar = (pct: number) => {
  const filled = Math.round(pct / 10);
  return line(
    seg("→ ", "blue"),
    seg("transmitting payload ", "muted"),
    seg(`[${"█".repeat(filled)}${"░".repeat(10 - filled)}]`, pct >= 100 ? "green" : "blue"),
    seg(` ${String(pct).padStart(3)}%`, "muted"),
  );
};

const loginStamp = () =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(new Date())
    .replace(/,/g, "");

/**
 * A working shell in the footer: history, tab-completion, ctrl+c / ctrl+l,
 * an interactive contact wizard, and `sudo contact --email … --msg …` that
 * actually delivers the message.
 */
export function Terminal({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const inputEl = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const inView = useInView(root, { once: true, margin: "-15% 0px" });
  const scrollTo = useScrollTo();

  const [lines, setLines] = useState<TermLine[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(true);
  const [wizard, setWizard] = useState<Wizard | null>(null);

  const wait = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(() => {
          timers.current.delete(t);
          resolve();
        }, ms);
        timers.current.add(t);
      }),
    [],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const print = useCallback((...outputs: Output[]) => {
    const fresh = outputs.map((segments) => ({ id: nextId.current++, segments }));
    setLines((prev) => [...prev, ...fresh].slice(-MAX_LINES));
    return fresh.at(-1)?.id ?? -1;
  }, []);

  const replace = useCallback((id: number, segments: Output) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, segments } : l)));
  }, []);

  const focusInput = useCallback(() => {
    requestAnimationFrame(() => inputEl.current?.focus({ preventScroll: true }));
  }, []);

  // keep the newest output in view
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, wizard, busy]);

  // boot sequence the first time the terminal scrolls into view
  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const boot: Output[] = [
      line(seg(`Last login: ${loginStamp()} on ttys001`, "dim")),
      line(seg("MeetOS 2.5 LTS", "white"), seg(" (GNU/Linux 6.8 x86_64) — ", "muted"), seg("connection established", "green")),
      line(seg("")),
      line(seg("[  OK  ] ", "green"), seg("Mounted /home/meet/portfolio", "muted")),
      line(seg("[  OK  ] ", "green"), seg("Started contact-relay.service", "muted")),
      line(seg("[  OK  ] ", "green"), seg("Reached target collaboration.target", "muted")),
      line(seg("")),
      line(seg("Welcome, guest. Type ", "muted"), seg("help", "green"), seg(" to explore, or open a channel:", "muted")),
      line(seg(`  ${EXAMPLE}`, "blue")),
      line(seg("")),
    ];
    (async () => {
      for (const out of boot) {
        await wait(110);
        if (cancelled) return;
        print(out);
      }
      setBusy(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [inView, print, wait]);

  const send = useCallback(
    async (payload: ContactPayload, sudo: boolean) => {
      setBusy(true);
      if (sudo) {
        print(line(seg("[sudo] password for guest: ", "muted"), seg("••••••••", "dim")));
        await wait(500);
        print(line(seg("sudo: privileges granted for contact-relay", "green")));
      }

      if (contactRelayConfigured) {
        print(line(seg("→ ", "blue"), seg("opening secure channel to mail relay …", "muted"), seg(" ok", "green")));
        await wait(380);
        const progress = print(bar(0));
        const delivery = sendContactMessage(payload);
        for (let p = 10; p <= 90; p += 10) {
          await wait(65);
          replace(progress, bar(p));
        }
        const result = await delivery;
        if (result.ok) {
          replace(progress, bar(100));
          print(
            line(seg("✓ 250 OK ", "green"), seg("— message delivered. Thanks", "white"), seg(payload.name ? `, ${payload.name}` : "", "white"), seg("! I'll get back to you soon.", "white")),
          );
        } else {
          print(
            line(seg(`✗ relay error: ${result.error}`, "red")),
            line(seg("  fallback: ", "muted"), seg(profile.email, "blue", `mailto:${profile.email}`)),
          );
        }
      } else {
        print(line(seg("→ ", "blue"), seg("handing off to your mail client with a pre-filled draft …", "muted")));
        await wait(500);
        await sendContactMessage(payload);
        print(
          line(seg("✓ draft ready ", "green"), seg("— hit send in your mail app to deliver it.", "white")),
          line(seg("  or write directly: ", "muted"), seg(profile.email, "blue", `mailto:${profile.email}`)),
        );
      }
      print(line(seg("")));
      setBusy(false);
      focusInput();
    },
    [print, replace, wait, focusInput],
  );

  const startContact = useCallback(
    (partial: Partial<ContactPayload>, { sudo }: { sudo: boolean }) => {
      const data: Partial<ContactPayload> = { ...partial };
      if (data.email && !EMAIL_PATTERN.test(data.email)) {
        print(line(seg(`contact: '${data.email}' doesn't look like an email address`, "red")));
        delete data.email;
      }
      if (data.message !== undefined && !data.message.trim()) delete data.message;

      const interactive = !partial.email && !partial.message && !partial.name;
      const queue: Step[] = interactive
        ? ["name", "email", "message"]
        : (["email", "message"] as Step[]).filter((step) => !data[step]);

      if (!queue.length) {
        void send(data as ContactPayload, sudo);
        return;
      }
      if (interactive) print(line(seg("Opening an interactive channel — ", "muted"), seg("ctrl+c", "amber"), seg(" to cancel.", "muted")));
      setWizard({ queue, data, sudo });
    },
    [print, send, setWizard],
  );

  const context = useMemo<TerminalContext>(
    () => ({
      print: (...outs) => void print(...outs),
      clear: () => setLines([]),
      contact: startContact,
      navigate: (id) => scrollTo(`#${id}`),
      history: () => history.current,
    }),
    [print, startContact, scrollTo],
  );

  const promptSegments = (): Segment[] => [seg("guest", "green"), seg("@meetbundela", "green"), seg(":", "muted"), seg("~", "blue"), seg("$ ", "white")];

  const run = (raw: string) => {
    const tokens = tokenize(raw.trim());
    if (!tokens.length) return;
    const [name, ...args] = tokens;
    const command = COMMANDS[name] ?? COMMANDS[ALIASES[name] ?? ""];
    if (!command) {
      print(line(seg(`zsh: command not found: ${name}`, "red")), line(seg("try ", "muted"), seg("help", "green")));
      return;
    }
    command.run(args, context);
  };

  const answer = (value: string) => {
    if (!wizard) return;
    const [step, ...rest] = wizard.queue;
    const trimmed = value.trim();
    print(line(seg(`? ${PROMPTS[step]} › `, "amber"), seg(trimmed || "—", "white")));

    if (step === "email" && !EMAIL_PATTERN.test(trimmed)) {
      print(line(seg("  that doesn't look like an email address — try again", "red")));
      return;
    }
    if (step === "message" && !trimmed) {
      print(line(seg("  a message can't be empty", "red")));
      return;
    }

    const data = { ...wizard.data, [step]: trimmed };
    if (rest.length) {
      setWizard({ ...wizard, queue: rest, data });
    } else {
      setWizard(null);
      void send(data as ContactPayload, wizard.sudo);
    }
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (busy) return;
    const value = input;
    setInput("");
    if (wizard) return answer(value);

    print([...promptSegments(), seg(value, "white")]);
    if (!value.trim()) return;
    history.current = [...history.current.filter((h) => h !== value), value].slice(-50);
    cursor.current = history.current.length;
    run(value);
  };

  const execute = (command: string) => {
    if (busy) return;
    if (wizard) {
      print(line(seg("^C", "amber")));
      setWizard(null);
    }
    print([...promptSegments(), seg(command, "white")]);
    history.current = [...history.current.filter((h) => h !== command), command].slice(-50);
    cursor.current = history.current.length;
    run(command);
    focusInput();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      if (window.getSelection()?.toString()) return; // allow copying
      e.preventDefault();
      print(line(...(wizard ? [] : promptSegments()), seg(input), seg("^C", "amber")));
      setWizard(null);
      setInput("");
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
      return;
    }
    if (wizard) return;

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      if (!h.length) return;
      cursor.current = Math.max(0, Math.min(h.length, cursor.current + (e.key === "ArrowUp" ? -1 : 1)));
      setInput(h[cursor.current] ?? "");
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const value = input.trimStart();
      if (!value || value.includes(" ")) return;
      const matches = COMPLETIONS.filter((c) => c.startsWith(value));
      if (matches.length === 1) setInput(`${matches[0]} `);
      else if (matches.length > 1) print([...promptSegments(), seg(value, "white")], line(seg(matches.join("  "), "muted")));
    }
  };

  const step = wizard?.queue[0];

  return (
    <div
      ref={root}
      onClick={() => {
        if (!window.getSelection()?.toString()) inputEl.current?.focus({ preventScroll: true });
      }}
      className={cn(
        "glass-panel group/term overflow-hidden rounded-2xl transition-[border-color,box-shadow] duration-500 focus-within:border-neon-green/30 focus-within:shadow-[0_0_80px_-40px_rgb(57_255_136/0.6)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]/90" />
        <span className="size-3 rounded-full bg-[#febc2e]/90" />
        <span className="size-3 rounded-full bg-[#28c840]/90" />
        <p className="mx-auto truncate px-2 font-mono text-[11px] text-white/40">guest@meetbundela: ~ — zsh — 80×24</p>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-neon-green/80">
          <span className="size-1.5 animate-pulse rounded-full bg-neon-green" /> ssh
        </span>
      </div>

      <div
        ref={scroller}
        data-lenis-prevent
        className="h-[min(440px,56svh)] overflow-y-auto overscroll-contain px-4 py-4 font-mono text-[12.5px] leading-[1.7] sm:px-5"
      >
        <div role="log" aria-live="polite" aria-label="Terminal output">
          {lines.map((l) => (
            <p key={l.id} className="min-h-[1.7em] whitespace-pre-wrap break-words">
              {l.segments.map((s, i) =>
                s.href ? (
                  <a
                    key={i}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={cn(TONES[s.tone ?? "default"], "underline decoration-dotted underline-offset-4 hover:text-white")}
                  >
                    {s.text}
                  </a>
                ) : (
                  <span key={i} className={TONES[s.tone ?? "default"]}>
                    {s.text}
                  </span>
                ),
              )}
            </p>
          ))}
        </div>

        {busy ? (
          <p className="mt-0.5 text-white/40">
            <span className="inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] animate-blink bg-neon-green/70" />
          </p>
        ) : (
          <form onSubmit={submit} className="flex items-baseline gap-0">
            <label htmlFor="terminal-input" className="shrink-0 whitespace-pre">
              {step ? (
                <span className="text-amber-300">? {PROMPTS[step]} › </span>
              ) : (
                promptSegments().map((s, i) => (
                  <span key={i} className={TONES[s.tone ?? "default"]}>
                    {s.text}
                  </span>
                ))
              )}
            </label>
            <input
              ref={inputEl}
              id="terminal-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              aria-label={step ? PROMPTS[step] : "Terminal command"}
              className="min-w-0 flex-1 bg-transparent text-[16px] text-white caret-neon-green outline-none placeholder:text-white/20 focus-visible:outline-none sm:text-[12.5px]"
              placeholder={step ? "" : "type a command…"}
            />
          </form>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] bg-white/[0.015] px-4 py-3">
        <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">quick</span>
        {QUICK.map((q) => (
          <button
            key={q.label}
            type="button"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              execute(q.run);
            }}
            className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-white/60 transition-colors hover:border-neon-green/40 hover:text-neon-green disabled:opacity-40"
          >
            {q.label}
          </button>
        ))}
        <button
          type="button"
          disabled={busy}
          onClick={(e) => {
            e.stopPropagation();
            setWizard(null);
            setInput(EXAMPLE);
            focusInput();
          }}
          className="rounded-md border border-neon-blue/25 bg-neon-blue/[0.06] px-2.5 py-1 font-mono text-[11px] text-neon-blue/90 transition-colors hover:border-neon-blue/60 disabled:opacity-40"
        >
          sudo contact …
        </button>
      </div>
    </div>
  );
}
