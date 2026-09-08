"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";

import { useTesterTests } from "@/lib/hooks/use-grogu";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { PageHeader } from "@/components/layout/page-header";
import { TestProgressCard } from "@/components/tests/test-progress-card";

export function TestsListView() {
  const { user } = useSession();
  const tests = useTesterTests(user?.id);

  if (!user) return null;

  const active = tests.filter((t) => t.progress?.stage !== "completed");
  const completed = tests.filter((t) => t.progress?.stage === "completed");

  return (
    <div className="space-y-8">
      <PageHeader
        title="My tests"
        description="Playtests you've been accepted to. Work through the tasks, then submit feedback."
      />

      {tests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="You're not on any playtests yet"
          description="When a developer accepts your application, the test workspace appears here."
          action={
            <Button asChild size="sm">
              <Link href="/discover">Browse playtests</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Active ({active.length})
            </h2>
            {active.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing active right now.
              </p>
            ) : (
              active.map((test) => (
                <TestProgressCard key={test.playtest.id} test={test} />
              ))
            )}
          </section>

          {completed.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Completed ({completed.length})
              </h2>
              {completed.map((test) => (
                <TestProgressCard key={test.playtest.id} test={test} />
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
