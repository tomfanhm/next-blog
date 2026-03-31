"use client";

import { Search, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BlogHeaderProps {
  className?: string;
  showSearch?: boolean;
}

export function BlogHeader({ className, showSearch = true }: BlogHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function handleSearch(e: React.SyntheticEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  }

  return (
    <header className={cn("border-border border-b", className)}>
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-lg font-bold">
          Next Blog
        </Link>

        {showSearch && (
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search posts..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                className="h-9 w-64 pl-9"
              />
            </div>
          </form>
        )}

        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="text-muted-foreground hover:text-foreground hidden md:block"
          >
            <Settings className="size-5" />
          </Link>
          <Link href="/profile" className="text-muted-foreground hover:text-foreground md:hidden">
            <User className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
