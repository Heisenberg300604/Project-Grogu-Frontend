"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CheckCircle2, Lock } from "lucide-react";
import { z } from "zod";

import { testCompletion } from "@/lib/domain";
import { RATING_DIMENSIONS } from "@/lib/constants";
import type { FeedbackSentiment } from "@/lib/types";
import {
  usePlaytest,
  useTestProgress,
  useTesterApplication,
} from "@/lib/hooks/use-grogu";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useSession } from "@/lib/hooks/use-session";
import { testsService } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, PageSkeleton } from "@/components/ui/states";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/layout/page-header";
import { RatingInput } from "@/components/feedback/rating";

const ratingField = z
  .number({ error: "Give this a rating." })
  .int()
  .min(1, "Give this a rating.")
  .max(5);

const schema = z.object({
  fun: ratingField,
  difficulty: ratingField,
  clarity: ratingField,
  performance: ratingField,
  polish: ratingField,
  sentiment: z.enum(["positive", "neutral", "negative"]),
  summary: z.string().trim().min(40, "A sentence or two, please (40+ characters)."),
  highlights: z.string().trim().min(3, "Add at least one highlight."),
  painPoints: z.string().trim().optional(),
  bugs: z.string().trim().optional(),
  controlsNote: z.string().trim().optional(),
  wouldRecommend: z.enum(["yes", "no"]),
  hoursPlayed: z.coerce.number().min(0.5, "At least 0.5 hours.").max(200),
});

type FormValues = z.input<typeof schema>;

