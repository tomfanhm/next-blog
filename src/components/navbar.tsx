import { Search } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarText } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  showSearch?: boolean;
  searchDefaultValue?: string;
}

export function Navbar({ showSearch = true, searchDefaultValue }: NavbarProps) {
  return (
    <header className="border-border flex h-[68px] w-full items-center justify-between border-b px-20">
      <Link href="/blog" className="text-foreground text-xl font-semibold">
        Next Blog
      </Link>

      {showSearch && (
        <form action="/blog" method="GET" className="w-80">
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

      <Link href="/profile">
        <Avatar>
          <AvatarText>😊</AvatarText>
        </Avatar>
      </Link>
    </header>
  );
}
