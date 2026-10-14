import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { profile, socials } from '@/data/portfolio';
import { Magnetic, RevealText, SectionTag } from '@/components/fx';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

    // No EmailJS config: fall back to the visitor's mail client.
    if (!serviceId || !templateId || !publicKey) {
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Hello from ${form.name}`)}&body=${body}`;
      return;
    }
    setStatus('sending');
    try {
      await emailjs.send(
        serviceId,
        templateId,
        { from_name: form.name, reply_to: form.email, from_email: form.email, message: form.message, to_email: profile.email },
        { publicKey },
      );
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" data-scene="5" className="relative z-10 px-4 pb-16 pt-28 sm:px-6 sm:pt-40">
      <div className="mx-auto max-w-7xl">
        <SectionTag index="06" label="Contact / Open a channel" />
        <RevealText text="Let’s build something that stays up." className="max-w-5xl font-display text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.9] tracking-[-0.04em]" />

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <form onSubmit={submit} className="card space-y-6 p-6 sm:p-8 lg:col-span-7">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="field">
                <span>Name / Organization</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane from Acme" />
              </label>
              <label className="field">
                <span>Email</span>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@acme.com" />
              </label>
            </div>
            <label className="field">
              <span>Message</span>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="We need someone to own our Kubernetes platform…" />
            </label>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
                {status === 'sent' && <span className="text-[var(--lime)]">✓ message delivered, I’ll reply soon</span>}
                {status === 'error' && <span className="text-[#ff5c7a]">✕ failed, email me directly</span>}
                {status === 'idle' && 'Usually replies within a day'}
                {status === 'sending' && 'transmitting…'}
              </span>
              <Magnetic>
                <button type="submit" disabled={status === 'sending'} className="btn-primary" data-cursor="Send">
                  {status === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden>→</span>
                </button>
              </Magnetic>
            </div>
          </form>

          <div className="flex flex-col lg:col-span-5">
            <a href={`mailto:${profile.email}`} className="group block border-b border-white/10 pb-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Email</div>
              <div className="mt-2 break-all font-display text-2xl font-bold transition-colors group-hover:text-[var(--lime)] sm:text-3xl">{profile.email}</div>
            </a>
            <a href={profile.phoneHref} className="group block border-b border-white/10 py-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Phone</div>
              <div className="mt-2 font-display text-2xl font-bold transition-colors group-hover:text-[var(--lime)] sm:text-3xl">{profile.phone}</div>
            </a>
            <ul className="mt-2">
              {socials
                .filter((s) => s.name !== 'Email')
                .map((s) => (
                  <li key={s.name}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="row-link group flex items-center justify-between border-b border-white/10 py-5">
                      <span className="font-display text-xl font-semibold">{s.name}</span>
                      <span className="flex items-center gap-3 font-mono text-xs text-white/45">
                        {s.handle}
                        <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--lime)]">↗</span>
                      </span>
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
