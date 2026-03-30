"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarText } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  showSearch?: boolean;
  searchDefaultValue?: string;
}

export function Navbar({ showSearch = true, searchDefaultValue }: NavbarProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <header className="border-border flex h-14 w-full items-center justify-between border-b px-4 sm:h-17 sm:px-8 lg:px-20">
      {/* Mobile search expanded state */}
      {mobileSearchOpen ? (
        <form
          action="/"
          method="GET"
          className="flex w-full items-center gap-3 sm:hidden"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const search = formData.get("search") as string;
            if (search.trim()) {
              router.push(`/?search=${encodeURIComponent(search.trim())}`);
            }
            setMobileSearchOpen(false);
          }}
        >
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              name="search"
              placeholder="Search posts..."
              defaultValue={searchParams.get("search") ?? searchDefaultValue}
              className="pl-9"
              autoFocus
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setMobileSearchOpen(false);
            }}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </form>
      ) : (
        <>
          <Link href="/" className="text-foreground text-lg font-semibold sm:text-xl">
            Next Blog
          </Link>

          {showSearch && (
            <form action="/" method="GET" className="hidden w-80 sm:block">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  name="search"
                  placeholder="Search posts..."
                  defaultValue={searchDefaultValue}
                  className="pl-9"
                />
              </div>
            </form>
          )}

          <div className="flex items-center gap-3">
            {showSearch && (
              <button
                type="button"
                onClick={() => {
                  setMobileSearchOpen(true);
                }}
                className="text-muted-foreground hover:text-foreground sm:hidden"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
            <Link href="/profile">
              <Avatar>
                <AvatarText>😊</AvatarText>
              </Avatar>
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
