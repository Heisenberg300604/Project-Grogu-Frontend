import { BarChart3, ClipboardList, MessageSquareText, UsersRound } from "lucide-react";

import { Container } from "@/components/ui/container";

const STUDIO_STEPS = [
  { number: "01", title: "Frame the mission", body: "Define the game, the focus of the session, and the kind of player perspective your build needs.", icon: ClipboardList },
  { number: "02", title: "Meet the right players", body: "Review applicants in context, then give accepted testers a clear brief and a place to complete it.", icon: UsersRound },
  { number: "03", title: "Read the signal", body: "Bring ratings, written feedback, bugs, and completion together so the next build has a clear direction.", icon: BarChart3 },
] as const;

export function PlatformWorkflowShowcase() {
  return (
    <section id="platform" className="relative border-b border-border bg-background py-24 sm:py-32 lg:py-40">
      <div aria-hidden className="surface-grid pointer-events-none absolute inset-0 opacity-25" />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
          <div className="max-w-xl">
            <p className="telemetry-label flex items-center gap-3 text-secondary"><span className="size-1.5 rounded-full bg-secondary" /> Studio workflow</p>
            <h2 className="mt-5 text-display-sm">Feedback is most useful when the session is designed for it.</h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
              Grogu turns the gap between a work-in-progress build and a player&apos;s
              experience into a clear, shared process for studios and testers.
            </p>
          </div>

          <ol className="border-t border-border">
            {STUDIO_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.number} className="group grid grid-cols-[3.5rem_1fr] gap-4 border-b border-border py-6 sm:grid-cols-[5rem_1fr_auto] sm:gap-6 sm:py-8">
                  <span className="font-mono text-xs font-medium tracking-[0.14em] text-secondary">{step.number}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">{step.body}</p>
                  </div>
                  <span className="hidden self-start border border-border bg-surface p-2 text-secondary sm:grid sm:size-10 sm:place-items-center"><Icon className="size-4" aria-hidden /></span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-16 grid border border-border bg-surface sm:grid-cols-[0.9fr_1.1fr] lg:mt-24">
          <div className="border-b border-border p-6 sm:border-b-0 sm:border-r sm:p-8">
            <div className="flex items-center gap-3 text-secondary"><MessageSquareText className="size-4" aria-hidden /><span className="telemetry-label">A clear test brief</span></div>
            <p className="mt-6 text-xl font-semibold leading-snug text-foreground">Every mission tells the tester what to explore, why it matters, and how to report what they find.</p>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2">
            <div className="bg-surface p-6 sm:p-8"><p className="telemetry-label text-subtle-foreground">Mission context</p><p className="mt-3 text-sm leading-6 text-muted-foreground">Game, focus area, platform requirements, and testing window are visible before the work begins.</p></div>
            <div className="bg-surface p-6 sm:p-8"><p className="telemetry-label text-subtle-foreground">Structured return</p><p className="mt-3 text-sm leading-6 text-muted-foreground">Ratings and written observations stay connected to the specific session that produced them.</p></div>
          </div>
        </div>
      </Container>
    </section>
  );
}
