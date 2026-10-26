import { cn } from "@/lib/utils";

/** Endless ticker band. Decorative, so it is hidden from assistive tech. */
export function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const row = items.map((item, i) => (
    <span key={i} className="hud flex items-center gap-8 whitespace-nowrap text-[0.8rem]">
      {item}
      <span className="text-gold">★</span>
    </span>
  ));

  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden border-y-2 border-line bg-grape py-3.5 text-white",
        className,
      )}
    >
      <div className="a-marquee flex w-max gap-8 pr-8">
        {row}
        {row}
      </div>
    </div>
  );
}
