"use client";

import Link from "next/link";
import { Bell, Check } from "lucide-react";

import { cn, formatRelativeTime } from "@/lib/utils";
import { NOTIFICATION_META } from "@/lib/constants";
import { useNotifications } from "@/lib/hooks/use-grogu";
import { notificationsService } from "@/lib/services";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NotificationMenu({ userId }: { userId: string }) {
  const notifications = useNotifications(userId);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative grid size-10 place-items-center rounded-lg border-2 border-line bg-surface transition-colors hover:bg-elevated"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
      >
        <Bell className="size-[17px]" />
        {unread > 0 && (
          <span className="hud absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-line bg-coral px-1 text-[0.6rem] text-ink">
            {unread}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[22rem] p-0">
        <div className="flex items-center justify-between border-b-2 border-line px-3.5 py-3">
          <p className="font-display text-base font-extrabold">Notifications</p>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => notificationsService.markAllRead(userId)}
              className="inline-flex items-center gap-1 rounded text-xs font-bold text-secondary hover:underline"
            >
              <Check className="size-3" /> Mark all read
            </button>
          )}
        </div>
        <ul className="max-h-96 divide-y divide-border overflow-y-auto">
          {notifications.length === 0 && (
            <li className="px-3 py-10 text-center text-sm text-muted-foreground">
              You&apos;re all caught up.
            </li>
          )}
          {notifications.slice(0, 8).map((n) => {
            const tone = NOTIFICATION_META[n.type].tone;
            const body = (
              <div className="flex gap-3">
                <span
                  className={cn(
                    "mt-1.5 size-2.5 shrink-0 rounded-full border-2 border-line",
                    tone === "success" && "bg-mint",
                    tone === "destructive" && "bg-coral",
                    tone === "warning" && "bg-gold",
                    tone === "info" && "bg-azure",
                    tone === "primary" && "bg-grape",
                    tone === "muted" && "bg-muted-foreground",
                  )}
                  aria-hidden
                />
                <div className="min-w-0 space-y-0.5">
                  <p
                    className={cn(
                      "text-sm",
                      n.read ? "text-muted-foreground" : "font-medium text-foreground",
                    )}
                  >
                    {n.title}
                  </p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {n.body}
                  </p>
                  <p className="text-[11px] text-subtle-foreground">
                    {formatRelativeTime(n.createdAt)}
                  </p>
                </div>
              </div>
            );
            return (
              <li key={n.id}>
                {n.href ? (
                  <Link
                    href={n.href}
                    onClick={() => notificationsService.markRead(n.id)}
                    className="block px-3.5 py-3 transition-colors hover:bg-accent"
                  >
                    {body}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => notificationsService.markRead(n.id)}
                    className="block w-full px-3.5 py-3 text-left transition-colors hover:bg-accent"
                  >
                    {body}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
