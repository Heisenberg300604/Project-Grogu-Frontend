import { BarChart3, ClipboardList, UsersRound, Zap } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { BriefCard } from "@/components/marketing/brief-card";

const STUDIO_STEPS = [
  { number: "01", title: "Frame the mission", body: "Define the game, the focus of the session, and the kind of player perspective your build needs.", icon: ClipboardList, xp: "+50 XP", tile: "bg-gold" },
  { number: "02", title: "Meet the right players", body: "Review applicants in context, then give accepted testers a clear brief and a place to complete it.", icon: UsersRound, xp: "+80 XP", tile: "bg-azure" },
  { number: "03", title: "Read the signal", body: "Bring ratings, written feedback, bugs, and completion together so the next build has a clear direction.", icon: BarChart3, xp: "+120 XP", tile: "bg-mint" },
] as const;

export function PlatformWorkflowShowcase() {
  return (
    <>
      <section id="platform">
        <Container className="grid gap-12 py-24 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <Eyebrow>Studio workflow</Eyebrow>
            <h2 className="text-display-sm">
              Feedback is most useful when the session is designed for it.
            </h2>
            <p className="mt-5 max-w-md text-muted-foreground">
              Grogu turns the gap between a work-in-progress build and a player&apos;s
              experience into a clear, shared process for studios and testers.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Zap className="text-gold" fill="currentColor" aria-hidden />
              <span className="hud">3 quests · 250 XP total</span>
            </div>
          </Reveal>

          <ol className="grid gap-4">
            {STUDIO_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.number}>
                  <Reveal delay={i * 90}>
                    <div className="card-lift wiggle-hover flex items-start gap-4 rounded-xl border-2 border-line bg-surface p-5 shadow-md">
                      <span
                        className={`hud grid size-12 shrink-0 place-items-center rounded-xl border-2 border-line text-lg text-ink ${step.tile}`}
                      >
                        {step.number}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{step.title}</h3>
                        <p className="mt-1.5 text-muted-foreground">{step.body}</p>
                      </div>
                      <div className="hidden flex-col items-end gap-3 sm:flex">
                        <span className="wiggle-target grid size-10 place-items-center rounded-lg border-2 border-line bg-elevated">
                          <Icon size={18} aria-hidden />
                        </span>
                        <span className="hud text-success">{step.xp}</span>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      <section>
        <Container className="pb-24">
          <Reveal>
            <BriefCard />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
