import Link from "next/link";
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
      <Link
        href="#main-content"
        className="bg-primary text-primary-foreground fixed top-0 left-1/2 z-50 -translate-x-1/2 -translate-y-full rounded-b-md px-4 py-2 text-sm font-medium transition-transform focus:translate-y-0"
      >
        Skip to content
      </Link>
      <Suspense>
        <BlogHeader user={user} onSignOut={handleSignOut} />
      </Suspense>
      <main id="main-content" className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
