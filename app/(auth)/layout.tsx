import type { ReactNode } from "react";

import { HeroScene } from "@/components/art/pixel-art";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * Split auth shell: the form on the left, a pixel-art scene on the right.
 *
 * The scene is decorative and hidden below `lg` — on mobile the form gets the
 * whole screen rather than being pushed below an illustration.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="page-in dots flex flex-col px-5 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          {children}
        </div>
      </div>

      <aside
        aria-hidden
        className="relative hidden overflow-hidden border-l-2 border-line lg:block"
      >
        <HeroScene className="absolute inset-0 size-full" />

        <div className="absolute inset-x-8 bottom-8 rounded-xl border-2 border-line bg-surface p-6 shadow-md">
          <p className="hud mb-3 text-muted-foreground">Tip of the day</p>
          <p className="font-display text-2xl font-extrabold">
            Observe closely. Make the next build stronger.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Grogu connects thoughtful players and studios through structured playtests.
          </p>
        </div>
      </aside>
    </div>
  );
}
