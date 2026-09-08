"use client";

import Link from "next/link";
import { ListChecks, Plus, Users } from "lucide-react";

import { formatDeadline } from "@/lib/utils";
import type { PlaytestStatus } from "@/lib/types";
import { useDeveloperPlaytests } from "@/lib/hooks/use-grogu";
import { useGroguStore } from "@/lib/store/grogu-store";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";

const FILTERS: { value: PlaytestStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "recruiting", label: "Recruiting" },
  { value: "in-progress", label: "In progress" },
  { value: "review", label: "In review" },
  { value: "completed", label: "Completed" },
  { value: "draft", label: "Drafts" },
];

export function PlaytestsView() {
  const { user } = useSession();
  const playtests = useDeveloperPlaytests(user?.id);
  const applications = useGroguStore((s) => s.applications);
  const feedback = useGroguStore((s) => s.feedback);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Playtests"
        description="Every playtest across your games."
        actions={
          <Button asChild>
            <Link href="/developer/playtests/new">
              <Plus className="size-4" /> New playtest
            </Link>
          </Button>
        }
      />

      {playtests.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No playtests yet"
          description="Create your first playtest to start recruiting testers."
          action={
            <Button asChild size="sm">
              <Link href="/developer/playtests/new">New playtest</Link>
            </Button>
          }
        />
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            {FILTERS.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {FILTERS.map((f) => {
            const list =
              f.value === "all"
                ? playtests
                : playtests.filter((p) => p.status === f.value);
            return (
              <TabsContent key={f.value} value={f.value} className="space-y-3">
                {list.length === 0 ? (
                  <EmptyState title={`No ${f.label.toLowerCase()} playtests`} />
                ) : (
                  list.map((playtest) => {
                    const pending = applications.filter(
                      (a) => a.playtestId === playtest.id && a.status === "pending",
                    ).length;
                    const accepted = applications.filter(
                      (a) => a.playtestId === playtest.id && a.status === "accepted",
                    ).length;
                    const fb = feedback.filter(
                      (x) => x.playtestId === playtest.id,
                    ).length;
                    return (
                      <Card key={playtest.id} className="p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <StatusBadge kind="playtest" status={playtest.status} />
                              <span className="text-xs text-muted-foreground">
                                {playtest.game.title} · {formatDeadline(playtest.closesAt)}
                              </span>
                            </div>
                            <h3 className="mt-1 font-display text-sm font-semibold">
                              <Link
                                href={`/developer/playtests/${playtest.id}`}
                                className="hover:text-secondary"
                              >
                                {playtest.title}
                              </Link>
                            </h3>
                          </div>
                          <Button asChild size="sm" variant="secondary">
                            <Link href={`/developer/playtests/${playtest.id}`}>Manage</Link>
                          </Button>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Users className="size-3.5" /> {accepted}/{playtest.maxTesters} testers
                          </span>
                          {pending > 0 && (
                            <span className="text-warning">{pending} awaiting review</span>
                          )}
                          <span>{fb} feedback</span>
                          <span className="flex-1" />
                          <span className="w-28">
                            <Progress
                              value={(accepted / Math.max(1, playtest.maxTesters)) * 100}
                            />
                          </span>
                        </div>
                      </Card>
                    );
                  })
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}
