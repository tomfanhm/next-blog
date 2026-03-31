"use client";

import { LogOut, PenSquare, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HeaderUser {
  name: string;
  image: string | null;
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleEscapeKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [menuOpen]);

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
            <div ref={menuRef} className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setMenuOpen((prev) => !prev);
                }}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="size-8 rounded-full"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full text-sm font-medium">
                    {user.name.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </Button>

              {menuOpen && (
                <div
                  role="menu"
                  className="bg-popover border-border absolute top-full right-0 z-50 mt-2 w-48 rounded-md border py-1 shadow-md"
                >
                  <div className="border-border border-b px-3 py-2">
                    <p className="text-sm font-medium">{user.name || "User"}</p>
                  </div>

                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-start gap-2 rounded-none px-3 py-2"
                    asChild
                  >
                    <Link
                      role="menuitem"
                      href="/profile"
                      onClick={() => {
                        setMenuOpen(false);
                      }}
                    >
                      <User className="size-4" />
                      Profile
                    </Link>
                  </Button>

                  {user.role === "admin" && (
                    <Button
                      variant="ghost"
                      className="h-auto w-full justify-start gap-2 rounded-none px-3 py-2"
                      asChild
                    >
                      <Link
                        role="menuitem"
                        href="/create"
                        onClick={() => {
                          setMenuOpen(false);
                        }}
                      >
                        <PenSquare className="size-4" />
                        Create Post
                      </Link>
                    </Button>
                  )}

                  {onSignOut && (
                    <div className="border-border border-t">
                      <form action={onSignOut}>
                        <Button
                          type="submit"
                          variant="ghost"
                          role="menuitem"
                          className="h-auto w-full justify-start gap-2 rounded-none px-3 py-2"
                        >
                          <LogOut className="size-4" />
                          Log out
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
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
