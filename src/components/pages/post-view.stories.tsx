import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Eye } from "lucide-react";
import Image from "next/image";

import { AdPlaceholder } from "@/components/ad-placeholder";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Navbar } from "@/components/navbar";
import { Separator } from "@/components/ui/separator";

const POST_CONTENT = `## Introduction

React Server Components represent a fundamental shift in how we think about rendering in React applications. Unlike traditional client components, Server Components execute exclusively on the server and send rendered HTML to the client.

## Why Server Components?

The main benefits include:

- **Zero bundle size impact** — Server Components aren't included in the client JavaScript bundle
- **Direct backend access** — You can query databases, read files, and call APIs directly
- **Automatic code splitting** — Client components are lazy-loaded by default
- **Streaming** — Components render progressively with Suspense boundaries

## Getting Started

Here's a basic Server Component that fetches data directly:

\`\`\`tsx
export default async function PostPage({ params }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { comments: true },
  });

  return (
    <article>
      <h1>{post.title}</h1>
      <MarkdownRenderer content={post.content} />
      <CommentSection comments={post.comments} />
    </article>
  );
}
\`\`\`

> **Note**: Server Components are the default in the Next.js App Router. You only need \`'use client'\` when a component requires interactivity or browser APIs.

## When to Use Client Components

| Use Case | Component Type |
|----------|---------------|
| Data fetching | Server |
| Backend resources | Server |
| Event listeners (onClick) | Client |
| React hooks (useState) | Client |
| Browser APIs | Client |

## Conclusion

Server Components aren't a replacement for Client Components — they're complementary. Use them together for the best user experience.
`;

function PostViewPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-[720px] px-6 py-12">
        {/* Post Header */}
        <div className="flex flex-col gap-3">
          <h1 className="text-foreground text-[28px] leading-tight font-semibold">
            The Art of Minimalist Design: Less is More
          </h1>
          <div className="flex items-center gap-4">
            <time className="text-muted-foreground text-[13px]">March 15, 2026</time>
            <span className="bg-muted-foreground h-1 w-1 rounded-full" />
            <div className="flex items-center gap-1.5">
              <Eye className="text-muted-foreground h-3.5 w-3.5" />
              <span className="text-muted-foreground text-[13px]">1,247 views</span>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative mt-8 h-[360px] w-full overflow-hidden rounded-xl">
          <Image
            src="https://picsum.photos/seed/hero/1200/400"
            alt="Post hero"
            fill
            className="object-cover"
          />
        </div>

        <article className="mt-8">
          <MarkdownRenderer content={POST_CONTENT} />
        </article>

        <Separator className="mt-10" />

        {/* Ad Unit */}
        <div className="mt-8">
          <AdPlaceholder size="728x90" />
        </div>

        {/* Comments preview */}
        <div className="mt-8">
          <h2 className="text-foreground text-xl font-semibold">3 Comments</h2>
        </div>
      </main>
    </div>
  );
}

const meta: Meta = {
  title: "Pages/Post View",
  component: PostViewPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
