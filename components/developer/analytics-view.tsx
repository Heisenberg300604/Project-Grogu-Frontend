"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquareText } from "lucide-react";

import { averageRatings } from "@/lib/domain";
import {
  useDeveloperFeedback,
  useDeveloperPlaytests,
} from "@/lib/hooks/use-grogu";
import { useSession } from "@/lib/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";
import { RatingsBarChart } from "@/components/charts/ratings-bar-chart";
import { SentimentDonut } from "@/components/charts/sentiment-donut";
import { FeedbackCard } from "@/components/feedback/feedback-card";

function tally(items: string[]) {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = item.toLowerCase();
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

export function AnalyticsView() {
  const { user } = useSession();
  const playtests = useDeveloperPlaytests(user?.id);
  const allFeedback = useDeveloperFeedback(user?.id);
  const [scope, setScope] = useState<string>("all");

  const rows = useMemo(
    () =>
      scope === "all"
        ? allFeedback
        : allFeedback.filter((f) => f.playtest.id === scope),
    [allFeedback, scope],
  );

  if (!user) return null;

  const feedbackEntries = rows.map((r) => r.feedback);
  const avg = averageRatings(feedbackEntries);
  const sentiment = {
    positive: feedbackEntries.filter((f) => f.sentiment === "positive").length,
    neutral: feedbackEntries.filter((f) => f.sentiment === "neutral").length,
    negative: feedbackEntries.filter((f) => f.sentiment === "negative").length,
  };
  const painPoints = tally(feedbackEntries.flatMap((f) => f.painPoints));
  const bugs = tally(feedbackEntries.flatMap((f) => f.bugs));
  const recommendRate = feedbackEntries.length
    ? Math.round(
        (feedbackEntries.filter((f) => f.wouldRecommend).length /
          feedbackEntries.length) *
          100,
      )
    : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Feedback & analytics"
        description="Aggregated feedback across your playtests."
        actions={
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All playtests</SelectItem>
              {playtests.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {feedbackEntries.length === 0 ? (
        <EmptyState
          icon={MessageSquareText}
          title="No feedback to analyse yet"
          description="Analytics appear once your testers start submitting feedback."
          action={
            <Button asChild size="sm" variant="secondary">
              <Link href="/developer/playtests">View playtests</Link>
            </Button>
          }
        />
      ) : (
        <>
          <StatCardGrid>
            <StatCard label="Responses" value={feedbackEntries.length} />
            <StatCard label="Avg enjoyment" value={avg.fun.toFixed(1)} />
            <StatCard label="Would recommend" value={`${recommendRate}%`} />
            <StatCard
              label="Bugs reported"
              value={feedbackEntries.reduce((n, f) => n + f.bugs.length, 0)}
            />
          </StatCardGrid>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Average ratings</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <RatingsBarChart ratings={avg} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sentiment</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <SentimentDonut breakdown={sentiment} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Common pain points</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {painPoints.length === 0 ? (
                  <p className="text-sm text-muted-foreground">None reported.</p>
                ) : (
                  <ul className="space-y-2">
                    {painPoints.map((item) => (
                      <li
                        key={item.text}
                        className="flex items-start justify-between gap-3 text-sm"
                      >
                        <span className="text-muted-foreground first-letter:uppercase">
                          {item.text}
                        </span>
                        <span className="shrink-0 rounded-full bg-muted px-2 text-xs text-muted-foreground">
                          ×{item.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reported bugs</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {bugs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">None reported.</p>
                ) : (
                  <ul className="space-y-2">
                    {bugs.map((item) => (
                      <li
                        key={item.text}
                        className="flex items-start justify-between gap-3 text-sm"
                      >
                        <span className="text-muted-foreground first-letter:uppercase">
                          {item.text}
                        </span>
                        <span className="shrink-0 rounded-full bg-destructive/15 px-2 text-xs text-destructive">
                          ×{item.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Qualitative feedback</h2>
            {rows.slice(0, 8).map((row) => (
              <FeedbackCard key={row.feedback.id} feedback={row.feedback} tester={row.tester} />
            ))}
          </section>
        </>
      )}
    </div>
  );
}
