"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  ExternalLink,
  Lock,
} from "lucide-react";

import { testCompletion } from "@/lib/domain";
import { formatDate } from "@/lib/utils";
import {
  usePlaytest,
  useTestProgress,
  useTesterApplication,
} from "@/lib/hooks/use-grogu";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useSession } from "@/lib/hooks/use-session";
import { testsService } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, PageSkeleton } from "@/components/ui/states";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { TaskList } from "@/components/playtests/task-list";
import { WorkflowStepper } from "@/components/tests/workflow-stepper";

export function Workspace({ playtestId }: { playtestId: string }) {
  const hydrated = useHydrated();
  const { user } = useSession();
  const playtest = usePlaytest(playtestId);
  const application = useTesterApplication(user?.id, playtestId);
  const progress = useTestProgress(user?.id, playtestId);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  if (!hydrated || !user) return <PageSkeleton />;

  if (!playtest || !application || application.status !== "accepted") {
    return (
      <EmptyState
        icon={Lock}
        title="You don't have access to this test"
        description="Only testers accepted to this playtest can open the workspace."
        action={
          <Button asChild size="sm" variant="secondary">
            <Link href="/tests">Back to my tests</Link>
          </Button>
        }
      />
    );
  }

  const stage = progress?.stage ?? "not-started";
  const completion = testCompletion(progress, playtest);
  const buildDownloaded = progress?.buildDownloaded ?? false;
  const requiredDone = completion.total > 0 && completion.done === completion.total;
  const feedbackSubmitted = stage === "completed" || stage === "feedback-submitted";

  async function handleDownload() {
    setDownloading(true);
    try {
      await testsService.downloadBuild(playtestId, user!.id);
    } finally {
      setDownloading(false);
    }
  }

  async function handleToggle(taskId: string) {
    setPendingTaskId(taskId);
    try {
      await testsService.toggleTask(playtestId, user!.id, taskId);
    } finally {
      setPendingTaskId(null);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[
          { label: "My tests", href: "/tests" },
          { label: playtest.game.title },
        ]}
        title={playtest.title}
        description={`${playtest.game.title} · ${playtest.developer.name}`}
        actions={<StatusBadge kind="test" status={stage} />}
      />

      <Card className="p-5">
        <WorkflowStepper stage={stage} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-6">
          {/* Build access */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">1 · Get the build</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <p className="text-sm text-muted-foreground">
                {playtest.requirements.ndaRequired
                  ? "This build is under NDA. Don't share it, stream it, or post screenshots."
                  : "Download the current build and keep it updated during the test."}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={handleDownload} loading={downloading} disabled={buildDownloaded}>
                  <Download className="size-4" />
                  {buildDownloaded ? "Build downloaded" : "Download build"}
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <a href={playtest.buildUrl} target="_blank" rel="noreferrer">
                    Build page <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Build {playtest.game.buildVersion} · updated{" "}
                {formatDate(playtest.game.updatedAt)}
              </p>
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-2">
              <CardTitle className="text-base">2 · Complete the tasks</CardTitle>
              <span className="text-xs text-muted-foreground">
                {completion.done}/{completion.total} required
              </span>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <Progress value={requiredDone ? 100 : Math.round(completion.ratio * 100)} />
              {!buildDownloaded ? (
                <p className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted-foreground">
                  Download the build to start checking off tasks.
                </p>
              ) : (
                <TaskList
                  tasks={playtest.tasks}
                  completedIds={progress?.completedTaskIds ?? []}
                  onToggle={handleToggle}
                  pendingId={pendingTaskId}
                />
              )}
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">3 · Submit feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {feedbackSubmitted ? (
                <div className="flex items-start gap-3 rounded-md border border-success/30 bg-success/10 p-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Feedback submitted</p>
                    <p className="text-muted-foreground">
                      Thanks — {playtest.developer.name} can see your report now.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    {requiredDone
                      ? "You've finished the required tasks. Share your structured feedback."
                      : "Finish the required tasks above to unlock the feedback form."}
                  </p>
                  {requiredDone ? (
                    <Button asChild>
                      <Link href={`/tests/${playtest.id}/feedback`}>
                        Open feedback form <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled>
                      Open feedback form <ArrowRight className="size-4" />
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-semibold">Playtest goals</p>
            <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              {playtest.goals.map((goal) => (
                <li key={goal} className="flex gap-1.5">
                  <span aria-hidden className="text-secondary">
                    •
                  </span>
                  {goal}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Deadline</p>
            <p className="mt-1">{formatDate(playtest.closesAt)}</p>
            <p className="mt-3 font-semibold text-foreground">Need help?</p>
            <p className="mt-1">
              Message the developer from the{" "}
              <Link href={`/playtests/${playtest.id}`} className="text-secondary hover:underline">
                playtest page
              </Link>
              .
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
