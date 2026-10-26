import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface WorkflowStep {
  label: string;
  hint: string;
  done: boolean;
}

/**
 * Three-step progress rail for the tester workspace.
 *
 * Steps are derived from the tester's actual progress rather than the raw
 * `TestStage`, so what the rail shows always matches what the page below it
 * lets you do. The first step that isn't done is the active one.
 */
export function WorkflowStepper({ steps }: { steps: WorkflowStep[] }) {
  const activeIndex = steps.findIndex((step) => !step.done);

  return (
    <ol className="grid gap-4 sm:grid-cols-3 sm:gap-0">
      {steps.map((step, i) => {
        const active = i === activeIndex;
        return (
          <li
            key={step.label}
            className="relative flex items-start gap-3 sm:flex-col sm:gap-3"
          >
            <div className="flex items-center gap-3 sm:w-full">
              <span
                className={cn(
                  "hud grid size-9 shrink-0 place-items-center rounded-full border-2 border-line text-xs transition-colors duration-[180ms]",
                  step.done
                    ? "bg-mint text-ink shadow-sm"
                    : active
                      ? "a-pop bg-primary text-primary-foreground shadow-sm"
                      : "bg-elevated text-subtle-foreground",
                )}
              >
                {step.done ? <Check className="size-4" aria-hidden /> : i + 1}
              </span>

              {/* Connector — desktop only, and never after the last step. */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "hidden h-1 flex-1 transition-colors duration-[180ms] sm:block",
                    step.done ? "bg-mint" : "bg-border",
                  )}
                />
              )}
            </div>

            <div className="min-w-0 sm:pr-6">
              <p
                className={cn(
                  "text-sm font-bold",
                  step.done || active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
                {active && (
                  <span className="ml-2 text-xs font-normal text-secondary">
                    Now
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-subtle-foreground">{step.hint}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
