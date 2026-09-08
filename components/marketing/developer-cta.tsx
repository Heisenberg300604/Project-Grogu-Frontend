import Link from "next/link";
import { Check } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const POINTS = [
  "Define tester requirements once — Grogu handles the matching",
  "Review applicants side by side with reputation and platform data",
  "Feedback arrives structured, with per-task answers and repro steps",
];

export function DeveloperCta() {
  return (
    <section className="py-20">
      <Container>
        <div className="overflow-hidden rounded-2xl border border-border bg-elevated">
          <div className="grid gap-10 p-8 md:grid-cols-2 md:p-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Run your next playtest on Grogu
              </h2>
              <p className="text-base text-muted-foreground">
                Set up a game, publish a playtest, and get a focused group of
                testers who understand the assignment — without living in a
                spreadsheet.
              </p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className={buttonVariants({ variant: "primary", size: "lg" })}
                >
                  Create a developer account
                </Link>
                <Link
                  href="/developers"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  See how it works
                </Link>
              </div>
            </div>

            <ul className="flex flex-col justify-center gap-3">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  <span className="text-sm text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
