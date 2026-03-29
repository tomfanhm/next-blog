import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Next Starter</h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Enterprise-grade Next.js starter with App Router, Auth.js, Prisma, TanStack Query, and
          more.
        </p>
      </div>

      <div className="flex gap-4">
        <Button asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    </main>
  );
}
