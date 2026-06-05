import Link from "next/link";
import type { EpisodeVisualTheme } from "@/types/rootnote";
import { themes } from "@/lib/themes";

function themeToStyle(theme: EpisodeVisualTheme): React.CSSProperties {
  return {
    "--background": theme.background,
    "--panel": theme.panel,
    "--accent": theme.accent,
    "--secondary-accent": theme.secondaryAccent,
    "--text": theme.text,
    "--muted-text": theme.mutedText,
  } as React.CSSProperties;
}

type Creator = {
  name: string;
  role: string;
  bio: string;
  link?: { label: string; href: string };
};

// Placeholder bios — warm, on-brand, easy to edit later.
const creators: Creator[] = [
  {
    name: "Tyron",
    role: "Founder & Vision",
    bio: "Tyron dreamed up Rootnote as a way to turn late-night music rabbit holes into something you can share. He keeps the team pointed at the big idea: every track is a doorway.",
    link: { label: "@tywealthy", href: "https://x.com/tywealthy" },
  },
  {
    name: "April",
    role: "Design & Story",
    bio: "April shapes how Rootnote feels — the colors, the type, the little moments that make a guided episode feel like a real radio show. She makes sure the music always comes first.",
  },
  {
    name: "Rob",
    role: "Engineering",
    bio: "Rob builds the engine under the hood, wiring up the player, the roots map, and everything in between. A Miami builder at heart, he ships fast and keeps it clean.",
    link: { label: "devs.miami", href: "https://devs.miami" },
  },
  {
    name: "Sebastien",
    role: "Engineering",
    bio: "Sebastien connects the dots between sound and code, tracing samples, scenes, and influences into the ancestry map. He loves a good deep dive almost as much as a good bassline.",
    link: { label: "devs.miami", href: "https://devs.miami" },
  },
];

export const metadata = {
  title: "About Rootnote — The team behind the radio",
  description:
    "Meet the builders behind Rootnote, the AI-guided music discovery and radio episode generator.",
};

export default function AboutPage() {
  const theme = themes.miamiBass;

  return (
    <main
      className={`rn-root rn-texture-${theme.texture}`}
      style={themeToStyle(theme)}
    >
      <nav className="rn-topnav">
        <Link href="/" className="rn-logo rn-nav-brand">
          Rootnote
        </Link>
        <Link href="/" className="rn-btn rn-btn-ghost rn-btn-sm">
          ← Back to app
        </Link>
      </nav>

      <section className="rn-panel rn-about">
        <span className="rn-section-label">About us</span>
        <h1 className="rn-hero">The team behind the radio.</h1>
        <p className="rn-subhero">
          Rootnote is built by a small crew of Miami builders, musicians, and
          curious listeners. We think guided listening beats endless playlists,
          and that every song has roots worth tracing.
        </p>

        <div className="rn-team-grid">
          {creators.map((creator) => (
            <article key={creator.name} className="rn-team-card">
              <h2 className="rn-team-name">{creator.name}</h2>
              <span className="rn-team-role">{creator.role}</span>
              <p className="rn-team-bio">{creator.bio}</p>
              {creator.link && (
                <a
                  className="rn-team-link"
                  href={creator.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {creator.link.label}
                </a>
              )}
            </article>
          ))}
        </div>

        <div className="rn-about-actions">
          <Link href="/" className="rn-btn rn-btn-accent rn-btn-lg">
            ← Back to the app
          </Link>
        </div>
      </section>

      <footer className="rn-footer">
        Rootnote · Guided listening, not just playlists. Every track is a
        doorway.
      </footer>
    </main>
  );
}
