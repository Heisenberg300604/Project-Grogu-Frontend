"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Banknote, KeyRound, ShieldCheck } from "lucide-react";

import type { Feedback, PlaytestWithRelations } from "@/lib/types";
import { formatRupees } from "@/lib/utils";
import { rewardSummary } from "@/lib/domain";
import { useAvailableKeyCounts, useReputationRules } from "@/lib/hooks/use-grogu";
import { feedbackService, ServiceError } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

/** Matches the server's cap on a single cash reward (grogu_feedback_review). */
const MAX_CASH = 100_000;
/** Used only until the rules arrive with the bootstrap. */
const FALLBACK_MAX_BONUS = 50;

export type ReviewDecision = "approved" | "rejected";

function schemaFor(maxBonus: number) {
  const wholeNumber = (label: string, max: number) =>
    z
      .number({ error: `${label} must be a number.` })
      .int(`${label} must be a whole number.`)
      .min(0, `${label} can't be negative.`)
      .max(max, `${label} can be at most ${max.toLocaleString("en-IN")}.`);

  return z.object({
    reputationBonus: wholeNumber("The bonus", maxBonus),
    cashAmount: wholeNumber("The cash reward", MAX_CASH),
    gameKey: z.boolean(),
    note: z.string().trim().max(1000, "Keep the note under 1000 characters."),
  });
}

type FormValues = z.infer<ReturnType<typeof schemaFor>>;

/**
 * The studio's decision on one review. Approving pays everything chosen here
 * in one server transaction; the decision can't be changed afterwards.
 */
export function ReviewDialog({
  feedback,
  playtest,
  testerName,
  decision,
  onOpenChange,
}: {
  feedback: Feedback;
  playtest: PlaytestWithRelations;
  testerName: string;
  /** Which decision the dialog is for; null keeps it closed. */
  decision: ReviewDecision | null;
  onOpenChange: (open: boolean) => void;
}) {
  const toast = useToast();
  const rules = useReputationRules();
  const keysLeft = useAvailableKeyCounts().get(playtest.gameId) ?? 0;
  const [formError, setFormError] = useState<string | null>(null);

  const approvalAward = rules.find((r) => r.reason === "review-approved")?.amount ?? 0;
  const maxBonus =
    rules.find((r) => r.reason === "review-bonus")?.maxAmount ?? FALLBACK_MAX_BONUS;
  const approving = decision === "approved";

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schemaFor(maxBonus)),
    defaultValues: {
      reputationBonus: 0,
      cashAmount: playtest.cashReward ?? 0,
      gameKey: false,
      note: "",
    },
  });

  const gameKey = useWatch({ control, name: "gameKey" });

  function close() {
    onOpenChange(false);
    setTimeout(() => {
      setFormError(null);
      reset();
    }, 200);
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!decision) return;
    setFormError(null);
    try {
      const result = await feedbackService.reviewFeedback(feedback.id, {
        decision,
        note: values.note || undefined,
        ...(approving
          ? {
              reputationBonus: values.reputationBonus,
              cashAmount: values.cashAmount,
              gameKey: values.gameKey,
            }
          : {}),
      });
      toast({
        title: approving ? `${testerName}'s review approved` : "Review not approved",
        description: approving
          ? rewardSummary(result.rewards) || "No rewards were attached."
          : `${testerName} has been told.`,
        tone: approving ? "success" : "info",
      });
      close();
    } catch (error) {
      setFormError(
        error instanceof ServiceError
          ? error.message
          : "Couldn't save your decision. Please try again.",
      );
    }
  });

  return (
    <Dialog open={decision !== null} onOpenChange={(next) => (next ? undefined : close())}>
      <DialogContent className="max-w-md">
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <DialogHeader>
            <DialogTitle>
              {approving ? "Approve review" : "Don't approve this review"}
            </DialogTitle>
            <DialogDescription>
              {approving
                ? `Reward ${testerName} for their review of ${playtest.title}. This can't be undone.`
                : `${testerName} will be told, and no rewards are issued. This can't be undone.`}
            </DialogDescription>
          </DialogHeader>

          {approving && (
            <>
              <p className="flex items-start gap-2.5 rounded-lg border border-border bg-surface p-3 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
                Approving always awards +{approvalAward} Grogu reputation. Add a bonus
                if the review was especially useful.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Reputation bonus"
                  htmlFor="review-bonus"
                  hint={`0 to ${maxBonus}`}
                  error={errors.reputationBonus?.message}
                >
                  <Input
                    id="review-bonus"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={maxBonus}
                    aria-invalid={!!errors.reputationBonus}
                    {...register("reputationBonus", { valueAsNumber: true })}
                  />
                </Field>
                <Field
                  label="Cash reward (₹)"
                  htmlFor="review-cash"
                  hint={
                    playtest.cashReward
                      ? `Playtest lists ${formatRupees(playtest.cashReward)}`
                      : "Added to their balance"
                  }
                  error={errors.cashAmount?.message}
                >
                  <Input
                    id="review-cash"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    aria-invalid={!!errors.cashAmount}
                    {...register("cashAmount", { valueAsNumber: true })}
                  />
                </Field>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="review-key"
                    checked={gameKey === true}
                    disabled={keysLeft === 0}
                    onCheckedChange={(checked) =>
                      setValue("gameKey", checked === true, { shouldValidate: true })
                    }
                  />
                  <Label htmlFor="review-key" className="font-normal text-muted-foreground">
                    Give a {playtest.game.title} key from your inventory
                  </Label>
                </div>
                <p className="flex items-center gap-1.5 pl-6 text-xs text-subtle-foreground">
                  <KeyRound className="size-3" aria-hidden />
                  {keysLeft > 0 ? (
                    `${keysLeft} unused ${keysLeft === 1 ? "key" : "keys"} left. The tester is told to check their email.`
                  ) : (
                    <span>
                      No unused keys.{" "}
                      <Link
                        href={`/developer/games/${playtest.gameId}/edit#game-keys`}
                        className="text-secondary underline-offset-2 hover:underline"
                      >
                        Add keys to this game
                      </Link>
                    </span>
                  )}
                </p>
              </div>
            </>
          )}

          <Field
            label={approving ? "Note to the tester (optional)" : "Reason (recommended)"}
            htmlFor="review-note"
            error={errors.note?.message}
          >
            <Textarea
              id="review-note"
              rows={3}
              placeholder={
                approving
                  ? "What made this review useful?"
                  : "Help them write a better review next time."
              }
              {...register("note")}
            />
          </Field>

          {formError && (
            <p
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {formError}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={close} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={approving ? "primary" : "destructive"}
              loading={isSubmitting}
            >
              {approving ? (
                <>
                  <Banknote aria-hidden /> Approve and reward
                </>
              ) : (
                "Don't approve"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
