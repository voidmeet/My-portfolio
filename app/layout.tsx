import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { SmoothScroll } from "@/components/scroll/SmoothScroll";
import { profile } from "@/lib/data";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const description =
  "Meet Bundela — Cloud & DevOps Engineer in Rajkot, India. Kubernetes, AWS, CI/CD pipelines and observability with Prometheus, Grafana, Loki, Tempo and Alloy.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.website),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.website }],
  creator: profile.name,
  keywords: [
    "Meet Bundela",
    "DevOps Engineer",
    "Cloud Engineer",
    "Kubernetes",
    "AWS",
    "CI/CD",
    "Observability",
    "Prometheus",
    "Grafana",
    "Rajkot",
    "Ahmedabad",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title: `${profile.name} — ${profile.role}`,
    description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="min-h-svh bg-void">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
