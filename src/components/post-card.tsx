import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  views: number;
  thumbnail?: string | null;
  tag?: string | null;
}

/** Vertical card with optional thumbnail image — matches Blog Home design */
export function PostCard({ slug, title, excerpt, date, views, thumbnail, tag }: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="bg-card md:border-border overflow-hidden rounded-lg shadow-sm md:border">
        {thumbnail && (
          <div className="relative h-45 w-full overflow-hidden sm:h-50">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex flex-col gap-2 px-4 pt-4 pb-4 md:px-6 md:pt-5 md:pb-5">
          {tag && (
            <span className="bg-muted text-muted-foreground w-fit rounded-full px-2.5 py-0.5 text-xs font-medium">
              {tag}
            </span>
          )}
          <h2 className="text-foreground text-base font-semibold group-hover:underline md:text-lg md:font-medium">
            {title}
          </h2>
          <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed md:text-sm">
            {excerpt}
          </p>
          <div className="flex items-center gap-2">
            <time className="text-muted-foreground text-xs">{date}</time>
            <span className="text-muted-foreground text-xs">&middot;</span>
            <div className="flex items-center gap-1.5">
              <Eye className="text-muted-foreground h-3.5 w-3.5" />
              <span className="text-muted-foreground text-xs">{views.toLocaleString()} views</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

/** Horizontal card with side thumbnail — matches Filtered Results design */
export function PostCardHorizontal({
  slug,
  title,
  excerpt,
  date,
  views,
  thumbnail,
}: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="border-border flex flex-col gap-4 border-b py-6 sm:flex-row sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <h2 className="text-foreground text-lg font-semibold group-hover:underline sm:text-xl">
            {title}
          </h2>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed sm:text-sm">
            {excerpt}
          </p>
          <div className="flex items-center gap-4">
            <time className="text-muted-foreground text-xs">{date}</time>
            <div className="flex items-center gap-1.5">
              <Eye className="text-muted-foreground h-3.5 w-3.5" />
              <span className="text-muted-foreground text-xs">{views.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {thumbnail && (
          <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg sm:h-30 sm:w-40">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
      </article>
    </Link>
  );
}
