"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";

import { APPLICATION_STATUS_META } from "@/lib/constants";
import type { Application, PlaytestWithRelations } from "@/lib/types";
import { useSession } from "@/lib/hooks/use-session";
import { useTesterApplication } from "@/lib/hooks/use-grogu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ApplyDialog } from "@/components/playtests/apply-dialog";

/** The right-rail call-to-action on the playtest detail page. */
export function ApplyPanel({ playtest }: { playtest: PlaytestWithRelations }) {
  const { session, isAuthenticated } = useSession();
  const application = useTesterApplication(session?.user.id, playtest.id);
  const [open, setOpen] = useState(false);

  const spotsLeft = Math.max(
    0,
    playtest.maxTesters - playtest.acceptedTesters,
  );
  const isOpen = playtest.status === "recruiting";

  return (
    <Card className="p-5">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold">
          {isOpen ? "Applications open" : "Not recruiting"}
        </p>
        <p className="text-xs text-muted-foreground">
          {playtest.acceptedTesters}/{playtest.maxTesters} testers
        </p>
      </div>

      <div className="mt-4">
        <PanelAction
          playtest={playtest}
          application={application}
          isAuthenticated={isAuthenticated}
          role={session?.role ?? null}
          isOpen={isOpen}
          spotsLeft={spotsLeft}
          onApply={() => setOpen(true)}
        />
      </div>

      <ApplyDialog playtest={playtest} open={open} onOpenChange={setOpen} />
    </Card>
  );
}

function PanelAction({
  playtest,
  application,
  isAuthenticated,
  role,
  isOpen,
  spotsLeft,
  onApply,
}: {
  playtest: PlaytestWithRelations;
  application: Application | undefined;
  isAuthenticated: boolean;
  role: "tester" | "developer" | null;
  isOpen: boolean;
  spotsLeft: number;
  onApply: () => void;
}) {
  if (application && application.status !== "withdrawn") {
    const meta = APPLICATION_STATUS_META[application.status];
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          You applied to this playtest —{" "}
          <span className="font-medium text-foreground">{meta.label}</span>.
        </p>
        <Button asChild variant="secondary" className="w-full">
          <Link
            href={
              application.status === "accepted"
                ? `/tests/${playtest.id}`
                : "/applications"
            }
          >
            {application.status === "accepted"
              ? "Open test workspace"
              : "View application"}
          </Link>
        </Button>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <p className="text-sm text-muted-foreground">
        This playtest isn&apos;t accepting new applications.
      </p>
    );
  }

  if (spotsLeft === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Every tester slot is filled. Check Discover for other open playtests.
      </p>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-3">
        <Button asChild className="w-full">
          <Link href={`/login?next=/playtests/${playtest.id}`}>
            <LogIn className="size-4" />
            Sign in to apply
          </Link>
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          New to Grogu?{" "}
          <Link href="/signup" className="text-secondary hover:underline">
            Create a tester account
          </Link>
        </p>
      </div>
    );
  }

  if (role === "developer") {
    return (
      <p className="text-sm text-muted-foreground">
        You&apos;re signed in as a developer. Switch to a tester account to apply.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <Button className="w-full" onClick={onApply}>
        Apply to test
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left · ~
        {playtest.requirements.estimatedHours}h
      </p>
    </div>
  );
}
