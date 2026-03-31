import { ChevronDown } from "lucide-react";
import { notFound } from "next/navigation";

import { CommentForm } from "@/components/blog/comment-form";
import { CommentList } from "@/components/blog/comment-list";
import { PostArticle } from "@/components/blog/post-article";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getPostBySlug } from "@/lib/db";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: slug.replace(/-/g, " ") };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  return (
    <PostArticle
      title={post.title}
      date={formatDate(post.createdAt, "long")}
      views={post.views}
      thumbnail={post.thumbnail}
      content={post.content}
    >
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{post.comments.length} Comments</h2>
          <Button variant="ghost" size="sm" className="gap-1">
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
    </PostArticle>
  );
}
