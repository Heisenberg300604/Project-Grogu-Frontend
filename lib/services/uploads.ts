/**
 * File uploads — game posters and review screenshots/recordings. Backed by
 * `POST /api/v1/uploads`.
 *
 * The checks here only exist to give an immediate, specific message. The server
 * re-checks everything from the file's real bytes and is the authority.
 */

import type { FeedbackMedia } from "@/lib/types";

import { apiFetch, ServiceError } from "./http";

export type UploadKind = "poster" | "review-media" | "avatar";

const MB = 1024 * 1024;

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/webm"];

export const UPLOAD_RULES: Record<
  UploadKind,
  { imageLimit: number; videoLimit: number; accept: string; hint: string }
> = {
  poster: {
    imageLimit: 5 * MB,
    videoLimit: 0,
    accept: IMAGE_TYPES.join(","),
    hint: "PNG, JPEG or WebP, up to 5 MB",
  },
  "review-media": {
    imageLimit: 10 * MB,
    videoLimit: 50 * MB,
    accept: [...IMAGE_TYPES, ...VIDEO_TYPES].join(","),
    hint: "PNG, JPEG or WebP up to 10 MB, MP4 or WebM up to 50 MB",
  },
  avatar: {
    imageLimit: 2 * MB,
    videoLimit: 0,
    accept: IMAGE_TYPES.join(","),
    hint: "PNG, JPEG or WebP, up to 2 MB",
  },
};

/** A user-facing reason the file can't be uploaded, or null when it looks fine. */
export function checkUpload(kind: UploadKind, file: File): string | null {
  const rules = UPLOAD_RULES[kind];
  const isImage = IMAGE_TYPES.includes(file.type);
  const isVideo = VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return `"${file.name}" isn't a supported file. Use ${rules.hint}.`;
  }
  if (isVideo && rules.videoLimit === 0) {
    return "Videos can't be used here. Choose an image.";
  }

  const limit = isVideo ? rules.videoLimit : rules.imageLimit;
  if (file.size > limit) {
    return `"${file.name}" is too large. The limit is ${limit / MB} MB.`;
  }

  return null;
}

/** Uploads one file and returns where it is stored. */
export async function uploadFile(
  kind: UploadKind,
  file: File,
): Promise<FeedbackMedia & { size: number }> {
  const problem = checkUpload(kind, file);
  if (problem) throw new ServiceError(problem, "validation");

  const form = new FormData();
  form.append("file", file);

  return apiFetch(`/api/v1/uploads?kind=${kind}`, {
    method: "POST",
    body: form,
  });
}
