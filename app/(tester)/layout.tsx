import type { ReactNode } from "react";

import { TESTER_NAV } from "@/lib/constants";
import { AppShell } from "@/components/layout/app-shell";

export default function TesterLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell roleLabel="Tester" nav={TESTER_NAV}>
      {children}
    </AppShell>
  );
}
