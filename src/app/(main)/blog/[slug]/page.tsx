import { ArrowLeft, ChevronDown, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CommentItem } from "@/components/blog/comment-item";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // TODO: Fetch post title from database
  return { title: slug.replace(/-/g, " ") };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  void slug;

  // TODO: Fetch post data from database using slug
  const post = {
    title: "The Art of Minimalist Design: Less is More",
    date: "March 15, 2026",
    views: 1247,
    coverImage: "/placeholder-minimalist.jpg",
    content: [
      "In the world of design, the principle of minimalism has long been celebrated as a philosophy that strips away the unnecessary to reveal what truly matters. This approach, rooted in the belief that simplicity leads to clarity, has influenced everything from architecture to digital interfaces. When we embrace minimalism, we create space for the content itself to breathe and communicate directly with the viewer.",
      "The challenge of minimalist design lies not in removing elements, but in knowing which elements to keep. Every remaining piece must earn its place, serving a clear purpose in the overall composition. Typography becomes paramount — the choice of typeface, the rhythm of line spacing, and the weight of each word all carry increased significance when there are fewer visual elements competing for attention.",
    ],
  };

  // TODO: Fetch comments from database
  const comments = [
    {
      id: "1",
      authorName: "Emma Torres",
      authorAvatar: "avatar-cat",
      timeAgo: "2 hours ago",
      content:
        "I've bookmarked this for my team's next design review. The principles apply perfectly to our product's redesign efforts.",
    },
    {
      id: "2",
      authorName: "Sarah Lee",
      authorAvatar: "avatar-fox",
      timeAgo: "5 hours ago",
      content:
        "As someone transitioning from print to digital design, this article bridges the gap beautifully. The core principles remain the same — clarity, intentionality, and restraint.",
    },
  ];

  return (
    <article className="mx-auto max-w-2xl px-4 py-6 md:px-6 md:py-8">
      {/* Back link — mobile */}
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm md:hidden"
      >
        <ArrowLeft className="size-4" />
        Next Blog
      </Link>

      {/* Title */}
      <h1 className="text-2xl font-bold md:text-3xl">{post.title}</h1>

      {/* Meta */}
      <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
        <time>{post.date}</time>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Eye className="size-3.5" />
          {post.views.toLocaleString()} views
        </span>
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="bg-muted relative mt-6 aspect-[16/9] overflow-hidden rounded-lg">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      {/* Content */}
      <div className="mt-8">
        {post.content.map((paragraph, i) => (
          <p key={i} className="text-foreground/90 mb-4 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      <Separator className="my-8" />

      {/* Comments section */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{comments.length} Comments</h2>
          <button className="text-muted-foreground flex items-center gap-1 text-sm">
            Newest
            <ChevronDown className="size-3.5" />
          </button>
        </div>

        {/* Add comment form */}
        <div className="mt-6 flex flex-col gap-3">
          <h3 className="text-sm font-medium">Add a comment</h3>
          {/* TODO: Wire to createComment server action */}
          <Textarea
            placeholder="Share your thoughts on this post..."
            className="min-h-[100px] resize-none"
          />
          <div className="flex items-center justify-end">
            <Button size="sm">Post</Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Comment list */}
        <div className="flex flex-col">
          {comments.map((comment) => (
            <div key={comment.id} className="border-border border-b last:border-b-0">
              <CommentItem
                authorName={comment.authorName}
                authorAvatar={comment.authorAvatar}
                timeAgo={comment.timeAgo}
                content={comment.content}
                // TODO: Wire reply handler
              />
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
