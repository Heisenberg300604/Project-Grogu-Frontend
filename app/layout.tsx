import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

import { SITE } from "@/lib/constants";
import { ToastProvider } from "@/components/ui/toast";
import { GroguProvider } from "@/components/providers/grogu-provider";
import "./globals.css";

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

export const viewport: Viewport = {
  themeColor: "#0f0d19",
  colorScheme: "dark",
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
      className="h-full"
      suppressHydrationWarning
    >
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
