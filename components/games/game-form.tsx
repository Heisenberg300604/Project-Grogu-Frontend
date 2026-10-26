"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import {
  GAME_STATUS_LABELS,
  GENRE_LABELS,
  GENRE_OPTIONS,
  PLATFORM_LABELS,
  PLATFORM_OPTIONS,
} from "@/lib/constants";
import type { Game, GameGenre, GamePlatform, GameStatus } from "@/lib/types";
import { gamesService, ServiceError } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";
import { GameArt } from "@/components/games/game-cover";
import { PosterUpload } from "@/components/uploads/poster-upload";

const HUES = [190, 130, 25, 95, 275, 320, 210, 0, 50, 160];
const STATUSES = Object.keys(GAME_STATUS_LABELS) as GameStatus[];

const schema = z.object({
  title: z.string().trim().min(2, "Give your game a title."),
  tagline: z.string().trim().min(8, "A short hook — at least 8 characters.").max(120),
  description: z.string().trim().min(40, "Describe the game in a sentence or two."),
  genres: z.array(z.string()).min(1, "Pick at least one genre."),
  platforms: z.array(z.string()).min(1, "Pick at least one platform."),
  status: z.enum(STATUSES),
  buildVersion: z.string().trim().min(1, "e.g. 0.1.0"),
  accentHue: z.number(),
});

type FormValues = z.infer<typeof schema>;

const CHIP =
  "rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-colors duration-[120ms]";

