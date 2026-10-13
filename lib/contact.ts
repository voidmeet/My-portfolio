import { profile } from "./data";

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export type ContactResult =
  | { ok: true; via: "emailjs" | "mailto" }
  | { ok: false; error: string };

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export const contactRelayConfigured = Boolean(serviceId && templateId && publicKey);

/**
 * Delivers a message through EmailJS when configured, otherwise hands off to
 * the visitor's mail client with a pre-filled draft so nothing is lost.
 */
export async function sendContactMessage(payload: ContactPayload): Promise<ContactResult> {
  if (serviceId && templateId && publicKey) {
    try {
      const { default: emailjs } = await import("@emailjs/browser");
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: payload.name || "Portfolio visitor",
          from_email: payload.email,
          message: payload.message,
          to_email: profile.email,
        },
        { publicKey },
      );
      return { ok: true, via: "emailjs" };
    } catch (err) {
      const reason =
        err && typeof err === "object" && "text" in err ? String((err as { text: unknown }).text) : "relay rejected the request";
      return { ok: false, error: reason };
    }
  }

  const subject = encodeURIComponent(`Hello from ${payload.name || payload.email}`);
  const body = encodeURIComponent(`${payload.message}\n\n— ${payload.name || "Portfolio visitor"} <${payload.email}>`);
  window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  return { ok: true, via: "mailto" };
}
