"use client";

import { useState } from "react";
import { Check, KeyRound, Mail, X } from "lucide-react";

import type { Feedback, GameKey, PlaytestWithRelations } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { REVIEW_STATUS_META } from "@/lib/constants";
import { useGroguStore } from "@/lib/store/grogu-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { rewardSummary } from "@/lib/domain";
import { ReviewDialog, type ReviewDecision } from "@/components/feedback/review-dialog";

/**
 * The decision line both sides see: status, when, what was granted, the note.
 * Inside a FeedbackCard the header already carries the status badge, so the
 * studio panel passes `badge={false}`.
 */
function Outcome({ feedback, badge = true }: { feedback: Feedback; badge?: boolean }) {
  const meta = REVIEW_STATUS_META[feedback.reviewStatus];
  const granted = rewardSummary(feedback.rewards);

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        {badge && <Badge tone={meta.tone}>{meta.label}</Badge>}
        {feedback.reviewedAt && (
          <span className="text-xs text-subtle-foreground">
            {badge ? "" : `${meta.label} `}
            {formatRelativeTime(feedback.reviewedAt)}
          </span>
        )}
        {feedback.reviewStatus === "approved" && (
          <span className="text-xs text-muted-foreground">
            {granted ? `Rewarded ${granted}` : "No rewards attached"}
          </span>
        )}
      </div>
      {feedback.reviewNote && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          &ldquo;{feedback.reviewNote}&rdquo;
        </p>
      )}
    </div>
  );
}

/**
 * Developer side: approve or reject a submitted review, or see what was
 * granted, including which key went to the tester so it can be emailed.
 */
export function StudioReviewPanel({
  feedback,
  playtest,
  testerName,
}: {
  feedback: Feedback;
  playtest: PlaytestWithRelations;
  testerName: string;
}) {
  const [decision, setDecision] = useState<ReviewDecision | null>(null);
  const key = useGroguStore((s) =>
    s.gameKeys.find((k: GameKey) => k.feedbackId === feedback.id),
  );

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1.5">
        {feedback.reviewStatus === "submitted" ? (
          <p className="text-xs text-muted-foreground">
            Approve to reward {testerName}, or leave a reason if you don&apos;t.
          </p>
        ) : (
          <Outcome feedback={feedback} badge={false} />
        )}
        {key && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <KeyRound className="size-3 shrink-0" aria-hidden />
            Key to email {testerName}:{" "}
            <code className="rounded bg-elevated px-1.5 py-0.5 font-mono text-foreground">
              {key.code}
            </code>
          </p>
        )}
      </div>

      {feedback.reviewStatus === "submitted" && (
        <div className="flex shrink-0 gap-2">
          <Button size="sm" variant="ghost" onClick={() => setDecision("rejected")}>
            <X aria-hidden /> Don&apos;t approve
          </Button>
          <Button size="sm" onClick={() => setDecision("approved")}>
            <Check aria-hidden /> Approve
          </Button>
        </div>
      )}

      <ReviewDialog
        feedback={feedback}
        playtest={playtest}
        testerName={testerName}
        decision={decision}
        onOpenChange={(open) => {
          if (!open) setDecision(null);
        }}
      />
    </div>
  );
}

/** Tester side: where their review stands and what it earned. */
export function TesterReviewOutcome({ feedback }: { feedback: Feedback }) {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-surface p-3.5">
      <p className="text-label text-subtle-foreground">STUDIO REVIEW</p>
      <Outcome feedback={feedback} />
      {feedback.reviewStatus === "submitted" && (
        <p className="text-xs text-muted-foreground">
          The studio hasn&apos;t reviewed your feedback yet. Rewards are issued when it&apos;s approved.
        </p>
      )}
      {feedback.rewards.gameKey && (
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Mail className="mt-0.5 size-3 shrink-0" aria-hidden />
          Your game key is on its way. Check your email (and your spam folder).
        </p>
      )}
    </div>
  );
}
