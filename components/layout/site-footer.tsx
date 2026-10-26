import Link from "next/link";

import { SITE } from "@/lib/constants";
import { Sprite } from "@/components/art/pixel-art";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

const FOOTER_SECTIONS: { title: string; links: { label: string; href: string }[] }[] =
  [
    {
      title: "Testers",
      links: [
        { label: "Discover playtests", href: "/discover" },
        { label: "Browse testers", href: "/testers" },
        { label: "Your applications", href: "/applications" },
        { label: "Tester profile", href: "/profile" },
      ],
    },
    {
      title: "Developers",
      links: [
        { label: "For developers", href: "/developers" },
        { label: "Browse studios", href: "/studios" },
        { label: "Developer dashboard", href: "/developer/dashboard" },
        { label: "Create a playtest", href: "/developer/playtests/new" },
      ],
    },
    {
      title: "Platform",
      links: [
        { label: "How it works", href: "/how-it-works#top" },
        { label: "Log in", href: "/login" },
        { label: "Sign up", href: "/signup" },
      ],
    },
  ];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t-2 border-line bg-elevated">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Structured playtesting that respects everyone&apos;s time — for indie
            teams and the testers who make their games better.
          </p>
          <div className="mt-5 flex items-end gap-3">
            <Sprite size={4} />
            <span className="hud a-blink text-muted-foreground">Press start</span>
          </div>
        </div>

        {FOOTER_SECTIONS.map((section) => (
          <nav key={section.title} aria-label={section.title}>
            <h2 className="hud mb-4 text-muted-foreground">{section.title}</h2>
            <ul className="grid gap-2.5">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold transition-colors hover:text-secondary hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t-2 border-line">
        <Container className="flex flex-col justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.fullName}. Student project.
          </p>
          <p>Built with Next.js &amp; Tailwind CSS.</p>
        </Container>
      </div>
    </footer>
  );
}