/** Section wrapper — heading plus fields, separated by a hairline. */
function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 border-t-2 border-dashed border-border pt-6 first:border-0 first:pt-0">
      <div className="space-y-1">
        <h2 className="font-display text-lg font-bold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function GameForm({ initialGame }: { initialGame?: Game }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    initialGame?.coverImageUrl ?? null,
  );
  const toast = useToast();
  const isEdit = Boolean(initialGame);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialGame?.title ?? "",
      tagline: initialGame?.tagline ?? "",
      description: initialGame?.description ?? "",
      genres: initialGame?.genres ?? [],
      platforms: initialGame?.platforms ?? [],
      status: initialGame?.status ?? "in-development",
      buildVersion: initialGame?.buildVersion ?? "0.1.0",
      accentHue: initialGame?.accentHue ?? 190,
    },
  });

  const title = useWatch({ control, name: "title" });
  const hue = useWatch({ control, name: "accentHue" });
  const genres = useWatch({ control, name: "genres" }) ?? [];
  const platforms = useWatch({ control, name: "platforms" }) ?? [];

  function toggle(field: "genres" | "platforms", current: string[], value: string) {
    setValue(
      field,
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
      { shouldValidate: true },
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSuccessMessage(null);
    try {
      const input = {
        title: values.title,
        tagline: values.tagline,
        description: values.description,
        genres: values.genres as GameGenre[],
        platforms: values.platforms as GamePlatform[],
        status: values.status,
        buildVersion: values.buildVersion,
        accentHue: values.accentHue,
        // null removes an existing poster; the server keeps it when the key is absent.
        coverImageUrl,
      };
      if (initialGame) {
        await gamesService.updateGame(initialGame.id, input);
        setSuccessMessage("Game updated successfully.");
        toast({ title: "Game updated" });
      } else {
        await gamesService.createGame(input);
        router.push("/developer/games");
      }
    } catch (error) {
      setFormError(
        error instanceof ServiceError
          ? error.message
          : "Couldn't save the game. Please try again.",
      );
    }
  });

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[
          { label: "Games", href: "/developer/games" },
          { label: isEdit ? "Edit game" : "New game" },
        ]}
        title={isEdit ? "Edit game" : "Add a game"}
        description={
          isEdit
            ? "Update your game's details without changing its playtest history."
            : "Register a game so you can run playtests for it."
        }
      />

      <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_19rem]">
        <div className="min-w-0 space-y-6">
          <FormSection
            title="Basics"
            description="How your game is introduced to testers."
          >
            <div className="space-y-5">
              <Field label="Title" htmlFor="game-title" error={errors.title?.message} required>
                <Input id="game-title" {...register("title")} />
              </Field>
              <Field
                label="Tagline"
                htmlFor="game-tagline"
                hint="One line that sells the game."
                error={errors.tagline?.message}
                required
              >
                <Input id="game-tagline" {...register("tagline")} />
              </Field>
              <Field
                label="Description"
                htmlFor="game-description"
                error={errors.description?.message}
                required
              >
                <Textarea id="game-description" rows={4} {...register("description")} />
              </Field>
            </div>
          </FormSection>

          <FormSection
            title="Classification"
            description="Genre and platform drive how testers find the game — and the cover art Grogu generates for it."
          >
            <div className="space-y-5">
              <Field label="Genres" error={errors.genres?.message} required>
                <div className="flex flex-wrap gap-1.5">
                  {GENRE_OPTIONS.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      aria-pressed={genres.includes(genre)}
                      onClick={() => toggle("genres", genres, genre)}
                      className={cn(
                        CHIP,
                        genres.includes(genre)
                          ? "border-line bg-primary text-primary-foreground shadow-sm"
                          : "border-line bg-surface text-foreground hover:-translate-y-0.5",
                      )}
                    >
                      {GENRE_LABELS[genre]}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Platforms" error={errors.platforms?.message} required>
                <div className="flex flex-wrap gap-1.5">
                  {PLATFORM_OPTIONS.map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      aria-pressed={platforms.includes(platform)}
                      onClick={() => toggle("platforms", platforms, platform)}
                      className={cn(
                        CHIP,
                        platforms.includes(platform)
                          ? "border-line bg-primary text-primary-foreground shadow-sm"
                          : "border-line bg-surface text-foreground hover:-translate-y-0.5",
                      )}
                    >
                      {PLATFORM_LABELS[platform]}
                    </button>
                  ))}
                </div>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Status" htmlFor="game-status" error={errors.status?.message}>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="game-status">
                          <SelectValue>
                            {GAME_STATUS_LABELS[field.value as GameStatus]}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {GAME_STATUS_LABELS[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field
                  label="Build version"
                  htmlFor="game-build"
                  error={errors.buildVersion?.message}
                >
                  <Input id="game-build" {...register("buildVersion")} />
                </Field>
              </div>
            </div>
          </FormSection>

          {formError && (
            <p
              className="rounded-md border-2 border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {formError}
            </p>
          )}

          {successMessage && (
            <p
              className="rounded-md border-2 border-success bg-success/10 px-3 py-2 text-sm text-success"
              role="status"
            >
              {successMessage}
            </p>
          )}

          <div className="flex gap-2">
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add game"}
            </Button>
            <Button asChild variant="ghost" type="button">
              <Link href="/developer/games">Cancel</Link>
            </Button>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="overflow-hidden rounded-xl border-2 border-line bg-surface">
            <GameArt
              game={{
                title: title || "Your game",
                accentHue: hue,
                genres: genres as GameGenre[],
                coverImageUrl: coverImageUrl ?? undefined,
              }}
              ratio="16/10"
              scrim
            >
              <p className="absolute inset-x-4 bottom-3 truncate font-display text-base font-bold text-white">
                {title || "Your game"}
              </p>
            </GameArt>
            <div className="space-y-3 p-4">
              <p className="text-label text-subtle-foreground">Poster</p>
              <PosterUpload value={coverImageUrl} onChange={setCoverImageUrl} />
              <p className="text-xs text-muted-foreground">
                {coverImageUrl
                  ? "Your poster is used on cards and the playtest page."
                  : "Without a poster, cover art is generated from the accent colour and the game's first genre."}
              </p>
            </div>
          </div>

          <div className="rounded-xl border-2 border-line bg-surface p-4">
            <p className="text-label mb-3 text-subtle-foreground">Cover accent</p>
            <div className="flex flex-wrap gap-2">
              {HUES.map((h) => (
                <button
                  key={h}
                  type="button"
                  aria-label={`Accent hue ${h}`}
                  aria-pressed={hue === h}
                  onClick={() => setValue("accentHue", h)}
                  className={cn(
                    "size-7 rounded-full border-2 transition-transform",
                    hue === h ? "border-foreground" : "border-transparent hover:scale-110",
                  )}
                  style={{ backgroundColor: `hsl(${h} 55% 45%)` }}
                />
              ))}
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
