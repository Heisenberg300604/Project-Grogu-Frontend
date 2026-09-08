"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { DEVELOPER_NAV, TESTER_NAV, type AppNavItem } from "@/lib/constants";
import type { UserRole } from "@/lib/types";
import { useRequireRole } from "@/lib/hooks/use-session";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { PageSkeleton } from "@/components/ui/states";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NotificationMenu } from "@/components/navigation/notification-menu";
import { UserMenu } from "@/components/navigation/user-menu";

function isActive(pathname: string, item: AppNavItem) {
  if (pathname === item.href) return true;
  if (pathname.startsWith(`${item.href}/`)) return true;
  return (item.match ?? []).some(
    (m) => pathname === m || pathname.startsWith(`${m}/`),
  );
}

function NavLinks({
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
        const active = isActive(pathname, item);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon
                className={cn("size-4", active && "text-secondary")}
                aria-hidden
              />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Shared shell for the authenticated tester + developer areas. Configuration
 * driven — the only per-role difference is `roleLabel` + `nav`. Guards the route
 * (redirect when signed out / wrong role) and gates rendering on store
 * hydration so persisted data never causes an SSR mismatch.
 */
export function AppShell({
  role,
  roleLabel,
  children,
}: {
  role: UserRole;
  roleLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { allowed, loading, session } = useRequireRole(role);
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav: AppNavItem[] = role === "tester" ? TESTER_NAV : DEVELOPER_NAV;

  if (loading || !allowed || !session) {
    return (
      <div className="min-h-dvh">
        <div className="border-b border-border">
          <Container className="flex h-16 items-center">
            <Logo />
          </Container>
        </div>
        <Container className="py-10">
          <PageSkeleton />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-surface/60 lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Logo />
        </div>
        <div className="flex items-center gap-2 px-5 py-4">
          <Badge tone="primary">{roleLabel}</Badge>
        </div>
        <nav aria-label={`${roleLabel} navigation`} className="flex-1 px-3">
          <NavLinks nav={nav} pathname={pathname} />
        </nav>
        <div className="border-t border-border p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ExternalLink className="size-4" aria-hidden />
            Back to grogu.com
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger
                  className="grid size-9 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
                  aria-label="Open navigation"
                >
                  <Menu className="size-5" />
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetTitle className="sr-only">
                    {roleLabel} navigation
                  </SheetTitle>
                  <div className="mb-1">
                    <Logo />
                  </div>
                  <Badge tone="primary" className="w-fit">
                    {roleLabel}
                  </Badge>
                  <nav aria-label={`${roleLabel} navigation`} className="mt-2">
                    <NavLinks
                      nav={nav}
                      pathname={pathname}
                      onNavigate={() => setMobileOpen(false)}
                    />
                  </nav>
                  <SheetClose asChild>
                    <Link
                      href="/"
                      className="mt-auto flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <ExternalLink className="size-4" aria-hidden />
                      Back to grogu.com
                    </Link>
                  </SheetClose>
                </SheetContent>
              </Sheet>
              <div className="lg:hidden">
                <Logo />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <NotificationMenu userId={session.user.id} />
              <UserMenu session={session} />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
