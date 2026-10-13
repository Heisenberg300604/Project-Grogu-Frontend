"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const TABS = [
  { label: "Playtests", href: "/discover" },
  { label: "Testers", href: "/testers" },
  { label: "Studios", href: "/studios" },
] as const;

/**
 * Switches between the three public browse surfaces. They share a header block,
 * so the strip reads as one section rather than three unrelated pages.
 */
export function DirectoryTabs({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Browse" className={className}>
      <ul className="flex items-center gap-1 rounded-full border border-border bg-surface/60 p-1 w-fit">
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-[120ms]",
                  active
                    ? "bg-primary-soft text-secondary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
