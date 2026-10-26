"use client";

import { useEffect, useRef, useState } from "react";
import { Bug, Sparkles, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Hole = null | "bug" | "feature";

const SESSION_SECONDS = 20;
const SPAWN_EVERY_MS = 620;
const VISIBLE_FOR_MS = 1000;
const BUG_CHANCE = 0.78;

const emptyBoard = (): Hole[] => Array<Hole>(9).fill(null);

interface Pop {
  id: number;
  hole: number;
  text: string;
  good: boolean;
}

/**
 * "Warm-up round": squash the bugs, spare the features. Purely decorative — it
 * keeps no state outside this component and talks to no API.
 */
export function BugSquash() {
  const [holes, setHoles] = useState<Hole[]>(emptyBoard);
  const [status, setStatus] = useState<"idle" | "play" | "done">("idle");
  const [time, setTime] = useState(SESSION_SECONDS);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [pops, setPops] = useState<Pop[]>([]);
  const timers = useRef<number[]>([]);
  const holesRef = useRef(holes);
  const popId = useRef(0);

  useEffect(() => {
    holesRef.current = holes;
  }, [holes]);

  const clearAll = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clearAll, []);

  const start = () => {
    clearAll();
    setHoles(emptyBoard());
    setScore(0);
    setTime(SESSION_SECONDS);
    setStatus("play");
    timers.current.push(window.setInterval(() => setTime((t) => t - 1), 1000));
    timers.current.push(
      window.setInterval(() => {
        const free = holesRef.current.flatMap((h, i) => (h ? [] : [i]));
        if (!free.length) return;
        const i = free[Math.floor(Math.random() * free.length)];
        const kind: Hole = Math.random() < BUG_CHANCE ? "bug" : "feature";
        setHoles((hs) => hs.map((v, k) => (k === i ? kind : v)));
        timers.current.push(
          window.setTimeout(
            () => setHoles((hs) => hs.map((v, k) => (k === i ? null : v))),
            VISIBLE_FOR_MS,
          ),
        );
      }, SPAWN_EVERY_MS),
    );
  };

  useEffect(() => {
    if (status !== "play" || time > 0) return;
    clearAll();
    // Session over: reset the board and bank the score.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHoles(emptyBoard());
    setStatus("done");
    setBest((b) => Math.max(b, score));
  }, [time, status, score]);

  const whack = (i: number) => {
    const hole = holes[i];
    if (status !== "play" || !hole) return;
    const good = hole === "bug";
    setScore((s) => Math.max(0, s + (good ? 1 : -1)));
    setHoles((hs) => hs.map((v, k) => (k === i ? null : v)));
    const id = ++popId.current;
    setPops((p) => [...p, { id, hole: i, text: good ? "+1" : "-1", good }]);
    window.setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 650);
  };

  const rank = score >= 12 ? "Lead QA" : score >= 7 ? "Pro Tester" : "Rookie";

  return (
    <div className="rounded-xl border-2 border-line bg-surface p-5 shadow-md md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="hud flex items-center gap-4">
          <span>
            Score <b className="ml-1 text-lg text-secondary">{String(score).padStart(2, "0")}</b>
          </span>
          <span className="text-muted-foreground">
            Best <b className="ml-1 text-foreground">{String(best).padStart(2, "0")}</b>
          </span>
        </div>
        <div
          role="timer"
          className={cn(
            "hud rounded-lg border-2 border-line px-3 py-2",
            time <= 5 && status === "play" ? "bg-coral text-ink" : "bg-elevated",
          )}
        >
          00:{String(Math.max(time, 0)).padStart(2, "0")}
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-3 gap-3">
          {holes.map((hole, i) => (
            <button
              key={i}
              type="button"
              onClick={() => whack(i)}
              aria-label={hole ? (hole === "bug" ? "Squash bug" : "Intended feature") : "Empty hole"}
              className="relative grid aspect-square place-items-center overflow-hidden rounded-2xl border-2 border-line bg-elevated"
            >
              <span aria-hidden className="absolute bottom-2 h-3 w-1/2 rounded-full bg-foreground/15" />
              {hole && (
                <span
                  className={cn(
                    "a-bounce-in grid size-[68%] place-items-center rounded-full border-2 border-line text-ink shadow-sm",
                    hole === "bug" ? "bg-coral" : "bg-mint",
                  )}
                >
                  {hole === "bug" ? <Bug size={28} aria-hidden /> : <Sparkles size={28} aria-hidden />}
                </span>
              )}
              {pops
                .filter((p) => p.hole === i)
                .map((p) => (
                  <span
                    key={p.id}
                    aria-hidden
                    className={cn(
                      "hud pointer-events-none absolute text-lg",
                      p.good ? "text-success" : "text-destructive",
                    )}
                    style={{ animation: "g-score-up .65s ease-out forwards" }}
                  >
                    {p.text}
                  </span>
                ))}
            </button>
          ))}
        </div>

        {status !== "play" && (
          <div className="a-pop absolute inset-0 grid place-items-center rounded-2xl bg-background/90 p-6 text-center">
            <div>
              {status === "done" ? (
                <>
                  <Trophy className="mx-auto mb-3 text-gold" size={40} aria-hidden />
                  <div className="hud mb-2 text-muted-foreground">Session complete</div>
                  <div className="font-display text-3xl font-extrabold">{score} bugs squashed</div>
                  <div className="mb-5 mt-1 font-semibold text-secondary">Rank: {rank}</div>
                </>
              ) : (
                <>
                  <div className="hud mb-2 text-muted-foreground">Press start</div>
                  <div className="mb-5 font-display text-2xl font-extrabold">
                    Squash bugs. Spare features.
                  </div>
                </>
              )}
              <Button onClick={start}>{status === "done" ? "Play again" : "Start session"}</Button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-3 rounded-full bg-coral" /> Bug = +1
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-3 rounded-full bg-mint" /> Working as intended = -1
        </span>
      </p>
    </div>
  );
}
