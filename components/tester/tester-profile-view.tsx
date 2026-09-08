"use client";

import { Award, CheckCircle2, Clock, Star } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { overallRating } from "@/lib/domain";
import {
  EXPERIENCE_LABELS,
  GENRE_LABELS,
  PLATFORM_LABELS,
} from "@/lib/constants";
import {
  useGroguStore,
} from "@/lib/store/grogu-store";
import { useTesterProfile, useTesterTests } from "@/lib/hooks/use-grogu";
import { useSession } from "@/lib/hooks/use-session";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { UserAvatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";
import { RatingStars } from "@/components/feedback/rating";

export function TesterProfileView() {
  const { user } = useSession();
  const data = useTesterProfile(user?.id);
  const tests = useTesterTests(user?.id);
  const feedback = useGroguStore((s) => s.feedback);

  if (!user || !data) {
    return (
      <EmptyState title="Profile unavailable" description="Sign in as a tester to view your profile." />
    );
  }

  const { profile } = data;
  const myFeedback = feedback
    .filter((f) => f.testerId === user.id)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  const completed = tests.filter((t) => t.progress?.stage === "completed");
  const completionRate =
    tests.length > 0 ? Math.round((completed.length / tests.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <PageHeader title="Tester profile" description="This is what developers see when they review your application." />

      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <UserAvatar name={user.name} src={user.avatarUrl} className="size-16 text-lg" />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">
              @{user.handle} · {user.location} · joined {formatDate(user.joinedAt)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{user.bio}</p>
          </div>
          <div className="shrink-0 text-center">
            <p className="font-display text-3xl font-semibold text-secondary">
              {profile.reputation}
            </p>
            <p className="text-xs text-muted-foreground">reputation</p>
          </div>
        </div>
      </Card>

      <StatCardGrid>
        <StatCard
          label="Playtests completed"
          value={profile.completedPlaytests}
          icon={CheckCircle2}
        />
        <StatCard label="Completion rate" value={`${completionRate || 100}%`} icon={Clock} />
        <StatCard
          label="Avg feedback rating"
          value={profile.averageFeedbackRating.toFixed(1)}
          icon={Star}
        />
        <StatCard
          label="Experience"
          value={EXPERIENCE_LABELS[profile.experienceLevel]}
          icon={Award}
        />
      </StatCardGrid>

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Testing history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {myFeedback.length === 0 ? (
              <EmptyState
                title="No completed playtests yet"
                description="Finish a playtest and submit feedback to build your history."
              />
            ) : (
              myFeedback.map((f) => {
                const playtest = tests.find((t) => t.playtest.id === f.playtestId)?.playtest;
                return (
                  <div
                    key={f.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {playtest?.title ?? "Playtest"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {playtest?.game.title ?? ""} · {f.hoursPlayed}h · submitted{" "}
                        {formatDate(f.submittedAt)}
                      </p>
                    </div>
                    <RatingStars value={overallRating(f.ratings)} />
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Badges</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5 pt-0">
              {profile.badges.map((badge) => (
                <Badge key={badge} tone="primary">
                  <Award className="size-3" /> {badge}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Genres
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {profile.preferredGenres.map((g) => (
                    <Badge key={g} tone="muted">
                      {GENRE_LABELS[g]}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Platforms
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {profile.platforms.map((p) => (
                    <Badge key={p} tone="muted">
                      {PLATFORM_LABELS[p]}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Availability
                </p>
                <p className="mt-1 text-muted-foreground">
                  {profile.weeklyAvailabilityHours}h / week ·{" "}
                  {profile.languages.join(", ")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
