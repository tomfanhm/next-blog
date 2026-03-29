import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowLeft, ArrowUpDown, Eye } from "lucide-react";
import Link from "next/link";

import { AdPlaceholder } from "@/components/ad-placeholder";
import { CommentCard } from "@/components/comment-card";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const NOW = new Date();
const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 3600000);

const COMMENTS = [
  {
    id: "c1",
    content:
      "This article on Server Components was incredibly helpful. The section on streaming was particularly insightful.",
    authorName: "Emana Torres",
    authorAvatar: "avatar-cat",
    postId: "post-1",
    parentId: null,
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(5),
    replies: [
      {
        id: "r1",
        content: "Totally agree! The diagrams made it so much easier to understand the data flow.",
        authorName: "Bob",
        authorAvatar: "avatar-fox",
        postId: "post-1",
        parentId: "c1",
        createdAt: hoursAgo(3),
        updatedAt: hoursAgo(3),
      },
    ],
  },
  {
    id: "c2",
    content:
      "I've been using this pattern in production for a few weeks now and the performance improvement is noticeable. Great write-up!",
    authorName: "Sarah Lee",
    authorAvatar: "avatar-bear",
    postId: "post-1",
    parentId: null,
    createdAt: hoursAgo(8),
    updatedAt: hoursAgo(8),
    replies: [],
  },
  {
    id: "c3",
    content:
      "Would love to see a follow-up post on how this integrates with Suspense boundaries and error handling.",
    authorName: "Diana",
    authorAvatar: "avatar-owl",
    postId: "post-1",
    parentId: null,
    createdAt: hoursAgo(12),
    updatedAt: hoursAgo(12),
    replies: [
      {
        id: "r2",
        content: "Yes! Especially the error boundary patterns with Server Components.",
        authorName: "Eve",
        authorAvatar: "avatar-rabbit",
        postId: "post-1",
        parentId: "c3",
        createdAt: hoursAgo(10),
        updatedAt: hoursAgo(10),
      },
      {
        id: "r3",
        content: "I second this. The error handling story is still a bit unclear to me.",
        authorName: "Frank",
        authorAvatar: "avatar-panda",
        postId: "post-1",
        parentId: "c3",
        createdAt: hoursAgo(9),
        updatedAt: hoursAgo(9),
      },
    ],
  },
];

function CommentsViewPage() {
  const totalCount = COMMENTS.reduce((n, c) => n + 1 + c.replies.length, 0);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-[720px] px-6 py-12">
        {/* Post Reference */}
        <div className="flex flex-col gap-3">
          <Link
            href="/blog/minimalist-design"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to post
          </Link>
          <h1 className="text-xl font-semibold">The Art of Minimalist Design: Less is More</h1>
          <div className="text-muted-foreground flex items-center gap-1.5 text-[13px]">
            <span>March 15, 2026</span>
            <span>·</span>
            <Eye className="h-3.5 w-3.5" />
            <span>1,247 views</span>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-foreground text-base font-semibold">{totalCount} Comments</h2>
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

        {/* Comment form */}
        <div className="mt-6 flex flex-col gap-4">
          <label className="text-foreground text-sm font-medium">Add a comment</label>
          <Textarea placeholder="Share your thoughts on this post..." rows={4} />
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <input
                placeholder="Your name"
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-9 w-36 rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
              <div className="bg-input relative inline-flex h-5 w-9 shrink-0 items-center rounded-full">
                <span className="bg-background inline-block h-4 w-4 translate-x-0.5 rounded-full shadow-sm" />
              </div>
              <span className="text-muted-foreground text-[13px]">Anonymity Mode</span>
            </div>
            <Button>Post Comment</Button>
          </div>
        </div>

        <Separator className="mt-6" />

        {/* Comments list */}
        <div className="mt-6 flex flex-col gap-6">
          {COMMENTS.map((comment, i) => (
            <div key={comment.id}>
              <CommentCard comment={comment} postId="post-1" />
              {i === 1 && (
                <div className="mt-6">
                  <AdPlaceholder size="300x250" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center pt-2 pb-8">
          <Button variant="outline">Load More Comments</Button>
        </div>
      </main>
    </div>
  );
}

const meta: Meta = {
  title: "Pages/Comments View",
  component: CommentsViewPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
