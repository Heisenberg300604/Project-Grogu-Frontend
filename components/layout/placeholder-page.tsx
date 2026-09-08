import Link from "next/link";
import { Construction } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Temporary scaffold for routes that exist for navigation/architecture reasons
 * but are implemented in a later task. Intentionally plain.
 */
export function PlaceholderPage({
  title,
  description,
  plannedFor,
  backHref = "/",
  backLabel = "Back to home",
}: {
  title: string;
  description: string;
  plannedFor?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <Card className="mx-auto max-w-xl">
      <CardContent className="flex flex-col items-start gap-4 p-8">
        <span className="grid size-10 place-items-center rounded-md bg-muted text-muted-foreground">
          <Construction className="size-5" aria-hidden />
        </span>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
          {plannedFor && (
            <p className="text-xs text-muted-foreground">
              Scope: <span className="text-foreground">{plannedFor}</span>
            </p>
          )}
        </div>
        <Link href={backHref} className={buttonVariants({ variant: "secondary", size: "sm" })}>
          {backLabel}
        </Link>
      </CardContent>
    </Card>
  );
}
