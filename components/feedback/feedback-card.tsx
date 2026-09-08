import { Bug, ThumbsDown, ThumbsUp } from "lucide-react";

import { formatRelativeTime } from "@/lib/utils";
import { overallRating } from "@/lib/domain";
import type { Feedback, User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/avatar";
import { RatingStars } from "@/components/feedback/rating";

const SENTIMENT_TONE = {
  positive: "success",
  neutral: "muted",
  negative: "destructive",
} as const;

/** One tester's feedback report. `tester` omitted → anonymised. */
export function FeedbackCard({
  feedback,
  tester,
}: {
  feedback: Feedback;
  tester?: User;
}) {
  return (
    <Card className="space-y-3 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {tester ? (
            <>
              <UserAvatar name={tester.name} src={tester.avatarUrl} className="size-7" />
              <span className="text-sm font-medium">{tester.name}</span>
            </>
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              Anonymous tester
            </span>
          )}
          <Badge tone={SENTIMENT_TONE[feedback.sentiment]}>
            {feedback.sentiment}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <RatingStars value={overallRating(feedback.ratings)} />
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(feedback.submittedAt)}
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{feedback.summary}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        {feedback.highlights.length > 0 && (
          <div>
            <p className="mb-1 flex items-center gap-1 text-xs font-medium text-success">
              <ThumbsUp className="size-3" /> Highlights
            </p>
            <ul className="space-y-0.5 text-xs text-muted-foreground">
              {feedback.highlights.map((h) => (
                <li key={h}>• {h}</li>
              ))}
            </ul>
          </div>
        )}
        {feedback.painPoints.length > 0 && (
          <div>
            <p className="mb-1 flex items-center gap-1 text-xs font-medium text-warning">
              <ThumbsDown className="size-3" /> Pain points
            </p>
            <ul className="space-y-0.5 text-xs text-muted-foreground">
              {feedback.painPoints.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {feedback.bugs.length > 0 && (
        <div>
          <p className="mb-1 flex items-center gap-1 text-xs font-medium text-destructive">
            <Bug className="size-3" /> Bugs ({feedback.bugs.length})
          </p>
          <ul className="space-y-0.5 text-xs text-muted-foreground">
            {feedback.bugs.map((b) => (
              <li key={b}>• {b}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-2 text-xs text-muted-foreground">
        <span>{feedback.hoursPlayed}h played</span>
        <span>{feedback.wouldRecommend ? "Would recommend" : "Wouldn't recommend yet"}</span>
      </div>
    </Card>
  );
}
