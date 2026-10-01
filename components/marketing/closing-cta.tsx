import Link from "next/link";
import { ArrowRight, Building2, Gamepad2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function ClosingCta() {
  return (
    <section className="border-b border-border bg-dark py-24 sm:py-32 lg:py-40">
      <Container>
        <div className="max-w-2xl">
          <p className="telemetry-label flex items-center gap-3 text-secondary"><span className="size-1.5 rounded-full bg-secondary" /> Enter the build</p>
          <h2 className="mt-5 text-display-sm">The next useful signal starts with the right person.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">Whether you are preparing a game or looking for an unreleased world to explore, there is a clear place to begin.</p>
        </div>
        <div className="mt-12 grid border border-border md:grid-cols-2 lg:mt-16">
          <article className="flex min-h-72 flex-col justify-between border-b border-border bg-surface p-7 md:min-h-80 md:border-b-0 md:border-r md:p-10">
            <div>
              <Building2 className="size-5 text-primary" aria-hidden />
              <p className="mt-8 telemetry-label text-secondary">For studios</p>
              <h3 className="mt-3 text-2xl font-semibold text-foreground">Run a playtest with intent.</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">Recruit the players your build needs and collect feedback that is ready for the next decision.</p>
            </div>
            <Link href="/developers" className={buttonVariants({ variant: "outline", size: "lg", className: "mt-8 w-fit" })}>For developers <ArrowRight aria-hidden /></Link>
          </article>
          <article className="flex min-h-72 flex-col justify-between bg-[#151b1b] p-7 md:min-h-80 md:p-10">
            <div>
              <Gamepad2 className="size-5 text-secondary" aria-hidden />
              <p className="mt-8 telemetry-label text-secondary">For players</p>
              <h3 className="mt-3 text-2xl font-semibold text-foreground">Discover a game before it&apos;s finished.</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">Find a fitting mission, play with attention, and make the feedback you give count.</p>
            </div>
            <Link href="/discover" className={buttonVariants({ variant: "primary", size: "lg", className: "mt-8 w-fit" })}>Find playtests <ArrowRight aria-hidden /></Link>
          </article>
        </div>
      </Container>
    </section>
  );
}
