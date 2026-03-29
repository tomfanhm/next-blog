import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarText({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("text-sm font-semibold", className)} {...props} />;
}
