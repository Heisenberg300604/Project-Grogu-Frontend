"use client";

import { useEffect, useState } from "react";
import { BarChart3, ClipboardList, Gamepad2 } from "lucide-react";

import { cn } from "@/lib/utils";

const TABS = [
  {
    label: "Brief",
    icon: ClipboardList,
    headline:
      "Every mission tells the tester what to explore, why it matters, and how to report what they find.",
    detail: "What the build needs observed",
  },
  {
    label: "Mission",
    icon: Gamepad2,
    headline:
      "Game, focus area, platform requirements, and the testing window are visible before the work begins.",
    detail: "The play session and tasks",
  },
  {
    label: "Return",
    icon: BarChart3,
    headline:
      "Ratings and written observations stay connected to the specific session that produced them.",
    detail: "Feedback tied back to the build",
  },
] as const;

const ROTATE_MS = 4500;

/**
 * Three-tab explainer that rotates on its own until the visitor picks a tab.
 * The progress strip along the bottom shows the time left on the current tab.
 */
export function BriefCard() {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % TABS.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, [auto]);

  const current = TABS[index];
  const Icon = current.icon;

  return (
    <div className="overflow-hidden rounded-xl border-2 border-line bg-surface shadow-md">
      <div role="tablist" aria-label="How a playtest brief works" className="grid grid-cols-3 border-b-2 border-line bg-elevated">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            id={`brief-tab-${i}`}
            aria-selected={index === i}
            aria-controls="brief-panel"
            onClick={() => {
              setIndex(i);
              setAuto(false);
            }}
            className={cn(
              "hud flex items-center justify-center gap-2 border-r-2 border-line px-3 py-4 transition-colors last:border-r-0",
              index === i ? "bg-gold text-ink" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="opacity-60">0{i + 1}</span> {tab.label}
          </button>
        ))}
      </div>

      <div
        key={index}
        id="brief-panel"
        role="tabpanel"
        aria-labelledby={`brief-tab-${index}`}
        className="a-pop grid items-center gap-6 p-6 md:grid-cols-[auto_1fr] md:p-8"
      >
        <span className="grid size-16 place-items-center rounded-2xl border-2 border-line bg-grape text-white shadow-sm">
          <Icon size={28} aria-hidden />
        </span>
        <div>
          <p className="font-display text-xl font-bold leading-snug md:text-2xl">
            {current.headline}
          </p>
          <p className="hud mt-3 text-muted-foreground">{current.detail}</p>
        </div>
      </div>

      <div className="h-2 bg-elevated" aria-hidden>
        <div
          key={`${index}-${auto}`}
          className="h-full origin-left bg-grape"
          style={{
            animation: auto ? `g-fill-x ${ROTATE_MS}ms linear forwards` : undefined,
            transform: auto ? undefined : "scaleX(1)",
          }}
        />
      </div>
    </div>
  );
}
