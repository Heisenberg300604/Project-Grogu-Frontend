import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TestStage } from "@/lib/types";

const STEPS: { stage: TestStage; label: string }[] = [
  { stage: "not-started", label: "Accepted" },
  { stage: "in-progress", label: "Testing" },
  { stage: "tasks-complete", label: "Tasks done" },
  { stage: "completed", label: "Feedback in" },
];

const ORDER: TestStage[] = [
  "not-started",
  "in-progress",
  "tasks-complete",
  "feedback-submitted",
  "completed",
];

export function WorkflowStepper({ stage }: { stage: TestStage }) {
  const currentIndex = ORDER.indexOf(stage);

  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const stepIndex = ORDER.indexOf(step.stage);
        const done = currentIndex > stepIndex || stage === "completed";
        const active = currentIndex === stepIndex && !done;
        return (
          <li key={step.stage} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1 text-center">
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full border text-xs font-semibold",
                  done
                    ? "border-success bg-success text-success-foreground"
                    : active
                      ? "border-primary bg-primary/15 text-secondary"
                      : "border-border-strong text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-[11px]",
                  done || active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={cn(
                  "mb-4 h-px flex-1",
                  done ? "bg-success" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
