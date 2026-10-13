import { SceneLayer } from "@/components/3d-canvas";
import { TechStack } from "@/components/cards/TechStack";
import { Contact } from "@/components/contact/Contact";
import { Experience } from "@/components/experience/Experience";
import { Hero } from "@/components/hero/Hero";
import { FxOverlay } from "@/components/layout/FxOverlay";
import { Navbar } from "@/components/layout/Navbar";
import { profile } from "@/lib/data";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  url: profile.website,
  sameAs: [profile.linkedin, profile.github],
  address: { "@type": "PostalAddress", addressLocality: "Rajkot", addressRegion: "Gujarat", addressCountry: "IN" },
  knowsAbout: ["Kubernetes", "Docker", "AWS", "CI/CD", "Jenkins", "Linux", "Nginx", "Prometheus", "Grafana", "Loki", "Tempo", "Alloy"],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <SceneLayer />
      <FxOverlay />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <TechStack />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
