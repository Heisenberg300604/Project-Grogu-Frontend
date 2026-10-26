"use client";

import { useState } from "react";
import { Check, CheckCircle2, Copy, ExternalLink, KeyRound } from "lucide-react";

import { safeHttpUrl } from "@/lib/safe-url";
import type { Playtest } from "@/lib/types";
import { Button } from "@/components/ui/button";

/**
 * How an accepted tester gets the game: the studio's build link, the access key
 * if there is one, and the install notes.
 *
 * `onOpen` records that the tester has the build (it unlocks the task list). It
 * runs alongside opening the link, not before it, so the browser never blocks
 * the new tab.
 */
export function AccessPanel({
  playtest,
  downloaded,
  busy,
  onOpen,
}: {
  playtest: Pick<Playtest, "buildUrl" | "accessKey" | "installInstructions">;
  downloaded: boolean;
  busy: boolean;
  onOpen: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const link = safeHttpUrl(playtest.buildUrl);
  const hasDetails = Boolean(link || playtest.accessKey || playtest.installInstructions);

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(playtest.accessKey);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); the key is
      // still on screen to select by hand.
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {link ? (
          <Button asChild variant={downloaded ? "secondary" : "primary"}>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (!downloaded) onOpen();
              }}
            >
              {downloaded ? "Open the game again" : "Open the game"}
              <ExternalLink aria-hidden />
            </a>
          </Button>
        ) : (
          <Button
            onClick={onOpen}
            loading={busy}
            disabled={downloaded}
            variant={downloaded ? "secondary" : "primary"}
          >
            {downloaded ? (
              <>
                <CheckCircle2 /> Marked as received
              </>
            ) : (
              "I have the build"
            )}
          </Button>
        )}
        {downloaded && link && (
          <span className="inline-flex items-center gap-1.5 text-sm text-success">
            <CheckCircle2 className="size-4" aria-hidden /> Build opened
          </span>
        )}
      </div>

      {!link && (
        <p className="rounded-lg border-2 border-line bg-elevated px-3.5 py-3 text-sm text-muted-foreground">
          {hasDetails
            ? "The studio hasn't shared a download link. Follow the instructions below, then mark the build as received."
            : "The studio hasn't shared download details yet. Once you have the build, mark it as received to start the tasks."}
        </p>
      )}

      {playtest.accessKey && (
        <div className="space-y-1.5">
          <p className="text-label flex items-center gap-1.5 text-subtle-foreground">
            <KeyRound className="size-3.5" aria-hidden /> Access key
          </p>
          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-md border-2 border-line bg-elevated px-3 py-2 font-mono text-sm">
              {playtest.accessKey}
            </code>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={copyKey}
              aria-label="Copy access key"
            >
              {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      )}

      {playtest.installInstructions && (
        <div className="space-y-1.5">
          <p className="text-label text-subtle-foreground">Install instructions</p>
          <p className="whitespace-pre-wrap rounded-lg border-2 border-line bg-elevated px-3.5 py-3 text-sm leading-relaxed text-muted-foreground">
            {playtest.installInstructions}
          </p>
        </div>
      )}
    </div>
  );
}
