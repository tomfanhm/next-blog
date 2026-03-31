"use client";

import { LogOut, PenSquare, Search, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { avatarEmoji } from "@/components/blog/avatar-picker";
import { Avatar, AvatarFallback, AvatarText } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HeaderUser {
  name: string;
  avatar: string;
  role: string;
}

interface BlogHeaderProps {
  className?: string;
  showSearch?: boolean;
  user?: HeaderUser | null;
  onSignOut?: () => Promise<void>;
}

export function BlogHeader({ className, showSearch = true, user, onSignOut }: BlogHeaderProps) {
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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 rounded-full">
                  <Avatar size="sm">
                    <AvatarText>{avatarEmoji(user.avatar)}</AvatarText>
                    <AvatarFallback>{user.name.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{user.name || "User"}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/create">
                      <PenSquare className="size-4" />
                      Create Post
                    </Link>
                  </DropdownMenuItem>
                )}

                {onSignOut && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        void onSignOut();
                      }}
                    >
                      <LogOut className="size-4" />
                      Log out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/sign-in">Log in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
