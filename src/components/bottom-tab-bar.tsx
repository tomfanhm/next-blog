"use client";

import { House, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "HOME", icon: House },
  { href: "/?focus=search", label: "SEARCH", icon: Search },
  { href: "/profile", label: "PROFILE", icon: User },
] as const;

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-5 pt-3 pb-5 md:hidden">
      <div className="border-border bg-card flex h-16 w-full items-center rounded-full border p-1">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/" && !tab.href.includes("focus")
              : pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-full py-2 transition-colors ${
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-4.5" />
              <span className="text-xs font-semibold tracking-wide">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
