import type { ReactNode } from "react";

import { DEVELOPER_NAV } from "@/lib/constants";
import { AppShell } from "@/components/layout/app-shell";

export default function DeveloperLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell roleLabel="Developer" nav={DEVELOPER_NAV}>
      {children}
    </AppShell>
  );
}
