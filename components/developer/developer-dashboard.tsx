"use client";

import Link from "next/link";
import {
  Gamepad2,
  ListChecks,
  MessageSquareText,
  Plus,
  UserCheck,
  Users,
} from "lucide-react";

import { formatRelativeTime } from "@/lib/utils";
import {
  useDeveloperFeedback,
  useDeveloperPlaytests,
  useDeveloperStats,
} from "@/lib/hooks/use-grogu";
import { useGroguStore } from "@/lib/store/grogu-store";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";
import { RatingStars } from "@/components/feedback/rating";

export function DeveloperDashboard() {
  const { user } = useSession();
  const stats = useDeveloperStats(user?.id);
  const playtests = useDeveloperPlaytests(user?.id);
  const feedback = useDeveloperFeedback(user?.id);
  const applications = useGroguStore((s) => s.applications);
  const testProgress = useGroguStore((s) => s.testProgress);

  if (!user) return null;

  const active = playtests.filter(
    (p) => p.status === "recruiting" || p.status === "in-progress",
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${user.name.split(" ")[0]}'s studio`}
        description="Your games, active playtests, and the feedback coming in."
        actions={
          <>
            <Button asChild variant="secondary">
              <Link href="/developer/games/new">
                <Gamepad2 className="size-4" /> Add game
              </Link>
            </Button>
            <Button asChild>
              <Link href="/developer/playtests/new">
                <Plus className="size-4" /> New playtest
              </Link>
            </Button>
          </>
        }
      />

      <StatCardGrid>
        <StatCard label="Games" value={stats.games} icon={Gamepad2} />
        <StatCard label="Active playtests" value={stats.activePlaytests} icon={ListChecks} />
        <StatCard
          label="Pending applicants"
          value={stats.pendingApplicants}
          icon={Users}
          hint={stats.pendingApplicants > 0 ? "Waiting on your review" : undefined}
        />
        <StatCard label="Feedback reports" value={stats.feedbackCount} icon={MessageSquareText} />
      </StatCardGrid>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active playtests</h2>
          <Button asChild variant="link" size="sm">
            <Link href="/developer/playtests">All playtests</Link>
          </Button>
        </div>

        {active.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="No active playtests"
            description="Create a playtest to start recruiting testers for one of your games."
            action={
              <Button asChild size="sm">
                <Link href="/developer/playtests/new">New playtest</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {active.map((playtest) => {
              const pending = applications.filter(
                (a) => a.playtestId === playtest.id && a.status === "pending",
              ).length;
              const accepted = applications.filter(
                (a) => a.playtestId === playtest.id && a.status === "accepted",
              );
              const done = accepted.filter((a) => {
                const progress = testProgress.find(
                  (p) => p.playtestId === playtest.id && p.testerId === a.testerId,
                );
                return progress?.stage === "completed";
              }).length;
              const completionPct = accepted.length
                ? Math.round((done / accepted.length) * 100)
                : 0;
              return (
                <Card key={playtest.id} className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <StatusBadge kind="playtest" status={playtest.status} />
                        <span className="text-xs text-muted-foreground">
                          {playtest.game.title}
                        </span>
                      </div>
                      <p className="mt-1 font-display text-sm font-semibold">
                        <Link
                          href={`/developer/playtests/${playtest.id}`}
                          className="hover:text-secondary"
                        >
                          {playtest.title}
                        </Link>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {pending > 0 && (
                        <Button asChild size="sm" variant="secondary">
                          <Link href={`/developer/playtests/${playtest.id}?tab=applicants`}>
                            <UserCheck className="size-4" /> {pending} to review
                          </Link>
                        </Button>
                      )}
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/developer/playtests/${playtest.id}`}>Manage</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Testers: {accepted.length}/{playtest.maxTesters}
                      </p>
                      <Progress
                        value={
                          (accepted.length / Math.max(1, playtest.maxTesters)) * 100
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Feedback completion: {completionPct}%
                      </p>
                      <Progress value={completionPct} indicatorClassName="bg-success" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent feedback</h2>
          <Button asChild variant="link" size="sm">
            <Link href="/developer/analytics">View analytics</Link>
          </Button>
        </div>
        {feedback.length === 0 ? (
          <EmptyState
            icon={MessageSquareText}
            title="No feedback yet"
            description="Feedback from your testers will appear here as they submit it."
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Latest reports</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border pt-0">
              {feedback.slice(0, 5).map(({ feedback: f, playtest, tester }) => (
                <div key={f.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm">
                      <span className="font-medium">{tester?.name ?? "A tester"}</span>{" "}
                      on{" "}
                      <Link
                        href={`/developer/playtests/${playtest.id}?tab=feedback`}
                        className="text-secondary hover:underline"
                      >
                        {playtest.title}
                      </Link>
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {f.summary}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <RatingStars value={f.ratings.fun} />
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(f.submittedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
