import { assetUrl } from "@/lib/assets";
import type { FeedbackMedia } from "@/lib/types";

/**
 * Screenshots and recordings a tester attached to a review, as a studio sees
 * them. Images open full size in a new tab; videos play inline.
 */
export function MediaGallery({ media }: { media: FeedbackMedia[] }) {
  const items = media.flatMap((item) => {
    const src = assetUrl(item.url);
    return src ? [{ ...item, src }] : [];
  });

  if (items.length === 0) return null;

  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold text-muted-foreground">
        Attachments ({items.length})
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.url}
            className="overflow-hidden rounded-lg border border-border bg-elevated"
          >
            {item.kind === "image" ? (
              <a
                href={item.src}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${item.name || "screenshot"} full size`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.name || "Tester screenshot"}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
              </a>
            ) : (
              <video
                src={item.src}
                controls
                preload="metadata"
                className="aspect-video w-full bg-dark object-cover"
                aria-label={item.name || "Tester recording"}
              />
            )}
            {item.name && (
              <p className="truncate px-2 py-1.5 text-xs text-muted-foreground">
                {item.name}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
