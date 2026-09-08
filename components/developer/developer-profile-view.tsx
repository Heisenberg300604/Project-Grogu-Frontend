"use client";

import { Building2, Gamepad2, Globe, MapPin, MessageSquareText } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { STUDIO_SIZE_LABELS } from "@/lib/constants";
import {
  useDeveloperGames,
  useDeveloperPlaytests,
  useDeveloperProfile,
  useDeveloperStats,
} from "@/lib/hooks/use-grogu";
import { useSession } from "@/lib/hooks/use-session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";
import { UserAvatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";

export function DeveloperProfileView() {
  const { user } = useSession();
  const data = useDeveloperProfile(user?.id);
  const stats = useDeveloperStats(user?.id);
  const games = useDeveloperGames(user?.id);
  const playtests = useDeveloperPlaytests(user?.id);

  if (!user || !data) {
    return (
      <EmptyState
        title="Profile unavailable"
        description="Sign in as a developer to view your studio profile."
      />
    );
  }

  const { profile } = data;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Studio profile"
        description="This is what testers see on your playtests."
      />

      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <UserAvatar name={profile.studioName} className="size-16 text-lg" />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold">{profile.studioName}</h2>
            <p className="text-sm text-muted-foreground">
              Led by {user.name} · joined {formatDate(user.joinedAt)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{user.bio}</p>
          </div>
        </div>
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Building2 className="size-3.5" aria-hidden />
            {STUDIO_SIZE_LABELS[profile.studioSize]} · founded {profile.foundedYear}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-3.5" aria-hidden />
            {user.location}
          </div>
          {profile.website && (
            <div className="flex items-center gap-2">
              <Globe className="size-3.5" aria-hidden />
              {profile.website.replace(/^https?:\/\//, "")}
            </div>
          )}
        </dl>
      </Card>

      <StatCardGrid>
        <StatCard label="Games" value={stats.games} icon={Gamepad2} />
        <StatCard label="Playtests run" value={playtests.length} />
        <StatCard label="Testers worked with" value={stats.acceptedTesters} />
        <StatCard label="Feedback received" value={stats.feedbackCount} icon={MessageSquareText} />
      </StatCardGrid>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Games</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border pt-0">
          {games.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">No games yet.</p>
          ) : (
            games.map((game) => (
              <div key={game.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{game.title}</p>
                  <p className="text-xs text-muted-foreground">{game.tagline}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {playtests.filter((p) => p.gameId === game.id).length} playtests
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
