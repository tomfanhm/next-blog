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
}

/** Vertical card with optional thumbnail image — matches Blog Home design */
export function PostCard({ slug, title, excerpt, date, views, thumbnail }: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="border-border bg-card overflow-hidden rounded-lg border shadow-sm">
        {thumbnail && (
          <div className="relative h-[200px] w-full overflow-hidden">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}

        <div className="px-6 pt-5 pb-0">
          <h2 className="text-foreground text-lg font-medium group-hover:underline">{title}</h2>
        </div>

        <div className="px-6 pt-2 pb-5">
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{excerpt}</p>
        </div>

        <div className="flex items-center gap-4 px-6 pb-4">
          <time className="text-muted-foreground text-[13px]">{date}</time>
          <div className="flex items-center gap-1.5">
            <Eye className="text-muted-foreground h-3.5 w-3.5" />
            <span className="text-muted-foreground text-[13px]">{views.toLocaleString()}</span>
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
      <article className="border-border flex gap-6 border-b py-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <h2 className="text-foreground text-xl font-semibold group-hover:underline">{title}</h2>
          <p className="text-muted-foreground line-clamp-2 text-[15px] leading-relaxed">
            {excerpt}
          </p>
          <div className="flex items-center gap-4">
            <time className="text-muted-foreground text-[13px]">{date}</time>
            <div className="flex items-center gap-1.5">
              <Eye className="text-muted-foreground h-3.5 w-3.5" />
              <span className="text-muted-foreground text-[13px]">{views.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {thumbnail && (
          <div className="relative h-[120px] w-40 shrink-0 overflow-hidden rounded-lg">
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
