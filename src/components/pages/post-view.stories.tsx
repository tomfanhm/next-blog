import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowLeft, ChevronDown, Eye } from "lucide-react";

import { BottomNav } from "@/components/blog/bottom-nav";
import { CommentItem } from "@/components/blog/comment-item";
import { BlogHeader } from "@/components/blog/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const meta = {
  title: "Pages/PostView",
  parameters: {
    layout: "fullscreen",
    nextjs: {
      navigation: { pathname: "/blog/the-art-of-minimalist-design" },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const post = {
  title: "The Art of Minimalist Design: Less is More",
  date: "March 15, 2026",
  views: 1247,
  content: [
    "In the world of design, the principle of minimalism has long been celebrated as a philosophy that strips away the unnecessary to reveal what truly matters. This approach, rooted in the belief that simplicity leads to clarity, has influenced everything from architecture to digital interfaces. When we embrace minimalism, we create space for the content itself to breathe and communicate directly with the viewer.",
    "The challenge of minimalist design lies not in removing elements, but in knowing which elements to keep. Every remaining piece must earn its place, serving a clear purpose in the overall composition. Typography becomes paramount — the choice of typeface, the rhythm of line spacing, and the weight of each word all carry increased significance when there are fewer visual elements competing for attention.",
  ],
};

const comments = [
  {
    id: "1",
    authorName: "Alex Kim",
    authorAvatar: "avatar-bear",
    timeAgo: "2 hours ago",
    content: "This is such a great read! The section on whitespace really resonated with me.",
  },
  {
    id: "2",
    authorName: "Sam Rivera",
    authorAvatar: "avatar-fox",
    timeAgo: "5 hours ago",
    content:
      "I've been applying these principles to my own projects. The results have been amazing.",
  },
];

function PostContent({ isMobile }: { isMobile?: boolean }) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <BlogHeader />
      <article
        className={`mx-auto w-full max-w-2xl px-4 py-6 md:px-6 md:py-8 ${isMobile ? "pb-20" : ""}`}
      >
        {/* Back link — mobile only */}
        {isMobile && (
          <div className="text-muted-foreground mb-4 flex items-center gap-1 text-sm">
            <ArrowLeft className="size-4" />
            Next Blog
          </div>
        )}

        <h1 className="text-2xl font-bold md:text-3xl">{post.title}</h1>

        <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
          <time>{post.date}</time>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {post.views.toLocaleString()} views
          </span>
        </div>

        <div className="bg-muted mt-6 flex aspect-[16/9] items-center justify-center rounded-lg">
          <span className="text-muted-foreground text-sm">Cover Image</span>
        </div>

        <div className="mt-8">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-foreground/90 mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Comments section — inline */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{comments.length} Comments</h2>
            <button className="text-muted-foreground flex items-center gap-1 text-sm">
              Newest
              <ChevronDown className="size-3.5" />
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Textarea placeholder="Write a comment..." className="min-h-[80px] resize-none" />
            <div className="flex items-center justify-end">
              <Button size="sm">Post</Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col">
            {comments.map((comment) => (
              <div key={comment.id} className="border-border border-b last:border-b-0">
                <CommentItem
                  authorName={comment.authorName}
                  authorAvatar={comment.authorAvatar}
                  timeAgo={comment.timeAgo}
                  content={comment.content}
                />
              </div>
            ))}
          </div>
        </section>
      </article>
      {isMobile && <BottomNav />}
    </div>
  );
}

export const Desktop: Story = {
  render: () => <PostContent />,
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: () => <PostContent isMobile />,
};
