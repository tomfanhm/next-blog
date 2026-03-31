import type { ReactNode } from "react";
import { Suspense } from "react";

import { BottomNav } from "@/components/blog/bottom-nav";
import { BlogHeader } from "@/components/blog/header";
import { auth, signOut } from "@/lib/auth";

export default async function MainLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const user = session?.user
    ? { name: session.user.name ?? "", image: session.user.image ?? null, role: session.user.role }
    : null;

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Suspense>
        <BlogHeader user={user} onSignOut={handleSignOut} />
      </Suspense>
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
