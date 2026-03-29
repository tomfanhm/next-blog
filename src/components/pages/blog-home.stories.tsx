import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Suspense } from "react";

import { AdPlaceholder } from "@/components/ad-placeholder";
import { DateSidebar } from "@/components/date-sidebar";
import { Navbar } from "@/components/navbar";
import { PostCard } from "@/components/post-card";

const SAMPLE_POSTS = [
  {
    slug: "getting-started-nextjs",
    title: "Getting Started with Next.js 16",
    excerpt:
      "Learn how to build modern web applications with the latest version of Next.js, featuring the App Router, Server Components, and more.",
    date: "Mar 15, 2026",
    views: 1234,
    thumbnail: "https://picsum.photos/seed/a/600/400",
  },
  {
    slug: "tailwind-tips",
    title: "10 Tailwind CSS Tips You Didn't Know",
    excerpt:
      "Discover powerful Tailwind CSS techniques that will speed up your workflow and make your designs more consistent.",
    date: "Mar 10, 2026",
    views: 892,
    thumbnail: "https://picsum.photos/seed/b/600/400",
  },
  {
    slug: "prisma-advanced",
    title: "Advanced Prisma Patterns for Production",
    excerpt:
      "Deep dive into Prisma's advanced features including raw queries, transactions, and connection pooling strategies.",
    date: "Feb 28, 2026",
    views: 567,
    thumbnail: "https://picsum.photos/seed/c/600/400",
  },
  {
    slug: "react-server-components",
    title: "Understanding React Server Components",
    excerpt:
      "A comprehensive guide to React Server Components and how they change the way we think about rendering.",
    date: "Feb 14, 2026",
    views: 2103,
    thumbnail: null,
  },
];

const YEAR_GROUPS = [
  { year: 2026, months: ["March", "February", "January"] },
  { year: 2025, months: ["November", "October", "September"] },
];

function BlogHomePage() {
  return (
    <div className="bg-background text-foreground flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Suspense>
          <DateSidebar years={YEAR_GROUPS} />
        </Suspense>
        <main className="flex flex-1 flex-col gap-6 px-12 py-8">
          <div className="flex flex-col gap-4">
            {SAMPLE_POSTS.map((post, i) => (
              <div key={post.slug}>
                <PostCard {...post} />
                {i === 2 && (
                  <div className="mt-4">
                    <AdPlaceholder size="728x90" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <nav className="flex items-center justify-center">
            <span className="text-foreground rounded-md px-6 py-2 text-sm font-medium">
              Previous
            </span>
            <div className="flex items-center gap-1">
              <span className="border-border bg-card flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium shadow-sm">
                1
              </span>
              <span className="text-muted-foreground flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium">
                2
              </span>
              <span className="text-muted-foreground flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium">
                3
              </span>
              <span className="text-muted-foreground flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium">
                ...
              </span>
              <span className="text-muted-foreground flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium">
                10
              </span>
            </div>
            <span className="text-foreground rounded-md px-6 py-2 text-sm font-medium">Next</span>
          </nav>
        </main>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Pages/Blog Home",
  component: BlogHomePage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      navigation: {
        searchParams: {},
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
