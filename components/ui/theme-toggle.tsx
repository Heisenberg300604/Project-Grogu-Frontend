"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

const STORAGE_KEY = "grogu-theme";

/** The theme is a class on <html>; observe it rather than duplicating state. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const isDark = () => document.documentElement.classList.contains("dark");

/**
 * Light / dark switch. The initial class is applied by the inline script in
 * app/layout.tsx; this only flips it and remembers the choice.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const dark = React.useSyncExternalStore(subscribe, isDark, () => false);

  function toggle() {
    const next = !isDark();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* private mode: the choice just won't persist */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      className={cn(
        "relative grid h-10 w-[68px] shrink-0 cursor-pointer items-center rounded-full border-2 border-line bg-elevated px-1 shadow-sm",
        "transition-transform active:translate-x-px active:translate-y-px",
        className,
      )}
    >
      <Sun aria-hidden size={14} className="absolute left-2.5 text-warning" />
      <Moon aria-hidden size={14} className="absolute right-2.5 text-muted-foreground" />
      <span
        aria-hidden
        className="grid size-7 place-items-center rounded-full border-2 border-line bg-gold text-ink transition-transform duration-300 ease-[cubic-bezier(0.3,1.6,0.5,1)]"
        style={{ transform: dark ? "translateX(28px)" : "translateX(0)" }}
      >
        {dark ? <Moon size={13} /> : <Sun size={13} />}
      </span>
    </button>
  );
}
