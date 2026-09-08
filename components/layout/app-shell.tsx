"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { Badge } from "@/components/ui/badge";

/**
 * Shared shell for the authenticated tester & developer areas. Kept minimal on
 * purpose — the individual screens are built in later tasks. Client component
 * so it can mark the active nav item.
 */
export function AppShell({
  roleLabel,
  nav,
  children,
}: {
  roleLabel: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-background/85 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo />
            <Badge tone="primary">{roleLabel}</Badge>
          </div>
          <nav aria-label={`${roleLabel} navigation`}>
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                        active && "bg-accent text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  Exit
                </Link>
              </li>
            </ul>
          </nav>
        </Container>
      </header>

      <main className="flex-1 py-10">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
