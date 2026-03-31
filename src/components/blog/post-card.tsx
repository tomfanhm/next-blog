import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { excerpt, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PostCardProps {
  slug: string;
  title: string;
  content: string;
  createdAt: Date;
  views: number;
  thumbnail?: string | null;
  className?: string;
}

export function PostCard({
  slug,
  title,
  content,
  createdAt,
  views,
  thumbnail,
  className,
}: PostCardProps) {
  return (
    <article className={cn("border-border border-b pb-6", className)}>
      <Link href={`/blog/${slug}`} className="group block">
        {thumbnail && (
          <div className="bg-muted relative mb-4 aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-[1.02]"
            />
          </div>
        )}

        <h2 className="group-hover:text-foreground/80 text-lg font-semibold">{title}</h2>

        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{excerpt(content)}</p>

        <div className="text-muted-foreground mt-3 flex items-center gap-3 text-xs">
          <time>{formatDate(createdAt, "short")}</time>
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {views.toLocaleString()} views
          </span>
        </div>
      </Link>
    </article>
  );
}
