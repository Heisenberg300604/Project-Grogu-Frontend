import Link from "next/link";
import { Compass } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { SpriteTile } from "@/components/art/pixel-art";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function NotFound() {
  return (
    <div className="dots page-in flex min-h-dvh flex-col items-center justify-center gap-8 px-5 text-center">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>
      <Logo />
      <SpriteTile size={6} className="size-24 rounded-3xl" />

      <div className="space-y-3">
        <p className="hud text-secondary">Game over</p>
        <p className="font-display text-7xl font-extrabold tracking-tight sm:text-8xl">
          404
        </p>
        <h1 className="text-2xl font-extrabold">This page doesn&apos;t exist</h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          The playtest may have closed, or the link is wrong. Everything that&apos;s
          open right now is on Discover.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/discover" className={buttonVariants({ variant: "primary", size: "lg" })}>
          <Compass />
          Browse playtests
        </Link>
        <Link href="/" className={buttonVariants({ variant: "secondary", size: "lg" })}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
