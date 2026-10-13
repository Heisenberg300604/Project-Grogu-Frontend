"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

import { ServiceError, uploadsService } from "@/lib/services";
import type { UploadKind } from "@/lib/services/uploads";
import { Button } from "@/components/ui/button";

/**
 * Chooses and uploads one image: a game poster by default, or a profile
 * picture with `kind="avatar"`. The parent owns the stored value (an
 * `/uploads/...` path or null) and shows the preview; this is only the control.
 */
export function PosterUpload({
  value,
  onChange,
  kind = "poster",
  noun = "poster",
  note = "16:9 works best.",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  kind?: Extract<UploadKind, "poster" | "avatar">;
  /** What the image is, for the button labels and messages. */
  noun?: string;
  /** Shown after the size/type hint. */
  note?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const uploaded = await uploadsService.uploadFile(kind, file);
      onChange(uploaded.url);
    } catch (err) {
      setError(
        err instanceof ServiceError
          ? err.message
          : `Couldn't upload the ${noun}. Please try again.`,
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2.5">
      <input
        ref={inputRef}
        type="file"
        accept={uploadsService.UPLOAD_RULES[kind].accept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          // Reset so choosing the same file again still fires onChange.
          e.target.value = "";
          if (file) void handleFile(file);
        }}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          loading={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus aria-hidden />
          {value ? `Replace ${noun}` : `Upload ${noun}`}
        </Button>
        {value && !uploading && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setError(null);
              onChange(null);
            }}
          >
            <Trash2 aria-hidden /> Remove
          </Button>
        )}
      </div>

      <p className="text-xs text-subtle-foreground">
        {uploadsService.UPLOAD_RULES[kind].hint}. {note}
      </p>

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
