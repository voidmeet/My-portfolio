import { useEffect, useRef, useState, type ReactNode } from 'react';
import { experience, experienceYears, profile, projects, skillGroups, socials } from '@/data/portfolio';
import { scrollToId } from '@/lib/scroll';

type Line = { kind: 'in' | 'out' | 'err' | 'ok'; text: ReactNode };

const HELP = [
  ['whoami', 'who is this guy'],
  ['skills', 'print the toolchain'],
  ['experience', 'git log --career'],
  ['projects', 'list deployments'],
  ['contact', 'open a channel'],
  ['cv', 'download the resume'],
  ['goto <section>', 'about · experience · work · stack · contact'],
  ['clear', 'wipe the screen'],
];

function run(raw: string): Line[] | 'clear' {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  const arg = args.join(' ');
  switch ((cmd || '').toLowerCase()) {
    case '':
      return [];
    case 'help':
    case 'ls':
      return HELP.map(([c, d]) => ({ kind: 'out', text: <span><span className="text-[var(--cyan)]">{c.padEnd(18, ' ')}</span><span className="text-white/45">{d}</span></span> }));
    case 'whoami':
      return [
        { kind: 'ok', text: `${profile.name} · ${profile.role}` },
        { kind: 'out', text: `${experienceYears()}+ years · leads 3 engineers @ Multiicon · ${profile.location}` },
      ];
    case 'skills':
    case 'stack':
      return skillGroups.map((g) => ({ kind: 'out', text: <span><span className="text-[var(--lime)]">[{g.code}]</span> {g.items.join(', ')}</span> }));
    case 'experience':
    case 'git':
      return experience.map((e) => ({ kind: 'out', text: <span><span className="text-[#ffd23d]">{e.period.padEnd(20, ' ')}</span>{e.company} <span className="text-white/40">· {e.role}</span></span> }));
    case 'projects':
    case 'kubectl':
      return [
        { kind: 'out', text: <span className="text-white/40">NAME{' '.repeat(32)}STATUS</span> },
        ...projects.map((p) => ({ kind: 'out' as const, text: <span>{p.title.padEnd(36, ' ').slice(0, 36)}<span className="text-[var(--lime)]">{p.impact}</span></span> })),
      ];
    case 'contact':
      return socials.map((s) => ({ kind: 'out', text: <a className="underline decoration-white/20 hover:text-[var(--lime)]" href={s.url} target="_blank" rel="noreferrer">{s.name.padEnd(10, ' ')} {s.handle}</a> }));
    case 'cv':
    case 'resume':
      window.open(profile.resume, '_blank');
      return [{ kind: 'ok', text: 'opening Meet_Bundela_CV.pdf …' }];
    case 'goto':
    case 'cd': {
      const map: Record<string, string> = { about: 'about', experience: 'experience', work: 'work', projects: 'work', stack: 'stack', skills: 'stack', contact: 'contact', home: 'top', '~': 'top' };
      const id = map[arg.toLowerCase()];
      if (!id) return [{ kind: 'err', text: `goto: no such section: ${arg || '(empty)'}` }];
      setTimeout(() => scrollToId(id), 150);
      return [{ kind: 'ok', text: `→ ${id}` }];
    }
    case 'sudo':
      if (arg.includes('hire')) {
        setTimeout(() => scrollToId('contact'), 400);
        return [{ kind: 'ok', text: 'permission granted. routing you to the contact form ✦' }];
      }
      return [{ kind: 'err', text: 'meet is not in the sudoers file. try: sudo hire-meet' }];
    case 'uptime':
      return [{ kind: 'ok', text: 'up 99.9%, load average: caffeine, curiosity, kubectl' }];
    case 'date':
      return [{ kind: 'out', text: new Date().toString() }];
    case 'echo':
      return [{ kind: 'out', text: arg }];
    case 'rm':
      return [{ kind: 'err', text: 'nice try. production is protected by RBAC.' }];
    case 'clear':
      return 'clear';
    default:
      return [{ kind: 'err', text: `command not found: ${cmd}. type 'help'` }];
  }
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { kind: 'ok', text: 'meet-os 3.0 · connected to prod (read-only, relax)' },
    { kind: 'out', text: <span>type <span className="text-[var(--cyan)]">help</span> to list commands · try <span className="text-[var(--lime)]">sudo hire-meet</span></span> },
  ]);
  const [value, setValue] = useState('');
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const body = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  const submit = (cmd: string) => {
    const res = run(cmd);
    if (res === 'clear') {
      setLines([]);
    } else {
      setLines((l) => [...l, { kind: 'in', text: cmd }, ...res]);
    }
    if (cmd.trim()) setHist((h) => [cmd, ...h].slice(0, 30));
    setHi(-1);
    setValue('');
  };

  const chips = ['whoami', 'skills', 'experience', 'projects', 'sudo hire-meet'];

  return (
    <div className="card flex h-[480px] flex-col overflow-hidden !p-0 lg:h-[560px]" onClick={() => input.current?.focus({ preventScroll: true })}>
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="font-mono text-[11px] text-white/40">meet@infra: ~/portfolio — zsh</span>
        <span className="w-12" />
      </div>
      <div ref={body} data-lenis-prevent className="flex-1 overflow-y-auto px-4 py-4 font-mono text-[12.5px] leading-6 sm:text-[13px]">
        {lines.map((l, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap break-words ${
              l.kind === 'in' ? 'text-white' : l.kind === 'err' ? 'text-[#ff5c7a]' : l.kind === 'ok' ? 'text-[var(--lime)]' : 'text-white/70'
            }`}
          >
            {l.kind === 'in' && <span className="text-[var(--cyan)]">❯ </span>}
            {l.text}
          </div>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(value);
          }}
          className="flex items-center"
        >
          <span className="text-[var(--cyan)]">❯&nbsp;</span>
          <input
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                const n = Math.min(hist.length - 1, hi + 1);
                if (n >= 0) {
                  setHi(n);
                  setValue(hist[n]);
                }
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const n = hi - 1;
                setHi(Math.max(-1, n));
                setValue(n >= 0 ? hist[n] : '');
              }
            }}
            aria-label="Terminal command"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent text-white caret-[var(--lime)] outline-none"
          />
        </form>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3">
        {chips.map((c) => (
          <button key={c} type="button" onClick={(e) => { e.stopPropagation(); submit(c); }} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/60 transition-colors hover:border-[var(--lime)] hover:text-white">
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
