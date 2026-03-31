import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { ProfileForm } from "./profile-form";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/profile");

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <ProfileForm userName={session.user.name ?? ""} />
    </div>
  );
}
