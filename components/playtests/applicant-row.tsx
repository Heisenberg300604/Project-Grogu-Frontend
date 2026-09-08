"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

import { formatRelativeTime } from "@/lib/utils";
import { EXPERIENCE_LABELS, PLATFORM_LABELS } from "@/lib/constants";
import type { Application, TesterProfile, User } from "@/lib/types";
import { applicationsService } from "@/lib/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserAvatar } from "@/components/ui/avatar";

export function ApplicantRow({
  application,
  tester,
  profile,
  spotsLeft,
}: {
  application: Application;
  tester: User;
  profile?: TesterProfile;
  spotsLeft: number;
}) {
  const [busy, setBusy] = useState<"accepted" | "rejected" | null>(null);
  const pending = application.status === "pending";

  async function decide(decision: "accepted" | "rejected") {
    setBusy(decision);
    try {
      await applicationsService.decideApplication(application.id, decision);
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card className="space-y-3 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <UserAvatar name={tester.name} src={tester.avatarUrl} className="size-10" />
          <div>
            <p className="text-sm font-medium">{tester.name}</p>
            <p className="text-xs text-muted-foreground">
              {tester.location} · applied {formatRelativeTime(application.submittedAt)}
            </p>
          </div>
        </div>
        {pending ? (
          <div className="flex flex-wrap items-center gap-2">
            {profile && (
              <span className="text-xs text-muted-foreground">
                Rep {profile.reputation}
              </span>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => decide("rejected")}
              loading={busy === "rejected"}
              disabled={busy !== null}
            >
              <X className="size-4" /> Reject
            </Button>
            <Button
              size="sm"
              onClick={() => decide("accepted")}
              loading={busy === "accepted"}
              disabled={busy !== null || spotsLeft <= 0}
            >
              <Check className="size-4" /> Accept
            </Button>
          </div>
        ) : (
          <StatusBadge kind="application" status={application.status} />
        )}
      </div>

      {profile && (
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="muted">{EXPERIENCE_LABELS[profile.experienceLevel]}</Badge>
          {profile.platforms.slice(0, 3).map((p) => (
            <Badge key={p} tone="default">
              {PLATFORM_LABELS[p]}
            </Badge>
          ))}
          <Badge tone="muted">{profile.completedPlaytests} playtests done</Badge>
        </div>
      )}

      <p className="rounded-md border border-border bg-surface p-3 text-sm text-muted-foreground">
        “{application.message}”
      </p>

      {pending && spotsLeft <= 0 && (
        <p className="text-xs text-warning">
          All tester slots are full — reject someone or raise the tester limit to accept more.
        </p>
      )}
    </Card>
  );
}
