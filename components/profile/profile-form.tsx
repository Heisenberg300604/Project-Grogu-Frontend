"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import {
  EXPERIENCE_LABELS,
  EXPERIENCE_OPTIONS,
  GENRE_LABELS,
  GENRE_OPTIONS,
  PLATFORM_LABELS,
  PLATFORM_OPTIONS,
  STUDIO_SIZE_LABELS,
} from "@/lib/constants";
import type {
  DeveloperProfile,
  ExperienceLevel,
  GameGenre,
  GamePlatform,
  TesterProfile,
  User,
} from "@/lib/types";
import { profileService, ServiceError } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";

const STUDIO_SIZES = Object.keys(
  STUDIO_SIZE_LABELS,
) as DeveloperProfile["studioSize"][];

const CHIP =
  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-[120ms] focus-visible:outline-none";

const CURRENT_YEAR = new Date().getFullYear();

/* -------------------------------------------------------------------------- */
/*  Schemas                                                                    */
/* -------------------------------------------------------------------------- */

const identity = {
  name: z.string().trim().min(2, "Enter your name."),
  location: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(400, "Keep your bio under 400 characters.").optional(),
  avatarUrl: z
    .union([z.literal(""), z.url("Enter a valid image URL, or leave empty.")])
    .optional(),
};

const testerSchema = z.object({
  ...identity,
  experienceLevel: z.enum(EXPERIENCE_OPTIONS as [ExperienceLevel, ...ExperienceLevel[]]),
  preferredGenres: z.array(z.string()).min(1, "Pick at least one genre."),
  platforms: z.array(z.string()).min(1, "Pick at least one platform."),
  languages: z.string().trim().min(1, "List at least one language."),
  // Registered with `valueAsNumber`, so the value reaching Zod is already a
  // number — `z.coerce` would type the schema's input as `unknown` and break
  // the resolver's type against the form values.
  weeklyAvailabilityHours: z
    .number({ error: "Enter a number of hours." })
    .int("Whole hours only.")
    .min(0)
    .max(168, "There are only 168 hours in a week."),
});

const developerSchema = z.object({
  ...identity,
  studioName: z.string().trim().min(2, "Enter your studio's name."),
  studioSize: z.enum(
    STUDIO_SIZES as [DeveloperProfile["studioSize"], ...DeveloperProfile["studioSize"][]],
  ),
  website: z
    .union([z.literal(""), z.url("Enter a valid URL, or leave empty.")])
    .optional(),
  foundedYear: z
    .number({ error: "Enter a year." })
    .int()
    .min(1950, "That's a little early for a games studio.")
    .max(CURRENT_YEAR, `Can't be later than ${CURRENT_YEAR}.`),
});

type TesterValues = z.infer<typeof testerSchema>;
type DeveloperValues = z.infer<typeof developerSchema>;

/* -------------------------------------------------------------------------- */
/*  Shared pieces                                                              */
/* -------------------------------------------------------------------------- */

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 border-t border-border pt-6 first:border-0 first:pt-0">
      <div className="space-y-1">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function ChipGroup<T extends string>({
  options,
  labels,
  selected,
  onToggle,
}: {
  options: readonly T[];
  labels: Record<T, string>;
  selected: string[];
  onToggle: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={selected.includes(option)}
          onClick={() => onToggle(option)}
          className={cn(
            CHIP,
            selected.includes(option)
              ? "border-primary-line bg-primary-soft text-secondary"
              : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
          )}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}

function FormFeedback({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p
      className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      role="alert"
    >
      {error}
    </p>
  );
}

/** Live preview of the identity block as it appears on the public profile. */
function IdentityPreview({
  name,
  avatarUrl,
  subtitle,
  bio,
}: {
  name: string;
  avatarUrl?: string;
  subtitle: string;
  bio?: string;
}) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
      <div className="rounded-xl border border-border bg-surface p-5">
        <p className="text-label mb-4 text-subtle-foreground">Preview</p>
        <div className="flex items-center gap-4">
          <UserAvatar
            name={name || "You"}
            src={avatarUrl || undefined}
            className="size-14 text-base"
          />
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold">
              {name || "Your name"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
          {bio || "Your bio appears here."}
        </p>
      </div>
      <p className="px-1 text-xs text-muted-foreground">
        Leave the avatar URL empty to keep the generated initials.
      </p>
    </aside>
  );
}

/** `["English","Hindi"]` <-> `"English, Hindi"`. */
function parseLanguages(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean),
    ),
  );
}

/* -------------------------------------------------------------------------- */
/*  Tester                                                                     */
/* -------------------------------------------------------------------------- */

