import { redirect } from "next/navigation";

import { updateProfileAction } from "@/app/actions/profile";
import { ProfileForm } from "@/components/blog/profile-form";
import { auth } from "@/lib/auth";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/profile");

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <ProfileForm userName={session.user.name ?? ""} onSubmit={updateProfileAction} />
    </div>
  );
}
