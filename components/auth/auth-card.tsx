import * as React from "react";
import Link from "next/link";

import { Card } from "@/components/ui/card";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <Card className="p-6 sm:p-7">
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="mt-6">{children}</div>
      </Card>
      <p className="text-center text-sm text-muted-foreground">{footer}</p>
      <p className="text-center text-xs text-muted-foreground">
        Prototype · no real accounts.{" "}
        <Link href="/" className="hover:text-foreground">
          Back to home
        </Link>
      </p>
    </div>
  );
}
