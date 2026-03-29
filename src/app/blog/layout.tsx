import type { ReactNode } from "react";

import { Navbar } from "@/components/navbar";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar />
      {children}
    </div>
  );
}
