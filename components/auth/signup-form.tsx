"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Gamepad2, UserRound } from "lucide-react";
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
} from "@/lib/types";
import { signup } from "@/lib/mock-auth";
import { ServiceError } from "@/lib/services";
import { homePathForRole, useSession } from "@/lib/hooks/use-session";
import { AuthCard } from "@/components/auth/auth-card";
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

const STUDIO_SIZES = ["solo", "small", "mid", "large"] as const;

const schema = z
  .object({
    role: z.enum(["tester", "developer"]),
    name: z.string().trim().min(2, "Enter your name."),
    email: z.email("Enter a valid email address."),
    password: z.string().min(6, "At least 6 characters."),
    location: z.string().trim().min(2, "Where are you based?"),
    experienceLevel: z.enum(EXPERIENCE_OPTIONS as [string, ...string[]]).optional(),
    preferredGenres: z.array(z.string()),
    platforms: z.array(z.string()),
    weeklyAvailabilityHours: z.coerce.number().int().optional(),
    studioName: z.string().trim().optional(),
    studioSize: z.enum(STUDIO_SIZES).optional(),
    website: z.string().trim().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.role === "tester") {
      if (!value.experienceLevel) {
        ctx.addIssue({ code: "custom", path: ["experienceLevel"], message: "Pick your experience level." });
      }
      if (value.preferredGenres.length < 1) {
        ctx.addIssue({ code: "custom", path: ["preferredGenres"], message: "Pick at least one genre." });
      }
      if (value.platforms.length < 1) {
        ctx.addIssue({ code: "custom", path: ["platforms"], message: "Pick at least one platform." });
      }
      const hours = value.weeklyAvailabilityHours ?? 0;
      if (hours < 1 || hours > 60) {
        ctx.addIssue({ code: "custom", path: ["weeklyAvailabilityHours"], message: "Enter 1–60 hours." });
      }
    } else {
      if (!value.studioName || value.studioName.length < 2) {
        ctx.addIssue({ code: "custom", path: ["studioName"], message: "Enter a studio name." });
      }
      if (!value.studioSize) {
        ctx.addIssue({ code: "custom", path: ["studioSize"], message: "Pick a studio size." });
      }
      if (value.website && !/^https?:\/\/.+/.test(value.website)) {
        ctx.addIssue({ code: "custom", path: ["website"], message: "Enter a full URL, or leave it blank." });
      }
    }
  });

type FormValues = z.input<typeof schema>;

