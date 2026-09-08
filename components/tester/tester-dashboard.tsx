"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardList, Compass, FileText } from "lucide-react";

import {
  useApplicationsByTester,
  useDiscoverPlaytests,
  usePlaytests,
  useTesterProfile,
  useTesterTests,
} from "@/lib/hooks/use-grogu";
import { EMPTY_DISCOVER_FILTERS } from "@/lib/domain";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";
import { ApplicationCard } from "@/components/applications/application-card";
import { TestProgressCard } from "@/components/tests/test-progress-card";

export function TesterDashboard() {
  const { user } = useSession();
  const profile = useTesterProfile(user?.id);
  const applications = useApplicationsByTester(user?.id);
  const allPlaytests = usePlaytests();
  const tests = useTesterTests(user?.id);
  const recommended = useDiscoverPlaytests(EMPTY_DISCOVER_FILTERS);

  if (!user) return null;

  const activeTests = tests.filter((t) => t.progress?.stage !== "completed");
  const completedTests = tests.filter((t) => t.progress?.stage === "completed");
  const pending = applications.filter((a) => a.status === "pending");
  const appliedPlaytestIds = new Set(applications.map((a) => a.playtestId));
  const suggestions = recommended
    .filter((p) => !appliedPlaytestIds.has(p.id))
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Your playtests, applications, and a few games that might suit you."
        actions={
          <Button asChild>
            <Link href="/discover">
              <Compass className="size-4" /> Discover playtests
            </Link>
          </Button>
        }
      />

      <StatCardGrid>
        <StatCard
          label="Reputation"
          value={profile ? profile.profile.reputation : "—"}
          hint={
            profile
              ? `${profile.profile.completedPlaytests} playtests completed`
              : undefined
          }
          icon={CheckCircle2}
        />
        <StatCard label="Active tests" value={activeTests.length} icon={ClipboardList} />
        <StatCard label="Pending applications" value={pending.length} icon={FileText} />
        <StatCard label="Completed" value={completedTests.length} icon={CheckCircle2} />
      </StatCardGrid>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Continue testing</h2>
          <Button asChild variant="link" size="sm">
            <Link href="/tests">All tests</Link>
          </Button>
        </div>
        {activeTests.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No active tests yet"
            description="Once a developer accepts you, your test workspace shows up here."
            action={
              <Button asChild size="sm" variant="secondary">
                <Link href="/discover">Browse playtests</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {activeTests.slice(0, 3).map((test) => (
              <TestProgressCard key={test.playtest.id} test={test} />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent applications</h2>
            <Button asChild variant="link" size="sm">
              <Link href="/applications">View all</Link>
            </Button>
          </div>
          {applications.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="You haven't applied yet"
              description="Applications you send will be tracked here."
            />
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 3).map((application) => {
                const playtest = allPlaytests.find(
                  (p) => p.id === application.playtestId,
                );
                if (!playtest) return null;
                return (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    playtest={playtest}
                  />
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Recommended for you</h2>
          {suggestions.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="Nothing new right now"
              description="You've applied to everything that's open. Check back soon."
            />
          ) : (
            <div className="space-y-3">
              {suggestions.map((playtest) => (
                <Card key={playtest.id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{playtest.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {playtest.game.title} · ~
                        {playtest.requirements.estimatedHours}h
                      </p>
                    </div>
                    <Button asChild size="sm" variant="secondary">
                      <Link href={`/playtests/${playtest.id}`}>View</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
