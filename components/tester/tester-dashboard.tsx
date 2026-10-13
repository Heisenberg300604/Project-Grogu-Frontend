"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileText,
  Star,
} from "lucide-react";

import { greeting } from "@/lib/utils";
import { levelProgress } from "@/lib/domain";
import type { TesterProfile } from "@/lib/types";
import {
  useApplicationsByTester,
  usePlaytests,
  useTesterProfile,
  useTesterTests,
} from "@/lib/hooks/use-grogu";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { PageHeader, SectionTitle } from "@/components/layout/page-header";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";
import { ApplicationCard } from "@/components/applications/application-card";
import { TestProgressCard } from "@/components/tests/test-progress-card";
import { RecommendedPlaytests } from "@/components/tester/recommended-playtests";
import { LevelProgress } from "@/components/tester/level-progress";

function levelHint(profile: TesterProfile) {
  const { toNext } = levelProgress(profile);
  return toNext === null
    ? `Level ${profile.level}, the top level`
    : `Level ${profile.level} · ${toNext} to level ${profile.level + 1}`;
}

/**
 * The tester's home. Ordered by what needs doing: tests in flight first,
 * applications awaiting a decision second, discovery last.
 */
export function TesterDashboard() {
  const { user } = useSession();
  const profile = useTesterProfile(user?.id);
  const applications = useApplicationsByTester(user?.id);
  const allPlaytests = usePlaytests();
  const tests = useTesterTests(user?.id);

  if (!user) return null;

  const activeTests = tests.filter((t) => t.progress?.stage !== "completed");
  const completedTests = tests.filter((t) => t.progress?.stage === "completed");
  const pending = applications.filter((a) => a.status === "pending");

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow={greeting()}
        title={user.name.split(" ")[0]}
        description="Your playtests, applications, and a few games that might suit you."
        actions={
          <Button asChild size="lg">
            <Link href="/discover">
              <Compass /> Discover playtests
            </Link>
          </Button>
        }
      />

      <StatCardGrid>
        <StatCard
          label="Reputation"
          value={profile ? profile.profile.reputation : "—"}
          hint={profile ? levelHint(profile.profile) : undefined}
          icon={Star}
        />
        <StatCard
          label="Active tests"
          value={activeTests.length}
          icon={ClipboardList}
          emphasis={activeTests.length > 0}
        />
        <StatCard
          label="Applications"
          value={applications.length}
          hint={pending.length > 0 ? `${pending.length} awaiting a decision` : "None pending"}
          icon={FileText}
        />
        <StatCard
          label="Completed"
          value={completedTests.length}
          icon={CheckCircle2}
        />
      </StatCardGrid>

      {profile && (
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <LevelProgress profile={profile.profile} />
          </div>
          <Button asChild size="sm" variant="secondary" className="shrink-0">
            <Link href="/rewards">
              Ways to earn reputation <ArrowRight />
            </Link>
          </Button>
        </section>
      )}

      {/* ---- Active tests ------------------------------------------------- */}
      <section className="space-y-5">
        <SectionTitle
          title="Continue testing"
          description="Playtests you've been accepted to."
          action={
            activeTests.length > 0 && (
              <Button asChild variant="ghost" size="sm">
                <Link href="/tests">
                  All tests <ArrowRight />
                </Link>
              </Button>
            )
          }
        />
        {activeTests.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Nothing in progress"
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

      {/* ---- Applications ------------------------------------------------- */}
      <section className="space-y-5">
        <SectionTitle
          title="Recent applications"
          action={
            applications.length > 0 && (
              <Button asChild variant="ghost" size="sm">
                <Link href="/applications">
                  View all <ArrowRight />
                </Link>
              </Button>
            )
          }
        />
        {applications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="You haven't applied to any playtests yet"
            description="Applications you send will be tracked here with their status."
            action={
              <Button asChild size="sm" variant="secondary">
                <Link href="/discover">Find a playtest</Link>
              </Button>
            }
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

      {/* ---- Recommendations ---------------------------------------------- */}
      <RecommendedPlaytests testerId={user.id} />
    </div>
  );
}