const lines = (value?: string) =>
  (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export function FeedbackForm({ playtestId }: { playtestId: string }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const { user } = useSession();
  const playtest = usePlaytest(playtestId);
  const application = useTesterApplication(user?.id, playtestId);
  const progress = useTestProgress(user?.id, playtestId);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      sentiment: "neutral",
      summary: "",
      highlights: "",
      painPoints: "",
      bugs: "",
      controlsNote: "",
      wouldRecommend: "yes",
      hoursPlayed: 1,
    },
  });

  if (!hydrated || !user) return <PageSkeleton />;

  if (!playtest || !application || application.status !== "accepted") {
    return (
      <EmptyState
        icon={Lock}
        title="Feedback isn't available"
        description="You need to be an accepted tester on this playtest."
        action={
          <Button asChild size="sm" variant="secondary">
            <Link href="/tests">Back to my tests</Link>
          </Button>
        }
      />
    );
  }

  const completion = testCompletion(progress, playtest);
  const ready = completion.total === 0 || completion.done === completion.total;
  const alreadySubmitted =
    progress?.stage === "completed" || progress?.stage === "feedback-submitted";

  if (!ready && !alreadySubmitted) {
    return (
      <EmptyState
        icon={Lock}
        title="Finish the required tasks first"
        description={`${completion.done}/${completion.total} required tasks done. Complete them in the workspace, then come back.`}
        action={
          <Button asChild size="sm">
            <Link href={`/tests/${playtestId}`}>Back to workspace</Link>
          </Button>
        }
      />
    );
  }

  if (done || alreadySubmitted) {
    return (
      <div className="mx-auto max-w-md py-10">
        <Card className="flex flex-col items-center gap-4 p-8 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="size-6" aria-hidden />
          </span>
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Feedback submitted</h1>
            <p className="text-sm text-muted-foreground">
              Thanks for testing {playtest.game.title}. Your report is with{" "}
              {playtest.developer.name}.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="secondary">
              <Link href="/tests">My tests</Link>
            </Button>
            <Button asChild>
              <Link href="/discover">Find another playtest</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const surveyTasks = playtest.tasks.filter(
    (t) => t.type === "survey" || t.type === "bug-report",
  );

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const ratings = {
        fun: Number(values.fun),
        difficulty: Number(values.difficulty),
        clarity: Number(values.clarity),
        performance: Number(values.performance),
        polish: Number(values.polish),
      };
      const painPoints = lines(values.painPoints);
      const bugs = lines(values.bugs);
      const highlights = lines(values.highlights);
      const answers = surveyTasks.map((task) => ({
        taskId: task.id,
        question: task.title,
        answer:
          task.type === "bug-report"
            ? bugs.join("; ") || "No blocking bugs found."
            : values.controlsNote?.trim() || values.summary,
      }));

      await testsService.submitFeedback(playtestId, user.id, {
        ratings,
        sentiment: values.sentiment as FeedbackSentiment,
        summary: values.summary,
        highlights,
        painPoints,
        bugs,
        answers,
        wouldRecommend: values.wouldRecommend === "yes",
        hoursPlayed: Number(values.hoursPlayed),
      });
      setDone(true);
      router.refresh();
    } catch {
      setFormError("Couldn't submit your feedback. Please try again.");
    }
  });

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[
          { label: "My tests", href: "/tests" },
          { label: playtest.game.title, href: `/tests/${playtestId}` },
          { label: "Feedback" },
        ]}
        title="Playtest feedback"
        description={`Structured feedback for ${playtest.title}. This goes straight to the developer.`}
      />

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ratings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-0">
            {RATING_DIMENSIONS.map((dim) => (
              <div key={dim.key} className="space-y-1.5">
                <div>
                  <p id={`rating-${dim.key}`} className="text-sm font-medium">
                    {dim.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{dim.hint}</p>
                </div>
                <Controller
                  control={control}
                  name={dim.key}
                  render={({ field }) => (
                    <RatingInput
                      labelledBy={`rating-${dim.key}`}
                      value={Number(field.value) || 0}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors[dim.key] && (
                  <p className="text-xs font-medium text-destructive" role="alert">
                    {errors[dim.key]?.message}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-0">
            <Field
              label="Overall summary"
              htmlFor="fb-summary"
              hint="What's the headline? How did the session feel start to finish?"
              error={errors.summary?.message}
              required
            >
              <Textarea id="fb-summary" rows={4} {...register("summary")} />
            </Field>

            <Field
              label="Highlights — what worked"
              htmlFor="fb-highlights"
              hint="One per line."
              error={errors.highlights?.message}
              required
            >
              <Textarea
                id="fb-highlights"
                rows={3}
                placeholder={"The tide-forecast UI is intuitive\nSalvage loop is satisfying"}
                {...register("highlights")}
              />
            </Field>

            <Field
              label="Pain points — what got in the way"
              htmlFor="fb-pain"
              hint="One per line."
              error={errors.painPoints?.message}
            >
              <Textarea id="fb-pain" rows={3} {...register("painPoints")} />
            </Field>

            <Field
              label="Controls & feel"
              htmlFor="fb-controls"
              hint="How did movement, camera, and inputs feel?"
              error={errors.controlsNote?.message}
            >
              <Textarea id="fb-controls" rows={2} {...register("controlsNote")} />
            </Field>

            <Field
              label="Bugs"
              htmlFor="fb-bugs"
              hint="One per line — include repro steps where you can."
              error={errors.bugs?.message}
            >
              <Textarea
                id="fb-bugs"
                rows={3}
                placeholder="Day 2: saving during a storm soft-locks the UI (happened twice)"
                {...register("bugs")}
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Wrap up</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 pt-0 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Overall impression</p>
              <Controller
                control={control}
                name="sentiment"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="gap-1.5"
                  >
                    {(
                      [
                        ["positive", "Positive"],
                        ["neutral", "Mixed"],
                        ["negative", "Negative"],
                      ] as [FeedbackSentiment, string][]
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <RadioGroupItem value={value} /> {label}
                      </label>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Would you recommend this build to a friend?</p>
              <Controller
                control={control}
                name="wouldRecommend"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="gap-1.5"
                  >
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <RadioGroupItem value="yes" /> Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <RadioGroupItem value="no" /> Not yet
                    </label>
                  </RadioGroup>
                )}
              />
            </div>

            <Field
              label="Hours played"
              htmlFor="fb-hours"
              error={errors.hoursPlayed?.message}
              className="sm:col-span-2 sm:max-w-xs"
            >
              <Input
                id="fb-hours"
                type="number"
                step="0.5"
                min={0.5}
                {...register("hoursPlayed")}
              />
            </Field>
          </CardContent>
        </Card>

        {formError && (
          <p
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {formError}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Submit feedback"}
          </Button>
          <Button asChild variant="ghost" type="button">
            <Link href={`/tests/${playtestId}`}>Back to workspace</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
