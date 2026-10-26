"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { MARKETING_NAV } from "@/lib/constants";
import { useSession, homePathForRole } from "@/lib/hooks/use-session";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationMenu } from "@/components/navigation/notification-menu";
import { UserMenu } from "@/components/navigation/user-menu";

/**
 * Top-level site header for the public / browse pages. Session-aware: shows
 * auth CTAs when signed out and the account controls when signed in.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const { session, isAuthenticated } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-line bg-background/95 backdrop-blur">
      <Container className="flex h-[68px] items-center gap-6">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {MARKETING_NAV.map((item) => {
              const itemPath = item.href.split("#")[0];
              const active =
                pathname === itemPath || pathname.startsWith(`${itemPath}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    scroll
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm font-bold transition-colors",
                      active
                        ? "bg-gold text-ink"
                        : "text-muted-foreground hover:bg-elevated hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated && session ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href={homePathForRole(session.role)}
                className={buttonVariants({ variant: "primary", size: "sm" })}
              >
                {session.role === "tester" ? "Tester home" : "Developer home"}
              </Link>
              <NotificationMenu userId={session.user.id} />
              <UserMenu session={session} />
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden px-2 text-sm font-bold hover:underline sm:block"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ variant: "primary", size: "sm" }),
                  "hidden sm:inline-flex",
                )}
              >
                Get started
              </Link>
            </>
          )}
          <button
            type="button"
            className="grid size-10 place-items-center rounded-lg border-2 border-line transition-colors hover:bg-elevated lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </Container>

      {open && (
        <div
          id="mobile-nav"
          className="a-pop border-t-2 border-line bg-background lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {MARKETING_NAV.map((item) => {
              const itemPath = item.href.split("#")[0];
              const active =
                pathname === itemPath || pathname.startsWith(`${itemPath}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  scroll
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-3 font-bold transition-colors",
                    active ? "bg-gold text-ink" : "hover:bg-elevated",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-3 flex flex-col gap-2 border-t-2 border-dashed border-border pt-4">
              {isAuthenticated && session ? (
                <>
                  <div className="flex items-center justify-end gap-2 pb-1">
                    <NotificationMenu userId={session.user.id} />
                    <UserMenu session={session} />
                  </div>
                  <Link
                    href={homePathForRole(session.role)}
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ variant: "primary", size: "md" })}
                  >
                    Go to {session.role === "tester" ? "tester" : "developer"} home
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ variant: "secondary", size: "md" })}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ variant: "primary", size: "md" })}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
