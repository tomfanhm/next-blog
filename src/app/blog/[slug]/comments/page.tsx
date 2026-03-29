import { ArrowLeft, ArrowUpDown, Eye } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdPlaceholder } from "@/components/ad-placeholder";
import { CommentCard } from "@/components/comment-card";
import { CommentForm } from "@/components/comment-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getPostBySlug } from "@/lib/db";

interface CommentsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CommentsPage({ params }: CommentsPageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post.published) notFound();

  const totalComments = post.comments.reduce((n, c) => n + 1 + c.replies.length, 0);
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto w-full max-w-[720px] px-6 py-12">
      {/* Post Reference */}
      <div className="flex flex-col gap-3">
        <Link
          href={`/blog/${slug}`}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to post
        </Link>
        <h1 className="text-foreground text-xl font-semibold">{post.title}</h1>
        <div className="text-muted-foreground flex items-center gap-1.5 text-[13px]">
          <span>{formattedDate}</span>
          <span>·</span>
          <Eye className="h-3.5 w-3.5" />
          <span>{post.views.toLocaleString()} views</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-foreground text-base font-semibold">{totalComments} Comments</h2>
        <div className="text-muted-foreground flex items-center gap-1.5 text-[13px]">
          <ArrowUpDown className="h-3.5 w-3.5" />
          <span>Most recent</span>
        </div>
      </div>

      {/* Ad Banner */}
      <div className="mt-8">
        <AdPlaceholder size="728x90" />
      </div>

      <Separator className="mt-8" />

      {/* Comment Input */}
      <div className="mt-6">
        <CommentForm postId={post.id} />
      </div>

      <Separator className="mt-6" />

      {/* Comments List */}
      <div className="mt-6 flex flex-col gap-6">
        {post.comments.map((comment, i) => (
          <div key={comment.id}>
            <CommentCard comment={comment} postId={post.id} />
            {i === 2 && post.comments.length > 3 && (
              <div className="mt-6">
                <AdPlaceholder size="300x250" />
              </div>
            )}
          </div>
        ))}
        {post.comments.length === 0 && (
          <p className="text-muted-foreground py-8 text-center text-sm">
            No comments yet. Be the first!
          </p>
        )}
      </div>

      {/* Load More */}
      {post.comments.length > 5 && (
        <div className="flex justify-center pt-2 pb-8">
          <Button variant="outline">Load More Comments</Button>
        </div>
      )}
    </main>
  );
}
