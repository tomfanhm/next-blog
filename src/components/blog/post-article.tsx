import { ArrowLeft, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { MarkdownContent } from "@/components/blog/markdown-content";
import { Separator } from "@/components/ui/separator";

interface PostArticleProps {
  title: string;
  date: string;
  views: number;
  thumbnail?: string | null;
  content: string;
  children?: ReactNode;
}

export function PostArticle({
  title,
  date,
  views,
  thumbnail,
  content,
  children,
}: PostArticleProps) {
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-6 md:px-6 md:py-8">
      {/* Back link — mobile only */}
      <Link
        href="/"
        className="text-muted-foreground mb-4 flex items-center gap-1 text-sm md:hidden"
      >
        <ArrowLeft className="size-4" />
        Next Blog
      </Link>

      <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>

      <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
        <time>{date}</time>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Eye className="size-3.5" />
          {views.toLocaleString()} views
        </span>
      </div>

      {thumbnail && (
        <div className="bg-muted relative mt-6 aspect-[16/9] overflow-hidden rounded-lg">
          <Image src={thumbnail} alt={title} fill className="object-cover" priority />
        </div>
      )}

      <div className="mt-8">
        <MarkdownContent content={content} />
      </div>

      {children && (
        <>
          <Separator className="my-8" />
          {children}
        </>
      )}
    </article>
  );
}
