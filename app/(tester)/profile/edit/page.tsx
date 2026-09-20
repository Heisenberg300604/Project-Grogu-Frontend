import type { Metadata } from "next";

import { TesterProfileEditor } from "@/components/profile/profile-editors";

export const metadata: Metadata = {
  title: "Edit profile",
  description: "Update your tester profile.",
};

export default function EditProfilePage() {
  return <TesterProfileEditor />;
}
