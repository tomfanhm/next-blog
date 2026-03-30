import type { Metadata } from "next";

import { auth } from "@/lib/auth";

import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your display identity for comments.",
};

export default async function ProfilePage() {
  const session = await auth();

  return (
    <main className="flex flex-1 items-center justify-center px-10 py-10">
      <ProfileForm defaultName={session?.user.name ?? ""} defaultAvatar="avatar-cat" />
    </main>
  );
}
