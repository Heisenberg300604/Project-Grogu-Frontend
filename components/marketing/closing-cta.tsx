import Link from "next/link";
import { ArrowRight, Building2, Gamepad2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

export function ClosingCta() {
  return (
    <section>
      <Container>
        <Reveal className="mb-10">
          <Eyebrow>Enter the build</Eyebrow>
          <h2 className="max-w-2xl text-display-sm">
            The next useful signal starts with the right person.
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <article className="card-lift h-full rounded-xl border-2 border-line bg-grape p-8 text-white shadow-md">
              <Building2 className="mb-6" size={32} aria-hidden />
              <p className="hud mb-3 text-white/70">For studios</p>
              <h3 className="text-3xl font-extrabold">Run a playtest with intent.</h3>
              <p className="mb-7 mt-3 text-white/85">
                Recruit the players your build needs and collect feedback that is ready
                for the next decision.
              </p>
              <Link
                href="/developers"
                className={buttonVariants({ variant: "secondary", className: "!text-ink !bg-white" })}
              >
                For developers <ArrowRight size={16} aria-hidden className="arrow" />
              </Link>
            </article>
          </Reveal>
          <Reveal delay={100}>
            <article className="card-lift h-full rounded-xl border-2 border-line bg-gold p-8 text-ink shadow-md">
              <Gamepad2 className="mb-6" size={32} aria-hidden />
              <p className="hud mb-3 opacity-70">For players</p>
              <h3 className="text-3xl font-extrabold">Discover a game before it&apos;s finished.</h3>
              <p className="mb-7 mt-3 opacity-85">
                Find a fitting mission, play with attention, and make the feedback you
                give count.
              </p>
              <Link href="/discover" className={buttonVariants({ variant: "ink" })}>
                Find playtests <ArrowRight size={16} aria-hidden className="arrow" />
              </Link>
            </article>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
