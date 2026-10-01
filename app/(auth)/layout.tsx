import type { ReactNode } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";

import { Logo } from "@/components/ui/logo";

/**
 * Split auth shell: the form on the left, a game-art panel on the right.
 *
 * The panel is decorative and hidden below `lg` — on mobile the form gets the
 * whole screen rather than being pushed below a hero image.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col justify-center px-5 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10">
            <Logo />
          </div>
          {children}
        </div>
      </div>

      <aside
        aria-hidden
        className="relative hidden overflow-hidden border-l border-border lg:block"
      >
        <Image
          src="/images/grogu-auth-valley.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,12,13,.36),transparent_38%),linear-gradient(0deg,rgba(8,12,13,.92),rgba(8,12,13,.08)_68%)]" />

        <div className="absolute inset-x-0 bottom-0 p-12">
          <Quote className="size-7 text-secondary/60" />
          <p className="mt-5 max-w-md font-display text-2xl font-semibold leading-snug text-white">Observe closely. Make the next build stronger.</p>
          <p className="mt-5 text-sm text-white/60">
            Grogu connects thoughtful players and studios through structured playtests.
          </p>
        </div>
      </aside>
    </div>
  );
}
