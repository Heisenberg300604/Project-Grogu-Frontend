"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarClock, Gift, Lock, Users } from "lucide-react";

import { formatDate, formatDeadline } from "@/lib/utils";
import { computeAnalytics } from "@/lib/domain";
import { FOCUS_LABELS } from "@/lib/constants";
import type { PlaytestStatus } from "@/lib/types";
import {
  useAcceptedTesters,
  useFeedbackForPlaytest,
  usePlaytest,
  usePlaytestApplicants,
} from "@/lib/hooks/use-grogu";
import { useGroguStore } from "@/lib/store/grogu-store";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useSession } from "@/lib/hooks/use-session";
import { playtestsService } from "@/lib/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, PageSkeleton } from "@/components/ui/states";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";
import { ApplicantRow } from "@/components/playtests/applicant-row";
import { TesterCard } from "@/components/dashboard/tester-card";
import { FeedbackCard } from "@/components/feedback/feedback-card";
import { RatingBar } from "@/components/feedback/rating";
import { RatingsBarChart } from "@/components/charts/ratings-bar-chart";
import { SentimentDonut } from "@/components/charts/sentiment-donut";

const STATUS_OPTIONS: PlaytestStatus[] = [
  "draft",
  "recruiting",
  "in-progress",
  "review",
  "completed",
  "closed",
];

const TABS = ["overview", "applicants", "testers", "feedback", "analytics"] as const;

