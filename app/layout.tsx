import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree, Silkscreen } from "next/font/google";

import { SITE } from "@/lib/constants";
import { ToastProvider } from "@/components/ui/toast";
import { GroguProvider } from "@/components/providers/grogu-provider";
import "./globals.css";

// Display, body and pixel (HUD) families. Exposed as CSS variables that the
// theme in globals.css maps to --font-display / --font-sans / --font-pixel.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});
const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-silkscreen",
  display: "swap",
});

// Runs before first paint so a returning visitor never sees a flash of the
// wrong theme. Light is the default; "dark" is only applied when saved.
const THEME_SCRIPT = `try{if(localStorage.getItem("grogu-theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — The playtest network`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.fullName,
  keywords: [
    "playtesting",
    "game testing",
    "game playtest platform",
    "find game testers",
    "game feedback platform",
    "player feedback",
    "game development",
  ],
  authors: [{ name: "Project Grogu" }],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — The playtest network`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — The playtest network`,
    description: SITE.description,
  },
};

// Every page renders per request, so the cached API snapshot is refreshed on
// schedule rather than frozen into the build output.
export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0d1f" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.fullName,
    url: SITE.url,
    description: SITE.description,
  };

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`h-full ${bricolage.variable} ${figtree.variable} ${silkscreen.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      {/* Extensions (ColorZilla, Grammarly, ...) inject attributes on <body>
          before React hydrates, which React reports as a mismatch. */}
      <body className="min-h-full antialiased" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <GroguProvider>
          <ToastProvider>{children}</ToastProvider>
        </GroguProvider>
      </body>
    </html>
  );
}
