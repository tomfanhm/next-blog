import type { ReactNode } from "react";

import { BottomNav } from "@/components/blog/bottom-nav";
import { BlogHeader } from "@/components/blog/header";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <BlogHeader />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