export function ManagePlaytest({ playtestId }: { playtestId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrated = useHydrated();
  const { user } = useSession();
  const playtest = usePlaytest(playtestId);
  const applicants = usePlaytestApplicants(playtestId);
  const acceptedTesters = useAcceptedTesters(playtestId);
  const feedback = useFeedbackForPlaytest(playtestId);
  const users = useGroguStore((s) => s.users);
  const [statusBusy, setStatusBusy] = useState(false);

  const tabParam = searchParams.get("tab");
  const tab = TABS.includes(tabParam as (typeof TABS)[number])
    ? (tabParam as (typeof TABS)[number])
    : "overview";

  if (!hydrated || !user) return <PageSkeleton />;

  if (!playtest || playtest.developerId !== user.id) {
    return (
      <EmptyState
        icon={Lock}
        title="Playtest not found"
        description="This playtest doesn't exist or belongs to another studio."
        action={
          <Button asChild size="sm" variant="secondary">
            <Link href="/developer/playtests">Back to playtests</Link>
          </Button>
        }
      />
    );
  }

  const pending = applicants.filter((a) => a.application.status === "pending");
  const spotsLeft = Math.max(0, playtest.maxTesters - acceptedTesters.length);
  const analytics = computeAnalytics(playtest, feedback);
  const completedCount = acceptedTesters.filter(
    (t) => t.progress?.stage === "completed",
  ).length;

  async function changeStatus(status: PlaytestStatus) {
    setStatusBusy(true);
    try {
      await playtestsService.setPlaytestStatus(playtestId, status);
    } finally {
      setStatusBusy(false);
    }
  }

  function setTab(value: string) {
    router.replace(`/developer/playtests/${playtestId}?tab=${value}`, {
      scroll: false,
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[
          { label: "Playtests", href: "/developer/playtests" },
          { label: playtest.game.title },
        ]}
        title={playtest.title}
        description={playtest.summary}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge kind="playtest" status={playtest.status} />
            <Select
              value={playtest.status}
              onValueChange={(v) => changeStatus(v as PlaytestStatus)}
              disabled={statusBusy}
            >
              <SelectTrigger className="h-9 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/playtests/${playtest.id}`}>Public page</Link>
            </Button>
          </div>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applicants">
            Applicants
            {pending.length > 0 && (
              <span className="ml-1 rounded-full bg-warning/20 px-1.5 text-[10px] text-warning">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="testers">Testers ({acceptedTesters.length})</TabsTrigger>
          <TabsTrigger value="feedback">Feedback ({feedback.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <StatCardGrid>
            <StatCard
              label="Testers"
              value={`${acceptedTesters.length}/${playtest.maxTesters}`}
              icon={Users}
              hint={`${spotsLeft} spots left`}
            />
            <StatCard label="Pending applicants" value={pending.length} />
            <StatCard
              label="Feedback in"
              value={`${feedback.length}/${acceptedTesters.length || "—"}`}
              hint={`${analytics.responseRate}% response rate`}
            />
            <StatCard label="Completed" value={completedCount} />
          </StatCardGrid>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarClock className="size-4" aria-hidden />
                  {formatDeadline(playtest.closesAt)} · opened {formatDate(playtest.opensAt)}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Gift className="size-4" aria-hidden />
                  {playtest.reward}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {playtest.focusAreas.map((f) => (
                    <Badge key={f} tone="primary">
                      {FOCUS_LABELS[f]}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Roster filled</p>
                  <Progress
                    value={(acceptedTesters.length / Math.max(1, playtest.maxTesters)) * 100}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Feedback completion</p>
                  <Progress
                    value={
                      acceptedTesters.length
                        ? (completedCount / acceptedTesters.length) * 100
                        : 0
                    }
                    indicatorClassName="bg-success"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Goals</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {playtest.goals.map((goal) => (
                  <li key={goal}>• {goal}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applicants */}
        <TabsContent value="applicants" className="space-y-4">
          {applicants.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No applicants yet"
              description="Share the public playtest page to attract testers."
              action={
                <Button asChild size="sm" variant="secondary">
                  <Link href={`/playtests/${playtest.id}`}>Open public page</Link>
                </Button>
              }
            />
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                {pending.length} awaiting review · {spotsLeft} spots left
              </p>
              {applicants.map(({ application, tester, profile }) => (
                <ApplicantRow
                  key={application.id}
                  application={application}
                  tester={tester}
                  profile={profile}
                  spotsLeft={spotsLeft}
                />
              ))}
            </>
          )}
        </TabsContent>

        {/* Testers */}
        <TabsContent value="testers" className="space-y-4">
          {acceptedTesters.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No testers accepted yet"
              description="Accept applicants from the Applicants tab to build your roster."
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {acceptedTesters.map(({ application, tester, progress }) => (
                <TesterCard
                  key={application.id}
                  tester={tester}
                  application={application}
                  progress={progress}
                  playtest={playtest}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Feedback */}
        <TabsContent value="feedback" className="space-y-4">
          {feedback.length === 0 ? (
            <EmptyState
              title="No feedback submitted yet"
              description="Testers submit feedback after completing the required tasks."
            />
          ) : (
            feedback.map((entry) => (
              <FeedbackCard
                key={entry.id}
                feedback={entry}
                tester={users.find((u) => u.id === entry.testerId)}
              />
            ))
          )}
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          {feedback.length === 0 ? (
            <EmptyState
              title="Analytics unlock with feedback"
              description="Once testers submit feedback you'll see rating breakdowns and sentiment here."
            />
          ) : (
            <>
              <StatCardGrid>
                <StatCard label="Responses" value={feedback.length} />
                <StatCard
                  label="Avg fun"
                  value={analytics.averageRatings.fun.toFixed(1)}
                />
                <StatCard label="Bugs reported" value={analytics.totalBugs} />
                <StatCard
                  label="Avg hours played"
                  value={analytics.averageHoursPlayed.toFixed(1)}
                />
              </StatCardGrid>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Average ratings</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <RatingsBarChart ratings={analytics.averageRatings} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Sentiment</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <SentimentDonut breakdown={analytics.sentimentBreakdown} />
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Rating detail</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 pt-0 sm:grid-cols-2">
                  <RatingBar label="Fun" value={analytics.averageRatings.fun} />
                  <RatingBar label="Difficulty" value={analytics.averageRatings.difficulty} />
                  <RatingBar label="Clarity" value={analytics.averageRatings.clarity} />
                  <RatingBar label="Performance" value={analytics.averageRatings.performance} />
                  <RatingBar label="Polish" value={analytics.averageRatings.polish} />
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
