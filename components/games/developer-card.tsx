import { Building2, Globe, MapPin } from "lucide-react";

import { STUDIO_SIZE_LABELS } from "@/lib/constants";
import type { DeveloperProfile, User } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/avatar";

export function DeveloperCard({
  user,
  profile,
}: {
  user: User;
  profile?: DeveloperProfile;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <UserAvatar name={user.name} src={user.avatarUrl} className="size-11" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {profile?.studioName ?? user.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Led by {user.name}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p>
      <dl className="mt-4 space-y-2 text-xs text-muted-foreground">
        {profile && (
          <div className="flex items-center gap-2">
            <Building2 className="size-3.5" aria-hidden />
            <dt className="sr-only">Studio size</dt>
            <dd>
              {STUDIO_SIZE_LABELS[profile.studioSize]} studio · founded{" "}
              {profile.foundedYear}
            </dd>
          </div>
        )}
        <div className="flex items-center gap-2">
          <MapPin className="size-3.5" aria-hidden />
          <dt className="sr-only">Location</dt>
          <dd>{user.location}</dd>
        </div>
        {profile?.website && (
          <div className="flex items-center gap-2">
            <Globe className="size-3.5" aria-hidden />
            <dt className="sr-only">Website</dt>
            <dd className="truncate">{profile.website.replace(/^https?:\/\//, "")}</dd>
          </div>
        )}
      </dl>
    </Card>
  );
}
