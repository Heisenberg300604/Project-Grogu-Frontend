import {
  CalendarClock,
  Clock,
  Gauge,
  Gift,
  Globe,
  MonitorSmartphone,
  ShieldCheck,
  Star,
} from "lucide-react";

import { formatDate } from "@/lib/utils";
import {
  EXPERIENCE_LABELS,
  GENRE_LABELS,
  PLATFORM_LABELS,
} from "@/lib/constants";
import type { Playtest, TesterRequirements } from "@/lib/types";

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="min-w-0">
        <dt className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd className="text-sm text-foreground">{value}</dd>
      </div>
    </div>
  );
}

export function RequirementsList({
  requirements,
  playtest,
}: {
  requirements: TesterRequirements;
  playtest: Playtest;
}) {
  return (
    <dl className="divide-y divide-border">
      <Row icon={Gift} label="Reward" value={playtest.reward} />
      <Row
        icon={Gauge}
        label="Experience"
        value={`${EXPERIENCE_LABELS[requirements.minExperienceLevel]} or above`}
      />
      <Row
        icon={MonitorSmartphone}
        label="Platforms"
        value={requirements.platforms.map((p) => PLATFORM_LABELS[p]).join(", ")}
      />
      {requirements.preferredGenres.length > 0 && (
        <Row
          icon={Star}
          label="Genre familiarity"
          value={requirements.preferredGenres
            .map((g) => GENRE_LABELS[g])
            .join(", ")}
        />
      )}
      <Row
        icon={Globe}
        label="Languages"
        value={requirements.languages.join(", ")}
      />
      <Row
        icon={Star}
        label="Minimum reputation"
        value={`${requirements.minReputation} / 100`}
      />
      <Row
        icon={Clock}
        label="Estimated time"
        value={`~${requirements.estimatedHours} hours total`}
      />
      <Row
        icon={CalendarClock}
        label="Applications close"
        value={formatDate(playtest.closesAt)}
      />
      <Row
        icon={ShieldCheck}
        label="NDA"
        value={requirements.ndaRequired ? "Required before access" : "Not required"}
      />
    </dl>
  );
}
