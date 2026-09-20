import type { Metadata } from "next";

import { DeveloperProfileEditor } from "@/components/profile/profile-editors";

export const metadata: Metadata = {
  title: "Edit studio profile",
  description: "Update your studio profile on Grogu.",
};

export default function EditDeveloperProfilePage() {
  return <DeveloperProfileEditor />;
}
