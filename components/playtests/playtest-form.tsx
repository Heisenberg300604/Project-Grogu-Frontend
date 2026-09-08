"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type FieldPath,
} from "react-hook-form";
import { Check, Plus, Trash2 } from "lucide-react";
import { z } from "zod";

import { cn } from "@/lib/utils";
import {
  EXPERIENCE_LABELS,
  EXPERIENCE_OPTIONS,
  FOCUS_LABELS,
  FOCUS_OPTIONS,
  PLATFORM_LABELS,
  PLATFORM_OPTIONS,
  TASK_TYPE_LABELS,
} from "@/lib/constants";
import type {
  ExperienceLevel,
  GamePlatform,
  PlaytestFocus,
  TaskType,
} from "@/lib/types";
import { useDeveloperGames } from "@/lib/hooks/use-grogu";
import { useSession } from "@/lib/hooks/use-session";
import { playtestsService, ServiceError } from "@/lib/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/states";
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
import { PageHeader } from "@/components/layout/page-header";

const TASK_TYPES = Object.keys(TASK_TYPE_LABELS) as TaskType[];

const taskSchema = z.object({
  title: z.string().trim().min(3, "Name the task."),
  description: z.string().trim().min(8, "Add a short instruction."),
  type: z.enum(TASK_TYPES),
  required: z.boolean(),
  estimatedMinutes: z.coerce.number().int().min(1).max(600),
});

const schema = z.object({
  gameId: z.string().min(1, "Choose a game."),
  title: z.string().trim().min(6, "Give the playtest a clear title."),
  summary: z.string().trim().min(30, "Explain what you're testing (30+ characters)."),
  goals: z.string().trim().min(10, "List at least one goal (one per line)."),
  focusAreas: z.array(z.string()).min(1, "Pick at least one focus area."),
  closesAt: z.string().min(1, "Pick a closing date."),
  minExperienceLevel: z.enum(EXPERIENCE_OPTIONS as [string, ...string[]]),
  platforms: z.array(z.string()).min(1, "Pick at least one platform."),
  languages: z.string().trim().min(2, "e.g. English"),
  minReputation: z.coerce.number().int().min(0).max(100),
  estimatedHours: z.coerce.number().min(0.5).max(60),
  ndaRequired: z.boolean(),
  reward: z.string().trim().min(3, "What do testers get? (reputation counts)"),
  maxTesters: z.coerce.number().int().min(1).max(500),
  tasks: z.array(taskSchema).min(1, "Add at least one task."),
  publish: z.boolean(),
});

type FormValues = z.input<typeof schema>;

const STEPS = ["Game & info", "Requirements", "Tasks", "Review"] as const;

const STEP_FIELDS: FieldPath<FormValues>[][] = [
  ["gameId", "title", "summary", "goals", "focusAreas", "closesAt"],
  [
    "minExperienceLevel",
    "platforms",
    "languages",
    "minReputation",
    "estimatedHours",
    "reward",
    "maxTesters",
  ],
  ["tasks"],
  [],
];

const CHIP =
  "rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const lines = (value: string) =>
  value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

function defaultCloseDate() {
  const d = new Date();
  d.setDate(d.getDate() + 21);
  return d.toISOString().slice(0, 10);
}

