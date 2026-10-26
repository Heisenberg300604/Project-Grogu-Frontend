import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Gamepad2,
  MapPin,
  Star,
} from "lucide-react";

import { formatDate } from "@/lib/utils";
import {
  EXPERIENCE_LABELS,
  GENRE_LABELS,
  PLATFORM_LABELS,
} from "@/lib/constants";
import type { TesterDirectoryEntry } from "@/lib/domain";
import { Badge } from "@/components/ui/badge";
import { LevelProgress } from "@/components/tester/level-progress";
import { UserAvatar } from "@/components/ui/avatar";
import { StatCard, StatCardGrid } from "@/components/dashboard/stat-card";

function SkillGroup({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <p className="text-label text-subtle-foreground">{label}</p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {values.length === 0 ? (
          <span className="text-sm text-muted-foreground">Not listed</span>
        ) : (
          values.map((value) => (
            <Badge key={value} tone="muted" size="md">
              {value}
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * A tester as the public sees them. Deliberately limited to what the public
 * API returns: identity, reputation, headline numbers and skills. Testing
 * history and individual feedback stay private to the tester and the studios
 * they have tested for.
 */
export function TesterPublicProfile({ entry }: { entry: TesterDirectoryEntry }) {
  const { user, profile } = entry;

  return (
    <div className="space-y-10">
      <Link
        href="/testers"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> All testers
      </Link>

      <section className="overflow-hidden rounded-2xl border-2 border-line bg-surface shadow-md">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <UserAvatar
            name={user.name}
            src={user.avatarUrl}
            className="size-20 text-xl"
          />

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-2xl font-bold">{user.name}</h1>
              <Badge tone="primary" size="md">
                <Gamepad2 /> Game tester
              </Badge>
            </div>
            <p className="flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
              <span>@{user.handle}</span>
              {user.location && (
                <>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" aria-hidden />
                    {user.location}
                  </span>
                </>
              )}
              <span aria-hidden>·</span>
              <span>joined {formatDate(user.joinedAt)}</span>
            </p>
            {user.bio && (
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {user.bio}
              </p>
            )}
          </div>

          <div className="shrink-0 rounded-xl border-2 border-line bg-primary px-6 py-4 text-center text-primary-foreground shadow-sm">
            <p className="font-display text-4xl font-extrabold tabular-nums">
              {profile.reputation}
            </p>
            <p className="hud mt-1.5">Reputation</p>
            <p className="mt-1 text-xs font-semibold">Level {profile.level}</p>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-border px-6 py-4 sm:px-8">
          <LevelProgress profile={profile} />
        </div>
      </section>

      <StatCardGrid>
        <StatCard
          label="Completed playtests"
          value={profile.completedPlaytests}
          icon={CheckCircle2}
        />
        <StatCard
          label="Avg feedback rating"
          value={
            profile.completedPlaytests > 0
              ? profile.averageFeedbackRating.toFixed(1)
              : "—"
          }
          hint={EXPERIENCE_LABELS[profile.experienceLevel]}
          icon={Star}
        />
        <StatCard
          label="Weekly availability"
          value={`${profile.weeklyAvailabilityHours}h`}
          icon={Clock}
        />
      </StatCardGrid>

      <div className="grid gap-10 lg:grid-cols-[1fr_19rem]">
        <section className="space-y-5">
          <h2 className="font-display text-lg font-bold">Skills</h2>
          <SkillGroup
            label="Platforms"
            values={profile.platforms.map((p) => PLATFORM_LABELS[p])}
          />
          <SkillGroup
            label="Genres"
            values={profile.preferredGenres.map((g) => GENRE_LABELS[g])}
          />
          <SkillGroup label="Languages" values={profile.languages} />
        </section>

        <aside className="space-y-4">
          <h2 className="font-display text-lg font-bold">Badges</h2>
          {profile.badges.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No badges earned yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {profile.badges.map((badge) => (
                <li
                  key={badge}
                  className="flex items-center gap-3 rounded-lg border-2 border-line bg-surface px-3.5 py-2.5"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-md border-2 border-line bg-primary text-primary-foreground">
                    <Award className="size-3.5" aria-hidden />
                  </span>
                  <span className="text-sm font-medium">{badge}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
