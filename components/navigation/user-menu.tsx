"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, RefreshCw, UserRound } from "lucide-react";

import type { Session } from "@/lib/types";
import { logout } from "@/lib/mock-auth";
import { useGroguStore } from "@/lib/store/grogu-store";
import { UserAvatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({ session }: { session: Session }) {
  const router = useRouter();
  const refresh = useGroguStore((s) => s.refresh);
  const [busy, setBusy] = useState(false);

  const profileHref = session.role === "tester" ? "/profile" : "/developer/profile";

  async function handleLogout() {
    setBusy(true);
    await logout();
    router.push("/");
  }

  // "Reset demo data" used to wipe the local mock store back to its seed. The
  // data lives on the server now and is not the current user's to reset, so
  // this re-reads it instead.
  async function handleRefresh() {
    setBusy(true);
    await refresh();
    setBusy(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Account menu"
      >
        <UserAvatar name={session.user.name} src={session.user.avatarUrl} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <span className="block text-sm font-medium text-foreground">
            {session.user.name}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {session.user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={profileHref}>
            <UserRound aria-hidden />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleRefresh} disabled={busy}>
          <RefreshCw aria-hidden />
          Refresh data
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout} disabled={busy}>
          <LogOut aria-hidden />
          {busy ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
