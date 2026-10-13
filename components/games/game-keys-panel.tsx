"use client";

import { useState } from "react";
import { KeyRound, Trash2 } from "lucide-react";

import type { Game } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { useGameKeys, useUser } from "@/lib/hooks/use-grogu";
import { gamesService, ServiceError } from "@/lib/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

/** Matches the server's per-request limit (grogu_game_keys_add). */
const MAX_KEYS_PER_PASTE = 500;

function parseKeys(text: string): string[] {
  return [...new Set(text.split(/[\r\n,]+/).map((line) => line.trim()).filter(Boolean))];
}

/** Who a handed-out key went to. */
function AllocatedTo({ userId }: { userId: string | null }) {
  const user = useUser(userId ?? undefined);
  return <>{user?.name ?? "a tester"}</>;
}

/**
 * The game's reward-key inventory. When a studio approves a review with a key,
 * the server hands out one unused key from here, never the same one twice.
 */
export function GameKeysPanel({ game }: { game: Game }) {
  const toast = useToast();
  const keys = useGameKeys(game.id);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pasted = parseKeys(text);
  const available = keys.filter((k) => k.status === "available");
  const allocated = keys.filter((k) => k.status === "allocated");

  async function addKeys() {
    setError(null);
    if (pasted.length === 0) {
      setError("Paste at least one key.");
      return;
    }
    if (pasted.length > MAX_KEYS_PER_PASTE) {
      setError(`Add at most ${MAX_KEYS_PER_PASTE} keys at a time.`);
      return;
    }
    setSaving(true);
    try {
      const result = await gamesService.addGameKeys(game.id, pasted);
      setText("");
      toast({
        title: `${result.added} ${result.added === 1 ? "key" : "keys"} added`,
        description:
          result.skipped > 0
            ? `${result.skipped} ${result.skipped === 1 ? "was" : "were"} already in the inventory.`
            : undefined,
      });
    } catch (err) {
      setError(err instanceof ServiceError ? err.message : "Couldn't add the keys. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(keyId: string) {
    setError(null);
    setDeleting(keyId);
    try {
      await gamesService.deleteGameKey(game.id, keyId);
    } catch (err) {
      setError(err instanceof ServiceError ? err.message : "Couldn't remove the key.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <section
      id="game-keys"
      className="scroll-mt-24 space-y-5 rounded-xl border border-border bg-surface p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <KeyRound className="size-4 text-secondary" aria-hidden /> Reward keys
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Keys you can give testers when you approve their review. Each key is handed
            out once. Testers are told to check their email, so send them the key shown
            next to their review.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge tone={available.length > 0 ? "success" : "warning"}>
            {available.length} unused
          </Badge>
          <Badge tone="muted">{allocated.length} given</Badge>
        </div>
      </div>

      <Field
        label="Add keys"
        htmlFor="game-keys-input"
        hint="One per line (or comma-separated). Duplicates are skipped."
        error={error ?? undefined}
      >
        <Textarea
          id="game-keys-input"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"AAAA-BBBB-CCCC\nDDDD-EEEE-FFFF"}
          className="font-mono text-sm"
        />
      </Field>
      <div className="flex items-center justify-end gap-3">
        {pasted.length > 0 && (
          <span className="text-xs text-subtle-foreground">
            {pasted.length} {pasted.length === 1 ? "key" : "keys"} ready
          </span>
        )}
        <Button type="button" size="sm" onClick={addKeys} loading={saving}>
          Add keys
        </Button>
      </div>

      {keys.length > 0 && (
        <ul className="max-h-80 divide-y divide-border overflow-y-auto rounded-lg border border-border">
          {keys.map((key) => (
            <li
              key={key.id}
              className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5"
            >
              <code className="min-w-0 break-all font-mono text-xs text-foreground">
                {key.code}
              </code>
              {key.status === "available" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => remove(key.id)}
                  loading={deleting === key.id}
                  aria-label={`Remove key ${key.code}`}
                >
                  <Trash2 aria-hidden />
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Given to <AllocatedTo userId={key.allocatedTo} />
                  {key.allocatedAt ? ` · ${formatRelativeTime(key.allocatedAt)}` : ""}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
