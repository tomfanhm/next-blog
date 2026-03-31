import Link from "next/link";

import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen">
      <Link
        href="#main-content"
        className="bg-primary text-primary-foreground fixed top-0 left-1/2 z-50 -translate-x-1/2 -translate-y-full rounded-b-md px-4 py-2 text-sm font-medium transition-transform focus:translate-y-0"
      >
        Skip to content
      </Link>
      <header className="border-border border-b">
        <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="font-semibold">
            Next Blog
          </Link>
          <div className="flex items-center gap-4">
            {session?.user && (
              <>
                <span className="text-muted-foreground text-sm">{session.user.email}</span>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <Button variant="ghost" size="sm" type="submit">
                    Sign Out
                  </Button>
                </form>
              </>
            )}
          </div>
        </nav>
      </header>
      <main id="main-content" className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
