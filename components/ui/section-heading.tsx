import { cn } from "@/lib/utils";

/** Consistent eyebrow + title + lead block for marketing sections. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
      {lead && (
        <p
          className={cn(
            "max-w-2xl text-base text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