export function PlaytestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSession();
  const games = useDeveloperGames(user?.id);
  const [step, setStep] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      gameId: searchParams.get("game") ?? games[0]?.id ?? "",
      title: "",
      summary: "",
      goals: "",
      focusAreas: [],
      closesAt: defaultCloseDate(),
      minExperienceLevel: "regular",
      platforms: [],
      languages: "English",
      minReputation: 40,
      estimatedHours: 4,
      ndaRequired: false,
      reward: "Grogu reputation",
      maxTesters: 20,
      tasks: [
        {
          title: "Play the first session",
          description: "Play for the estimated time and note first impressions.",
          type: "objective",
          required: true,
          estimatedMinutes: 45,
        },
      ],
      publish: true,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "tasks" });
  const focusAreas = useWatch({ control, name: "focusAreas" }) ?? [];
  const platforms = useWatch({ control, name: "platforms" }) ?? [];

  if (!user) return null;

  if (games.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Create a playtest" description="You need a game first." />
        <EmptyState
          title="Add a game before creating a playtest"
          description="A playtest always belongs to one of your games."
          action={
            <Button asChild size="sm">
              <Link href="/developer/games/new">Add a game</Link>
            </Button>
          }
        />
      </div>
    );
  }

  function toggle(field: "focusAreas" | "platforms", current: string[], value: string) {
    setValue(
      field,
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
      { shouldValidate: true },
    );
  }

  async function next() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function submit(publish: boolean) {
    setValue("publish", publish);
    setFormError(null);
    await handleSubmit(async (values) => {
      try {
        const created = await playtestsService.createPlaytest({
          gameId: values.gameId,
          title: values.title,
          summary: values.summary,
          goals: lines(values.goals),
          focusAreas: values.focusAreas as PlaytestFocus[],
          requirements: {
            minExperienceLevel: values.minExperienceLevel as ExperienceLevel,
            platforms: values.platforms as GamePlatform[],
            preferredGenres: [],
            languages: values.languages.split(",").map((s) => s.trim()).filter(Boolean),
            minReputation: Number(values.minReputation),
            estimatedHours: Number(values.estimatedHours),
            ndaRequired: values.ndaRequired,
          },
          tasks: values.tasks.map((t) => ({
            title: t.title,
            description: t.description,
            type: t.type as TaskType,
            required: t.required,
            estimatedMinutes: Number(t.estimatedMinutes),
          })),
          reward: values.reward,
          maxTesters: Number(values.maxTesters),
          closesAt: new Date(values.closesAt).toISOString(),
          publish,
        });
        router.push(`/developer/playtests/${created.id}`);
      } catch (error) {
        setFormError(
          error instanceof ServiceError
            ? error.message
            : "Couldn't save the playtest. Please try again.",
        );
      }
    })();
  }

  const values = getValues();
  const selectedGame = games.find((g) => g.id === values.gameId);

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[
          { label: "Playtests", href: "/developer/playtests" },
          { label: "New playtest" },
        ]}
        title="Create a playtest"
        description="Set it up in four steps. Save a draft any time."
      />

      <ol className="flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                i === step
                  ? "border-primary bg-primary/15 text-secondary"
                  : i < step
                    ? "border-border text-foreground hover:bg-accent"
                    : "border-border text-muted-foreground",
              )}
            >
              <span className="grid size-4 place-items-center rounded-full border border-current text-[10px]">
                {i < step ? <Check className="size-3" /> : i + 1}
              </span>
              {label}
            </button>
          </li>
        ))}
      </ol>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Game & test info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <Field label="Game" htmlFor="pt-game" error={errors.gameId?.message} required>
                <Controller
                  control={control}
                  name="gameId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="pt-game">
                        <SelectValue placeholder="Choose a game" />
                      </SelectTrigger>
                      <SelectContent>
                        {games.map((game) => (
                          <SelectItem key={game.id} value={game.id}>
                            {game.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field label="Title" htmlFor="pt-title" error={errors.title?.message} required>
                <Input
                  id="pt-title"
                  placeholder="e.g. Beta 0.8 — onboarding & difficulty"
                  {...register("title")}
                />
              </Field>
              <Field
                label="Summary"
                htmlFor="pt-summary"
                hint="What are you testing and who should apply?"
                error={errors.summary?.message}
                required
              >
                <Textarea id="pt-summary" rows={3} {...register("summary")} />
              </Field>
              <Field
                label="Goals"
                htmlFor="pt-goals"
                hint="One per line — what do you want to learn?"
                error={errors.goals?.message}
                required
              >
                <Textarea
                  id="pt-goals"
                  rows={3}
                  placeholder={"Confirm new players understand the tide system\nFind blocking bugs in the first hour"}
                  {...register("goals")}
                />
              </Field>
              <Field label="Focus areas" error={errors.focusAreas?.message} required>
                <div className="flex flex-wrap gap-1.5">
                  {FOCUS_OPTIONS.map((focus) => (
                    <button
                      key={focus}
                      type="button"
                      aria-pressed={focusAreas.includes(focus)}
                      onClick={() => toggle("focusAreas", focusAreas, focus)}
                      className={cn(
                        CHIP,
                        focusAreas.includes(focus)
                          ? "border-primary bg-primary/15 text-secondary"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {FOCUS_LABELS[focus]}
                    </button>
                  ))}
                </div>
              </Field>
              <Field
                label="Applications close"
                htmlFor="pt-closes"
                error={errors.closesAt?.message}
                required
              >
                <Input id="pt-closes" type="date" {...register("closesAt")} />
              </Field>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tester requirements & reward</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Minimum experience"
                  htmlFor="pt-exp"
                  error={errors.minExperienceLevel?.message}
                >
                  <Controller
                    control={control}
                    name="minExperienceLevel"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="pt-exp">
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
                    )}
                  />
                </Field>
                <Field
                  label="Minimum reputation"
                  htmlFor="pt-rep"
                  error={errors.minReputation?.message}
                >
                  <Input id="pt-rep" type="number" min={0} max={100} {...register("minReputation")} />
                </Field>
              </div>
              <Field label="Platforms" error={errors.platforms?.message} required>
                <div className="flex flex-wrap gap-1.5">
                  {PLATFORM_OPTIONS.map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      aria-pressed={platforms.includes(platform)}
                      onClick={() => toggle("platforms", platforms, platform)}
                      className={cn(
                        CHIP,
                        platforms.includes(platform)
                          ? "border-primary bg-primary/15 text-secondary"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {PLATFORM_LABELS[platform]}
                    </button>
                  ))}
                </div>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Languages" htmlFor="pt-lang" error={errors.languages?.message}>
                  <Input id="pt-lang" placeholder="English, Japanese" {...register("languages")} />
                </Field>
                <Field
                  label="Estimated hours"
                  htmlFor="pt-hours"
                  error={errors.estimatedHours?.message}
                >
                  <Input id="pt-hours" type="number" step="0.5" min={0.5} {...register("estimatedHours")} />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tester limit" htmlFor="pt-max" error={errors.maxTesters?.message}>
                  <Input id="pt-max" type="number" min={1} {...register("maxTesters")} />
                </Field>
                <Field label="Reward" htmlFor="pt-reward" error={errors.reward?.message} required>
                  <Input id="pt-reward" {...register("reward")} />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Controller
                  control={control}
                  name="ndaRequired"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(c) => field.onChange(c === true)}
                    />
                  )}
                />
                Testers must agree to an NDA before accessing the build
              </label>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-2">
              <CardTitle className="text-base">Testing tasks</CardTitle>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() =>
                  append({
                    title: "",
                    description: "",
                    type: "objective",
                    required: false,
                    estimatedMinutes: 15,
                  })
                }
              >
                <Plus className="size-4" /> Add task
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {typeof errors.tasks?.message === "string" && (
                <p className="text-xs font-medium text-destructive" role="alert">
                  {errors.tasks.message}
                </p>
              )}
              {fields.map((fieldItem, index) => (
                <div
                  key={fieldItem.id}
                  className="space-y-3 rounded-lg border border-border bg-surface p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Task {index + 1}</p>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => remove(index)}
                        aria-label={`Remove task ${index + 1}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                  <Field
                    label="Title"
                    htmlFor={`task-${index}-title`}
                    error={errors.tasks?.[index]?.title?.message}
                  >
                    <Input id={`task-${index}-title`} {...register(`tasks.${index}.title`)} />
                  </Field>
                  <Field
                    label="Instruction"
                    htmlFor={`task-${index}-desc`}
                    error={errors.tasks?.[index]?.description?.message}
                  >
                    <Textarea
                      id={`task-${index}-desc`}
                      rows={2}
                      {...register(`tasks.${index}.description`)}
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Field label="Type" htmlFor={`task-${index}-type`}>
                      <Controller
                        control={control}
                        name={`tasks.${index}.type`}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id={`task-${index}-type`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TASK_TYPES.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {TASK_TYPE_LABELS[t]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>
                    <Field
                      label="Minutes"
                      htmlFor={`task-${index}-min`}
                      error={errors.tasks?.[index]?.estimatedMinutes?.message}
                    >
                      <Input
                        id={`task-${index}-min`}
                        type="number"
                        min={1}
                        {...register(`tasks.${index}.estimatedMinutes`)}
                      />
                    </Field>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Controller
                          control={control}
                          name={`tasks.${index}.required`}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(c) => field.onChange(c === true)}
                            />
                          )}
                        />
                        Required
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0 text-sm">
              <ReviewRow label="Game" value={selectedGame?.title ?? "—"} />
              <ReviewRow label="Title" value={values.title} />
              <ReviewRow label="Summary" value={values.summary} />
              <ReviewRow label="Goals" value={lines(values.goals).join(" · ")} />
              <ReviewRow
                label="Focus"
                value={
                  <div className="flex flex-wrap gap-1">
                    {values.focusAreas.map((f) => (
                      <Badge key={f} tone="primary">
                        {FOCUS_LABELS[f as PlaytestFocus]}
                      </Badge>
                    ))}
                  </div>
                }
              />
              <ReviewRow
                label="Requirements"
                value={`${EXPERIENCE_LABELS[values.minExperienceLevel as ExperienceLevel]}+ · ${(values.platforms as string[])
                  .map((p) => PLATFORM_LABELS[p as GamePlatform])
                  .join(", ")} · rep ${values.minReputation} · ~${values.estimatedHours}h${
                  values.ndaRequired ? " · NDA" : ""
                }`}
              />
              <ReviewRow label="Reward" value={values.reward} />
              <ReviewRow label="Tester limit" value={String(values.maxTesters)} />
              <ReviewRow label="Tasks" value={`${values.tasks.length} task(s)`} />
              <ReviewRow
                label="Closes"
                value={new Date(values.closesAt).toLocaleDateString()}
              />
            </CardContent>
          </Card>
        )}

        {formError && (
          <p
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {formError}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            {step > 0 && (
              <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              loading={isSubmitting}
              onClick={() => submit(false)}
            >
              Save draft
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={next}>
                Continue
              </Button>
            ) : (
              <Button type="button" loading={isSubmitting} onClick={() => submit(true)}>
                Publish playtest
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3 border-b border-border pb-3 last:border-0">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-foreground">{value || "—"}</span>
    </div>
  );
}
