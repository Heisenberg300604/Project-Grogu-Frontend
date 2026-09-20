"use client";

import { useSession } from "@/lib/hooks/use-session";
import { useDeveloperProfile, useTesterProfile } from "@/lib/hooks/use-grogu";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { EmptyState, PageSkeleton } from "@/components/ui/states";
import {
  DeveloperProfileForm,
  TesterProfileForm,
} from "@/components/profile/profile-form";

/**
 * Route-level wrappers for the profile forms.
 *
 * The forms take `user` and `profile` as required props and seed React Hook
 * Form's `defaultValues` from them, so they must not mount until the data is
 * actually there — an uninitialised form would silently save empty fields over
 * a real profile.
 */

export function TesterProfileEditor() {
  const { user } = useSession();
  const hydrated = useHydrated();
  const data = useTesterProfile(user?.id);

  if (!hydrated) return <PageSkeleton />;

  if (!user || !data) {
    return (
      <EmptyState
        title="Profile unavailable"
        description="Sign in as a tester to edit your profile."
      />
    );
  }

  return <TesterProfileForm user={data.user} profile={data.profile} />;
}

export function DeveloperProfileEditor() {
  const { user } = useSession();
  const hydrated = useHydrated();
  const data = useDeveloperProfile(user?.id);

  if (!hydrated) return <PageSkeleton />;

  if (!user || !data) {
    return (
      <EmptyState
        title="Profile unavailable"
        description="Sign in as a developer to edit your studio profile."
      />
    );
  }

  return <DeveloperProfileForm user={data.user} profile={data.profile} />;
}
