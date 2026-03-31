import { ArrowLeft, ChevronDown, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CommentForm } from "@/components/blog/comment-form";
import { CommentList } from "@/components/blog/comment-list";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getPostBySlug } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: slug.replace(/-/g, " ") };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post.published) notFound();

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

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

      <h1 className="text-2xl font-bold md:text-3xl">{post.title}</h1>

      <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
        <time>{formatDate(post.createdAt)}</time>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Eye className="size-3.5" />
          {post.views.toLocaleString()} views
        </span>
      </div>

      {post.thumbnail && (
        <div className="bg-muted relative mt-6 aspect-[16/9] overflow-hidden rounded-lg">
          <Image src={post.thumbnail} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="mt-8">
        <MarkdownContent content={post.content} />
      </div>

      <Separator className="my-8" />

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{post.comments.length} Comments</h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground gap-1">
            Newest
            <ChevronDown className="size-3.5" />
          </Button>
        </div>

        <div className="mt-6">
          <CommentForm postId={post.id} />
        </div>

        <Separator className="my-6" />

        <CommentList comments={post.comments} postId={post.id} />
      </section>
    </article>
  );
}
