"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import type { AppNavItem } from "@/lib/constants";

/** A nav item is active on its own route and on anything nested under it. */
export function isNavItemActive(pathname: string, item: AppNavItem) {
  if (pathname === item.href) return true;
  if (pathname.startsWith(`${item.href}/`)) return true;
  return (item.match ?? []).some(
    (m) => pathname === m || pathname.startsWith(`${m}/`),
  );
}

/**
 * Horizontal primary navigation for the signed-in areas.
 *
 * The active route is marked twice — a lit label and an underline rail — so it
 * reads at a glance and doesn't rely on colour alone.
 */
export function AppNavBar({
  nav,
  pathname,
  className,
}: {
  nav: AppNavItem[];
  pathname: string;
  className?: string;
}) {
  return (
    <ul className={cn("flex items-center gap-0.5", className)} role="list">
      {nav
        .filter((item) => !item.menuOnly)
        .map((item) => {
          const active = isNavItemActive(pathname, item);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold",
                  "transition-colors duration-[120ms]",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-elevated hover:text-foreground",
                )}
              >
                <item.icon className="size-4" aria-hidden />
                {item.label}
              </Link>
            </li>
          );
        })}
    </ul>
  );
}

/** Stacked variant for the mobile drawer. Shows menu-only items too. */
export function AppNavList({
  nav,
  pathname,
  onNavigate,
}: {
  nav: AppNavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="flex flex-col gap-1" role="list">
      {nav.map((item) => {
        const active = isNavItemActive(pathname, item);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-elevated hover:text-foreground",
              )}
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