const CHIP =
  "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function SignupForm() {
  const router = useRouter();
  const { session, loading } = useSession();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "tester",
      name: "",
      email: "",
      password: "",
      location: "",
      experienceLevel: "regular",
      preferredGenres: [],
      platforms: [],
      weeklyAvailabilityHours: 5,
      studioName: "",
      studioSize: "solo",
      website: "",
    },
  });

  const role = useWatch({ control, name: "role" });
  const genres = useWatch({ control, name: "preferredGenres" }) ?? [];
  const platforms = useWatch({ control, name: "platforms" }) ?? [];

  useEffect(() => {
    if (!loading && session) router.replace(homePathForRole(session.role));
  }, [loading, session, router]);

  function toggleArray(
    field: "preferredGenres" | "platforms",
    current: string[],
    value: string,
  ) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, next, { shouldValidate: true });
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const result =
        values.role === "tester"
          ? await signup({
              role: "tester",
              name: values.name,
              email: values.email,
              password: values.password,
              location: values.location,
              experienceLevel: values.experienceLevel as ExperienceLevel,
              preferredGenres: values.preferredGenres as GameGenre[],
              platforms: values.platforms as GamePlatform[],
              weeklyAvailabilityHours: Number(values.weeklyAvailabilityHours),
            })
          : await signup({
              role: "developer",
              name: values.name,
              email: values.email,
              password: values.password,
              location: values.location,
              studioName: values.studioName ?? "",
              studioSize: values.studioSize as DeveloperProfile["studioSize"],
              website: values.website ?? "",
            });
      router.replace(homePathForRole(result.role));
    } catch (error) {
      setFormError(
        error instanceof ServiceError
          ? error.message
          : "Couldn't create your account. Please try again.",
      );
    }
  });

  return (
    <AuthCard
      title="Create your Grogu account"
      description="Choose how you'll use Grogu. Each account is one role."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-secondary hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <fieldset>
          <legend className="mb-2 text-sm font-medium">I want to…</legend>
          <div className="grid grid-cols-2 gap-2">
            <RoleOption
              active={role === "tester"}
              icon={<UserRound className="size-4" />}
              title="Test games"
              description="Find playtests, submit feedback"
              onClick={() => setValue("role", "tester")}
            />
            <RoleOption
              active={role === "developer"}
              icon={<Gamepad2 className="size-4" />}
              title="Run playtests"
              description="Recruit testers for my game"
              onClick={() => setValue("role", "developer")}
            />
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" htmlFor="su-name" error={errors.name?.message}>
            <Input id="su-name" autoComplete="name" {...register("name")} />
          </Field>
          <Field label="Location" htmlFor="su-location" error={errors.location?.message}>
            <Input id="su-location" placeholder="City, Country" {...register("location")} />
          </Field>
          <Field label="Email" htmlFor="su-email" error={errors.email?.message}>
            <Input id="su-email" type="email" autoComplete="email" {...register("email")} />
          </Field>
          <Field label="Password" htmlFor="su-password" error={errors.password?.message}>
            <Input
              id="su-password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
          </Field>
        </div>

        {role === "tester" ? (
          <div className="space-y-4 rounded-lg border border-border bg-surface/60 p-4">
            <Field
              label="Experience level"
              htmlFor="su-experience"
              error={errors.experienceLevel?.message}
            >
              <Select
                defaultValue="regular"
                onValueChange={(v) =>
                  setValue("experienceLevel", v, { shouldValidate: true })
                }
              >
                <SelectTrigger id="su-experience">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {EXPERIENCE_LABELS[level as ExperienceLevel]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Favourite genres" error={errors.preferredGenres?.message}>
              <div className="flex flex-wrap gap-1.5">
                {GENRE_OPTIONS.map((genre) => {
                  const active = genres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleArray("preferredGenres", genres, genre)}
                      className={cn(
                        CHIP,
                        active
                          ? "border-primary bg-primary/15 text-secondary"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {GENRE_LABELS[genre]}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Platforms you can test on" error={errors.platforms?.message}>
              <div className="flex flex-wrap gap-1.5">
                {PLATFORM_OPTIONS.map((platform) => {
                  const active = platforms.includes(platform);
                  return (
                    <button
                      key={platform}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleArray("platforms", platforms, platform)}
                      className={cn(
                        CHIP,
                        active
                          ? "border-primary bg-primary/15 text-secondary"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {PLATFORM_LABELS[platform]}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field
              label="Hours per week you can commit"
              htmlFor="su-hours"
              error={errors.weeklyAvailabilityHours?.message}
            >
              <Input
                id="su-hours"
                type="number"
                min={1}
                max={60}
                {...register("weeklyAvailabilityHours")}
              />
            </Field>
          </div>
        ) : (
          <div className="space-y-4 rounded-lg border border-border bg-surface/60 p-4">
            <Field label="Studio name" htmlFor="su-studio" error={errors.studioName?.message}>
              <Input id="su-studio" {...register("studioName")} />
            </Field>
            <Field label="Studio size" htmlFor="su-size" error={errors.studioSize?.message}>
              <Select
                defaultValue="solo"
                onValueChange={(v) =>
                  setValue("studioSize", v as (typeof STUDIO_SIZES)[number], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="su-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STUDIO_SIZES.map((size) => (
                    <SelectItem key={size} value={size}>
                      {STUDIO_SIZE_LABELS[size]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Website (optional)" htmlFor="su-website" error={errors.website?.message}>
              <Input id="su-website" placeholder="https://mystudio.com" {...register("website")} />
            </Field>
          </div>
        )}

        {formError && (
          <p
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {formError}
          </p>
        )}

        <Button type="submit" className="w-full" loading={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}

function RoleOption({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "border-primary bg-primary/10" : "border-border hover:border-border-strong",
      )}
    >
      <span
        className={cn(
          "grid size-7 place-items-center rounded-md",
          active ? "bg-primary/20 text-secondary" : "bg-muted text-muted-foreground",
        )}
      >
        {icon}
      </span>
      <span className="text-sm font-medium">{title}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </button>
  );
}
