import { Eye } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { AdPlaceholder } from "@/components/ad-placeholder";
import { CommentSection } from "@/components/comment-section";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Separator } from "@/components/ui/separator";
import { getPostBySlug } from "@/lib/db";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post.published) notFound();

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto w-full max-w-[720px] px-6 py-12">
      {/* Post Header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-foreground text-[28px] leading-tight font-semibold">{post.title}</h1>
        <div className="flex items-center gap-4">
          <time className="text-muted-foreground text-[13px]">{formattedDate}</time>
          <span className="bg-muted-foreground h-1 w-1 rounded-full" />
          <div className="flex items-center gap-1.5">
            <Eye className="text-muted-foreground h-3.5 w-3.5" />
            <span className="text-muted-foreground text-[13px]">
              {post.views.toLocaleString()} views
            </span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      {post.thumbnail && (
        <div className="relative mt-8 h-[360px] w-full overflow-hidden rounded-xl">
          <Image src={post.thumbnail} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      {/* Post Body */}
      <article className="mt-8">
        <MarkdownRenderer content={post.content} />
      </article>

      <Separator className="mt-10" />

      {/* Ad Unit */}
      <div className="mt-8">
        <AdPlaceholder size="728x90" />
      </div>

      {/* Comments */}
      <div className="mt-8">
        <h2 className="text-foreground text-xl font-semibold">
          {post.comments.reduce((n, c) => n + 1 + c.replies.length, 0)} Comments
        </h2>
      </div>

      <div className="mt-6">
        <CommentSection postId={post.id} comments={post.comments} />
      </div>
    </main>
  );
}
