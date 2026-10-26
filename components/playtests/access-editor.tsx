"use client";

import { useState } from "react";

import type { Playtest } from "@/lib/types";
import { playtestsService, ServiceError } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

const HTTP_URL = /^https?:\/\/\S+$/i;

/**
 * Lets the owning studio set how accepted testers get the game: build link,
 * access key and install notes. Works at any point before the playtest is
 * archived, so a broken link can be fixed after publishing.
 */
export function AccessEditor({ playtest }: { playtest: Playtest }) {
  const toast = useToast();
  const [buildUrl, setBuildUrl] = useState(playtest.buildUrl);
  const [accessKey, setAccessKey] = useState(playtest.accessKey);
  const [instructions, setInstructions] = useState(playtest.installInstructions);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const archived = playtest.status === "archived";
  const dirty =
    buildUrl.trim() !== playtest.buildUrl ||
    accessKey.trim() !== playtest.accessKey ||
    instructions.trim() !== playtest.installInstructions;

  const linkProblem =
    buildUrl.trim() !== "" && !HTTP_URL.test(buildUrl.trim())
      ? "Enter a full link, starting with http:// or https://."
      : undefined;

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (linkProblem) return;

    setError(null);
    setSaving(true);
    try {
      await playtestsService.saveAccess(playtest.id, {
        buildUrl: buildUrl.trim(),
        accessKey: accessKey.trim(),
        installInstructions: instructions.trim(),
      });
      toast({
        title: "Game access updated",
        description: "Accepted testers see the new details straight away.",
        tone: "success",
      });
    } catch (err) {
      setError(
        err instanceof ServiceError
          ? err.message
          : "Couldn't save the access details. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-5" noValidate>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Only testers you accept can see these. Everyone else — including other
        studios and signed-out visitors — receives nothing.
      </p>

      <Field
        label="Build or download link"
        htmlFor="access-build"
        hint="A Steam beta, itch.io, TestFlight or direct download link."
        error={linkProblem}
      >
        <Input
          id="access-build"
          type="url"
          inputMode="url"
          placeholder="https://"
          value={buildUrl}
          disabled={archived}
          aria-invalid={!!linkProblem}
          onChange={(e) => setBuildUrl(e.target.value)}
        />
      </Field>

      <Field
        label="Access key or password"
        htmlFor="access-key"
        hint="If your build needs one. Every accepted tester sees the same key."
      >
        <Input
          id="access-key"
          autoComplete="off"
          value={accessKey}
          disabled={archived}
          maxLength={200}
          onChange={(e) => setAccessKey(e.target.value)}
        />
      </Field>

      <Field
        label="Install instructions"
        htmlFor="access-instructions"
        hint="How to install and launch the build, and anything testers should know first."
      >
        <Textarea
          id="access-instructions"
          rows={5}
          value={instructions}
          disabled={archived}
          maxLength={4000}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </Field>

      {error && (
        <p
          className="rounded-md border-2 border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          loading={saving}
          disabled={archived || !dirty || !!linkProblem}
        >
          Save access details
        </Button>
        {archived && (
          <span className="text-xs text-subtle-foreground">
            Archived playtests can&apos;t be edited.
          </span>
        )}
      </div>
    </form>
  );
}
