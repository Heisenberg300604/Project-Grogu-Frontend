"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Circle,
  Gift,
  Hourglass,
  Mail,
  Smartphone,
  Star,
  TrendingUp,
} from "lucide-react";

import type { ReputationCategory, ReputationRule } from "@/lib/types";
import { cn, formatRelativeTime, formatRupees } from "@/lib/utils";
import { REVIEW_STATUS_META } from "@/lib/constants";
import { rewardSummary } from "@/lib/domain";
import {
  useLedgerEntries,
  usePlaytests,
  useReputationEvents,
  useReputationLevels,
  useReputationRules,
  useTesterProfile,
  useWallet,
} from "@/lib/hooks/use-grogu";
import { useGroguStore } from "@/lib/store/grogu-store";
import { useSession } from "@/lib/hooks/use-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import { PageHeader, SectionTitle } from "@/components/layout/page-header";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";
import { LevelProgress, levelLabel } from "@/components/tester/level-progress";

const CATEGORY_LABELS: Record<Exclude<ReputationCategory, "other">, string> = {
  profile: "Complete your profile",
  participation: "Take part",
  review: "Write useful reviews",
};

function ruleAmount(rule: ReputationRule) {
  if (rule.variable) return rule.maxAmount ? `up to +${rule.maxAmount}` : "varies";
  return `+${rule.amount}`;
}

