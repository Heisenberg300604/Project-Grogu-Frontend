import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5 text-center">
      <Logo />
      <div className="space-y-2">
        <p className="font-display text-5xl font-bold">404</p>
        <p className="text-muted-foreground">
          That page doesn&apos;t exist — or hasn&apos;t been built yet.
        </p>
      </div>
      <Link href="/" className={buttonVariants({ variant: "primary", size: "md" })}>
        Back to home
      </Link>
    </div>
  );
}
