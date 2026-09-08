"use client";

import { Check, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { TASK_TYPE_LABELS } from "@/lib/constants";
import type { PlaytestTask } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * Playtest task list. Read-only on the details page; pass `completedIds` +
 * `onToggle` for the interactive workspace checklist.
 */
export function TaskList({
  tasks,
  completedIds,
  onToggle,
  pendingId,
}: {
  tasks: PlaytestTask[];
  completedIds?: string[];
  onToggle?: (taskId: string) => void;
  pendingId?: string | null;
}) {
  const interactive = typeof onToggle === "function";

  return (
    <ol className="space-y-3">
      {tasks.map((task, index) => {
        const done = completedIds?.includes(task.id) ?? false;
        return (
          <li
            key={task.id}
            className={cn(
              "flex gap-3 rounded-lg border border-border bg-surface p-4 transition-colors",
              done && "border-success/40 bg-success/5",
            )}
          >
            {interactive ? (
              <Checkbox
                className="mt-0.5"
                checked={done}
                disabled={pendingId === task.id}
                onCheckedChange={() => onToggle?.(task.id)}
                aria-label={`Mark "${task.title}" ${done ? "incomplete" : "complete"}`}
              />
            ) : (
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border text-[10px] font-semibold",
                  done
                    ? "border-success bg-success text-success-foreground"
                    : "border-border-strong text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3" /> : index + 1}
              </span>
            )}

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    "text-sm font-medium",
                    done && "text-muted-foreground line-through",
                  )}
                >
                  {task.title}
                </p>
                <Badge tone="muted">{TASK_TYPE_LABELS[task.type]}</Badge>
                {task.required ? (
                  <Badge tone="outline">Required</Badge>
                ) : (
                  <Badge tone="muted">Optional</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{task.description}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" aria-hidden />~{task.estimatedMinutes} min
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
