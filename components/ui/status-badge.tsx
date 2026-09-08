import {
  APPLICATION_STATUS_META,
  GAME_STATUS_LABELS,
  PLAYTEST_STATUS_META,
  TEST_STAGE_META,
} from "@/lib/constants";
import type {
  ApplicationStatus,
  GameStatus,
  PlaytestStatus,
  TestStage,
} from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const GAME_STATUS_TONE: Record<GameStatus, "muted" | "info" | "success"> = {
  "in-development": "muted",
  alpha: "info",
  beta: "info",
  released: "success",
};

/** One badge component for every domain status, so tone/label stay consistent. */
export function StatusBadge(
  props:
    | { kind: "playtest"; status: PlaytestStatus }
    | { kind: "application"; status: ApplicationStatus }
    | { kind: "test"; status: TestStage }
    | { kind: "game"; status: GameStatus },
) {
  if (props.kind === "playtest") {
    const meta = PLAYTEST_STATUS_META[props.status];
    return <Badge tone={meta.tone}>{meta.label}</Badge>;
  }
  if (props.kind === "application") {
    const meta = APPLICATION_STATUS_META[props.status];
    return <Badge tone={meta.tone}>{meta.label}</Badge>;
  }
  if (props.kind === "test") {
    const meta = TEST_STAGE_META[props.status];
    return <Badge tone={meta.tone}>{meta.label}</Badge>;
  }
  return (
    <Badge tone={GAME_STATUS_TONE[props.status]}>
      {GAME_STATUS_LABELS[props.status]}
    </Badge>
  );
}
