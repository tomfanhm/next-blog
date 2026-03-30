import type { Metadata } from "next";

import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your blog posts and settings.",
};

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {session?.user.name ?? "User"}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Total Users", value: "—" },
          { title: "Active Sessions", value: "—" },
          { title: "API Requests", value: "—" },
        ].map((stat) => (
          <div key={stat.title} className="border-border bg-card rounded-lg border p-6">
            <p className="text-muted-foreground text-sm">{stat.title}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
