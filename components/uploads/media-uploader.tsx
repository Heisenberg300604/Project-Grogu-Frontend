"use client";

import { useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";

import { assetUrl } from "@/lib/assets";
import type { FeedbackMedia } from "@/lib/types";
import { ServiceError, uploadsService } from "@/lib/services";
import { Button } from "@/components/ui/button";

export const MAX_MEDIA = 6;

/**
 * Attaches screenshots and recordings to a review. Files upload as soon as
 * they are chosen; the parent holds the resulting list and submits it with the
 * feedback.
 */
export function MediaUploader({
  value,
  onChange,
  max = MAX_MEDIA,
}: {
  value: FeedbackMedia[];
  onChange: (next: FeedbackMedia[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const remaining = max - value.length;

  async function handleFiles(files: File[]) {
    setErrors([]);

    const accepted = files.slice(0, Math.max(0, remaining));
    const problems: string[] = [];
    if (files.length > accepted.length) {
      problems.push(`You can attach up to ${max} files.`);
    }

    setUploading(true);
    const added: FeedbackMedia[] = [];
    for (const file of accepted) {
      try {
        const uploaded = await uploadsService.uploadFile("review-media", file);
        added.push({
          url: uploaded.url,
          kind: uploaded.kind,
          name: uploaded.name,
        });
      } catch (err) {
        problems.push(
          err instanceof ServiceError
            ? err.message
            : `Couldn't upload "${file.name}".`,
        );
      }
    }
    setUploading(false);

    if (added.length) onChange([...value, ...added]);
    setErrors(problems);
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={uploadsService.UPLOAD_RULES["review-media"].accept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) void handleFiles(files);
        }}
      />

      {value.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((item) => {
            const src = assetUrl(item.url);
            return (
              <li
                key={item.url}
                className="relative overflow-hidden rounded-lg border border-border bg-elevated"
              >
                {src && item.kind === "image" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={item.name || "Attached screenshot"}
                    className="aspect-video w-full object-cover"
                  />
                )}
                {src && item.kind === "video" && (
                  <video
                    src={src}
                    muted
                    preload="metadata"
                    className="aspect-video w-full object-cover"
                    aria-label={item.name || "Attached recording"}
                  />
                )}
                <p className="truncate px-2 py-1.5 text-xs text-muted-foreground">
                  {item.name || (item.kind === "video" ? "Recording" : "Screenshot")}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onChange(value.filter((m) => m.url !== item.url))
                  }
                  aria-label={`Remove ${item.name || "attachment"}`}
                  className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-dark/80 text-foreground backdrop-blur-sm transition-colors hover:bg-dark focus-visible:outline-none"
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          loading={uploading}
          disabled={remaining <= 0}
          onClick={() => inputRef.current?.click()}
        >
          <Paperclip aria-hidden />
          {value.length ? "Add more" : "Attach files"}
        </Button>
        <p className="text-xs text-subtle-foreground">
          {value.length}/{max} · {uploadsService.UPLOAD_RULES["review-media"].hint}
        </p>
      </div>

      {errors.length > 0 && (
        <ul className="space-y-1 text-xs text-destructive" role="alert">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