export function TesterProfileForm({
  user,
  profile,
}: {
  user: User;
  profile: TesterProfile;
}) {
  const router = useRouter();
  const toast = useToast();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TesterValues>({
    resolver: zodResolver(testerSchema),
    defaultValues: {
      name: user.name,
      location: user.location,
      bio: user.bio,
      avatarUrl: user.avatarUrl ?? "",
      experienceLevel: profile.experienceLevel,
      preferredGenres: profile.preferredGenres,
      platforms: profile.platforms,
      languages: profile.languages.join(", "),
      weeklyAvailabilityHours: profile.weeklyAvailabilityHours,
    },
  });

  const name = useWatch({ control, name: "name" });
  const bio = useWatch({ control, name: "bio" });
  const avatarUrl = useWatch({ control, name: "avatarUrl" });
  const genres = useWatch({ control, name: "preferredGenres" }) ?? [];
  const platforms = useWatch({ control, name: "platforms" }) ?? [];

  function toggle(
    field: "preferredGenres" | "platforms",
    current: string[],
    value: string,
  ) {
    setValue(
      field,
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
      { shouldValidate: true },
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await profileService.saveProfile({
        name: values.name,
        location: values.location ?? "",
        bio: values.bio ?? "",
        avatarUrl: values.avatarUrl ?? "",
        experienceLevel: values.experienceLevel,
        preferredGenres: values.preferredGenres as GameGenre[],
        platforms: values.platforms as GamePlatform[],
        languages: parseLanguages(values.languages),
        weeklyAvailabilityHours: values.weeklyAvailabilityHours,
      });
      toast({ title: "Profile updated" });
      router.push("/profile");
    } catch (error) {
      setFormError(
        error instanceof ServiceError
          ? error.message
          : "Couldn't save your profile. Please try again.",
      );
    }
  });

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[{ label: "Profile", href: "/profile" }, { label: "Edit" }]}
        title="Edit profile"
        description="Developers read this before accepting your application."
      />

      <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_19rem]">
        <div className="min-w-0 space-y-6">
          <FormSection
            title="About you"
            description="Your name and bio are shown on every application you send."
          >
            <div className="space-y-5">
              <Field label="Name" htmlFor="p-name" error={errors.name?.message} required>
                <Input id="p-name" {...register("name")} />
              </Field>
              <Field
                label="Location"
                htmlFor="p-location"
                hint="City and country — helps developers match time zones."
                error={errors.location?.message}
              >
                <Input id="p-location" placeholder="Bengaluru, IN" {...register("location")} />
              </Field>
              <Field
                label="Bio"
                htmlFor="p-bio"
                hint="What kind of tester are you? Two sentences is plenty."
                error={errors.bio?.message}
              >
                <Textarea id="p-bio" rows={4} {...register("bio")} />
              </Field>
              <Field
                label="Avatar URL"
                htmlFor="p-avatar"
                hint="A link to an image. Leave empty for generated initials."
                error={errors.avatarUrl?.message}
              >
                <Input id="p-avatar" placeholder="https://…" {...register("avatarUrl")} />
              </Field>
            </div>
          </FormSection>

          <FormSection
            title="How you test"
            description="Used to match you with playtests that fit."
          >
            <div className="space-y-5">
              <Field
                label="Experience level"
                htmlFor="p-experience"
                error={errors.experienceLevel?.message}
              >
                <Controller
                  control={control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="p-experience">
                        <SelectValue>
                          {EXPERIENCE_LABELS[field.value as ExperienceLevel]}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_OPTIONS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {EXPERIENCE_LABELS[level]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field label="Platforms you can test on" error={errors.platforms?.message} required>
                <ChipGroup
                  options={PLATFORM_OPTIONS}
                  labels={PLATFORM_LABELS}
                  selected={platforms}
                  onToggle={(value) => toggle("platforms", platforms, value)}
                />
              </Field>

              <Field label="Preferred genres" error={errors.preferredGenres?.message} required>
                <ChipGroup
                  options={GENRE_OPTIONS}
                  labels={GENRE_LABELS}
                  selected={genres}
                  onToggle={(value) => toggle("preferredGenres", genres, value)}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Languages"
                  htmlFor="p-languages"
                  hint="Comma separated."
                  error={errors.languages?.message}
                  required
                >
                  <Input id="p-languages" placeholder="English, Hindi" {...register("languages")} />
                </Field>
                <Field
                  label="Hours per week"
                  htmlFor="p-hours"
                  hint="Time you can commit to playtesting."
                  error={errors.weeklyAvailabilityHours?.message}
                >
                  <Input
                    id="p-hours"
                    type="number"
                    min={0}
                    max={168}
                    {...register("weeklyAvailabilityHours", { valueAsNumber: true })}
                  />
                </Field>
              </div>
            </div>
          </FormSection>

          <FormFeedback error={formError} />

          <div className="flex gap-2">
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
            <Button asChild variant="ghost" type="button">
              <Link href="/profile">Cancel</Link>
            </Button>
          </div>
        </div>

        <IdentityPreview
          name={name}
          avatarUrl={avatarUrl}
          bio={bio}
          subtitle={`@${user.handle} · Game tester`}
        />
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Developer                                                                  */
/* -------------------------------------------------------------------------- */

export function DeveloperProfileForm({
  user,
  profile,
}: {
  user: User;
  profile: DeveloperProfile;
}) {
  const router = useRouter();
  const toast = useToast();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DeveloperValues>({
    resolver: zodResolver(developerSchema),
    defaultValues: {
      name: user.name,
      location: user.location,
      bio: user.bio,
      avatarUrl: user.avatarUrl ?? "",
      studioName: profile.studioName,
      studioSize: profile.studioSize,
      website: profile.website ?? "",
      foundedYear: profile.foundedYear,
    },
  });

  const name = useWatch({ control, name: "name" });
  const bio = useWatch({ control, name: "bio" });
  const avatarUrl = useWatch({ control, name: "avatarUrl" });
  const studioName = useWatch({ control, name: "studioName" });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await profileService.saveProfile({
        name: values.name,
        location: values.location ?? "",
        bio: values.bio ?? "",
        avatarUrl: values.avatarUrl ?? "",
        studioName: values.studioName,
        studioSize: values.studioSize,
        website: values.website ?? "",
        foundedYear: values.foundedYear,
      });
      toast({ title: "Studio profile updated" });
      router.push("/developer/profile");
    } catch (error) {
      setFormError(
        error instanceof ServiceError
          ? error.message
          : "Couldn't save your profile. Please try again.",
      );
    }
  });

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[
          { label: "Studio profile", href: "/developer/profile" },
          { label: "Edit" },
        ]}
        title="Edit studio profile"
        description="This is what testers see on every playtest you run."
      />

      <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_19rem]">
        <div className="min-w-0 space-y-6">
          <FormSection
            title="Studio"
            description="How your studio is introduced to testers."
          >
            <div className="space-y-5">
              <Field
                label="Studio name"
                htmlFor="p-studio"
                error={errors.studioName?.message}
                required
              >
                <Input id="p-studio" {...register("studioName")} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Studio size" htmlFor="p-size" error={errors.studioSize?.message}>
                  <Controller
                    control={control}
                    name="studioSize"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="p-size">
                          <SelectValue>{STUDIO_SIZE_LABELS[field.value]}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {STUDIO_SIZES.map((size) => (
                            <SelectItem key={size} value={size}>
                              {STUDIO_SIZE_LABELS[size]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field
                  label="Founded"
                  htmlFor="p-founded"
                  error={errors.foundedYear?.message}
                >
                  <Input
                    id="p-founded"
                    type="number"
                    min={1950}
                    max={CURRENT_YEAR}
                    {...register("foundedYear", { valueAsNumber: true })}
                  />
                </Field>
              </div>
              <Field
                label="Website"
                htmlFor="p-website"
                hint="Optional."
                error={errors.website?.message}
              >
                <Input id="p-website" placeholder="https://…" {...register("website")} />
              </Field>
            </div>
          </FormSection>

          <FormSection
            title="About you"
            description="The person behind the studio."
          >
            <div className="space-y-5">
              <Field label="Your name" htmlFor="p-name" error={errors.name?.message} required>
                <Input id="p-name" {...register("name")} />
              </Field>
              <Field label="Location" htmlFor="p-location" error={errors.location?.message}>
                <Input id="p-location" placeholder="Lisbon, PT" {...register("location")} />
              </Field>
              <Field
                label="Bio"
                htmlFor="p-bio"
                hint="What your studio makes, in a sentence or two."
                error={errors.bio?.message}
              >
                <Textarea id="p-bio" rows={4} {...register("bio")} />
              </Field>
              <Field
                label="Avatar URL"
                htmlFor="p-avatar"
                hint="A link to an image. Leave empty for generated initials."
                error={errors.avatarUrl?.message}
              >
                <Input id="p-avatar" placeholder="https://…" {...register("avatarUrl")} />
              </Field>
            </div>
          </FormSection>

          <FormFeedback error={formError} />

          <div className="flex gap-2">
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
            <Button asChild variant="ghost" type="button">
              <Link href="/developer/profile">Cancel</Link>
            </Button>
          </div>
        </div>

        <IdentityPreview
          name={studioName}
          avatarUrl={avatarUrl}
          bio={bio}
          subtitle={`Led by ${name || user.name}`}
        />
      </form>
    </div>
  );
}
