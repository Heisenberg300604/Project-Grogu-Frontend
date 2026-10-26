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
      <ul className="flex w-fit items-center gap-1 rounded-xl border-2 border-line bg-surface p-1 shadow-sm">
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-lg px-4 py-1.5 text-sm font-bold transition-colors duration-[120ms]",
                  active
                    ? "bg-primary text-primary-foreground"
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