/** Panel with a heading, used for the side-by-side blocks on this page. */
function Panel({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon: typeof Banknote;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    // min-w-0: as a grid item it would otherwise grow to fit long ledger notes.
    <section className={cn("min-w-0 rounded-xl border-2 border-line bg-surface p-5 sm:p-6", className)}>
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-lg bg-primary-soft text-secondary">
          <Icon className="size-4" aria-hidden />
        </span>
        <p className="text-label text-secondary">{label}</p>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/**
 * The tester's rewards: money from approved reviews (a ledger balance, no
 * payouts yet), reputation and level, how to earn more, and what each review
 * earned. Everything here comes from the server; nothing is computed locally
 * except grouping.
 */
export function RewardsView() {
  const { user } = useSession();
  const profile = useTesterProfile(user?.id);
  const wallet = useWallet();
  const ledger = useLedgerEntries();
  const events = useReputationEvents();
  const rules = useReputationRules();
  const levels = useReputationLevels();
  const playtests = usePlaytests();
  const allFeedback = useGroguStore((s) => s.feedback);

  const myFeedback = useMemo(
    () =>
      allFeedback
        .filter((f) => f.testerId === user?.id)
        .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)),
    [allFeedback, user?.id],
  );
  const earnedReasons = useMemo(() => new Set(events.map((e) => e.reason)), [events]);
  const playtestTitle = (id: string | null) =>
    playtests.find((p) => p.id === id)?.title ?? null;

  if (!user) return null;

  const approved = myFeedback.filter((f) => f.reviewStatus === "approved");
  const awaiting = myFeedback.filter((f) => f.reviewStatus === "submitted");
  const balance = wallet?.balance ?? 0;
  const rulesByCategory = (["profile", "participation", "review"] as const).map((category) => ({
    category,
    rules: rules.filter((r) => r.category === category),
  }));

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Tester rewards"
        title="Your rewards and reputation"
        description="Studios reward approved reviews with reputation, game keys and cash. Here's what you've earned and how to earn more."
        actions={
          <Button asChild variant="secondary">
            <Link href="/discover">
              Find more playtests <ArrowRight />
            </Link>
          </Button>
        }
      />

      <StatCardGrid>
        <StatCard
          label="Available balance"
          value={formatRupees(balance)}
          icon={Banknote}
          emphasis={balance > 0}
        />
        <StatCard
          label="Reputation"
          value={profile?.profile.reputation ?? "—"}
          icon={Star}
          hint={profile ? levelLabel(profile.profile) : undefined}
        />
        <StatCard label="Reviews approved" value={approved.length} icon={CheckCircle2} />
        <StatCard
          label="Awaiting review"
          value={awaiting.length}
          icon={Hourglass}
          hint={awaiting.length > 0 ? "Rewards arrive on approval" : undefined}
        />
      </StatCardGrid>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel icon={Banknote} label="UPI BALANCE">
          <p className="font-display text-3xl font-bold tabular-nums">{formatRupees(balance)}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Cash rewards from approved reviews. Payouts aren&apos;t live yet: your balance is
            recorded and will be sent to your UPI ID when they launch.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-line bg-elevated p-3.5">
            <div className="flex min-w-0 items-start gap-2.5">
              <Smartphone className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
              <div className="min-w-0">
                <p className="text-xs text-subtle-foreground">UPI ID</p>
                <p className="truncate text-sm font-medium">
                  {wallet?.upiId || "Not set"}
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="secondary">
              <Link href="/profile/edit">{wallet?.upiId ? "Change" : "Add UPI ID"}</Link>
            </Button>
          </div>
          {ledger.length > 0 && (
            <ul className="mt-5 divide-y divide-border border-t-2 border-dashed border-border">
              {ledger.slice(0, 6).map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate text-foreground">
                      {entry.note || playtestTitle(entry.playtestId) || "Reward"}
                    </span>
                    <span className="text-xs text-subtle-foreground">
                      {formatRelativeTime(entry.createdAt)}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-medium tabular-nums",
                      entry.amount > 0 ? "text-success" : "text-foreground",
                    )}
                  >
                    {entry.amount > 0 ? "+" : "−"}
                    {formatRupees(Math.abs(entry.amount))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel icon={TrendingUp} label="LEVEL">
          {profile ? (
            <LevelProgress profile={profile.profile} />
          ) : (
            <p className="text-sm text-muted-foreground">Your level appears once your profile loads.</p>
          )}
          {levels.length > 0 && (
            <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {levels.map((level) => {
                const current = profile?.profile.level === level.level;
                const reached = (profile?.profile.level ?? 0) >= level.level;
                return (
                  <li
                    key={level.level}
                    aria-current={current ? "step" : undefined}
                    className={cn(
                      "rounded-lg border-2 px-2.5 py-2 text-xs",
                      current
                        ? "border-line bg-primary text-primary-foreground shadow-sm"
                        : reached
                          ? "border-border text-foreground"
                          : "border-border text-subtle-foreground",
                    )}
                  >
                    <p className="font-semibold">
                      {level.level}. {level.title}
                    </p>
                    <p className="tabular-nums">{level.minReputation}+</p>
                  </li>
                );
              })}
            </ol>
          )}
        </Panel>
      </div>

      {rules.length > 0 && (
        <section className="space-y-5">
          <SectionTitle
            title="Ways to earn reputation"
            description="Reputation decides your level, and studios use it to choose testers."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {rulesByCategory.map(({ category, rules: list }) =>
              list.length === 0 ? null : (
                <div key={category} className="rounded-xl border-2 border-line bg-surface p-4">
                  <p className="text-sm font-semibold">{CATEGORY_LABELS[category]}</p>
                  <ul className="mt-3 space-y-3">
                    {list.map((rule) => {
                      // Profile bonuses are once-only, so they can be ticked off.
                      const done = category === "profile" && earnedReasons.has(rule.reason);
                      return (
                        <li key={rule.reason} className="flex gap-2.5 text-sm">
                          {done ? (
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-label="Done" />
                          ) : (
                            <Circle className="mt-0.5 size-4 shrink-0 text-subtle-foreground" aria-hidden />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="flex flex-wrap items-baseline justify-between gap-x-2">
                              <span className={cn("font-medium", done && "text-muted-foreground")}>
                                {rule.label}
                              </span>
                              <span className="text-xs font-semibold tabular-nums text-secondary">
                                {ruleAmount(rule)}
                              </span>
                            </p>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {rule.description}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ),
            )}
          </div>
        </section>
      )}

      <section className="space-y-5">
        <SectionTitle
          title="Your reviews"
          description="Rewards are issued when the studio approves a review."
        />
        {myFeedback.length === 0 ? (
          <EmptyState
            icon={Gift}
            title="No reviews yet"
            description="Finish a playtest and submit feedback. When the studio approves it, your rewards show up here."
            action={
              <Button asChild size="sm">
                <Link href="/tests">Go to my tests</Link>
              </Button>
            }
          />
        ) : (
          <ul className="space-y-3">
            {myFeedback.map((feedback) => {
              const meta = REVIEW_STATUS_META[feedback.reviewStatus];
              const granted = rewardSummary(feedback.rewards);
              return (
                <li
                  key={feedback.id}
                  className="flex flex-col gap-3 rounded-xl border-2 border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                      <span className="text-xs text-subtle-foreground">
                        Submitted {formatRelativeTime(feedback.submittedAt)}
                      </span>
                    </div>
                    <p className="truncate font-medium">
                      {playtestTitle(feedback.playtestId) ?? "Playtest"}
                    </p>
                    {feedback.reviewStatus === "approved" && (
                      <p className="text-sm text-muted-foreground">
                        {granted ? `You earned ${granted}.` : "Approved without rewards."}
                      </p>
                    )}
                    {feedback.reviewNote && (
                      <p className="text-xs text-muted-foreground">&ldquo;{feedback.reviewNote}&rdquo;</p>
                    )}
                    {feedback.rewards.gameKey && (
                      <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <Mail className="mt-0.5 size-3 shrink-0" aria-hidden />
                        Your game key is on its way. Check your email.
                      </p>
                    )}
                  </div>
                  <Button asChild size="sm" variant="secondary" className="shrink-0">
                    <Link href={`/tests/${feedback.playtestId}`}>
                      Open test <ArrowRight />
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {events.length > 0 && (
        <section className="space-y-5">
          <SectionTitle title="Reputation history" description="Every change to your reputation." />
          <ul className="divide-y divide-border rounded-xl border-2 border-line bg-surface">
            {events.map((event) => {
              const title = playtestTitle(event.playtestId);
              return (
                <li key={event.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{event.label}</span>
                    <span className="block truncate text-xs text-subtle-foreground">
                      {[title, formatRelativeTime(event.createdAt)].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-semibold tabular-nums",
                      event.amount >= 0 ? "text-secondary" : "text-destructive",
                    )}
                  >
                    {event.amount >= 0 ? "+" : ""}
                    {event.amount}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
