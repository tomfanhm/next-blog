import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { X } from "lucide-react";
import Link from "next/link";

import { AdPlaceholder } from "@/components/ad-placeholder";
import { Navbar } from "@/components/navbar";
import { PostCardHorizontal } from "@/components/post-card";

const RESULTS = [
  {
    slug: "nextjs-performance",
    title: "Optimizing Next.js Performance in Production",
    excerpt:
      "Learn practical techniques for improving your Next.js application's performance including code splitting, lazy loading, and caching strategies.",
    date: "Mar 12, 2026",
    views: 943,
    thumbnail: "https://picsum.photos/seed/d/600/400",
  },
  {
    slug: "nextjs-auth",
    title: "Authentication in Next.js with Auth.js v5",
    excerpt:
      "A complete guide to implementing secure authentication using Auth.js v5 with database sessions, OAuth providers, and role-based access.",
    date: "Feb 20, 2026",
    views: 1567,
    thumbnail: "https://picsum.photos/seed/e/600/400",
  },
  {
    slug: "nextjs-testing",
    title: "Testing Next.js Applications End to End",
    excerpt:
      "How to set up comprehensive testing for your Next.js app with unit tests, integration tests, and E2E tests using Playwright.",
    date: "Jan 15, 2026",
    views: 421,
    thumbnail: null,
  },
];

function FilteredResultsPage() {
  return (
    <div className="bg-background text-foreground flex h-screen flex-col">
      <Navbar searchDefaultValue="Next.js" />
      <main className="mx-auto w-full max-w-4xl px-6 py-12">
        <div className="flex items-center gap-3">
          <h1 className="text-foreground text-xl font-semibold">Search: Next.js</h1>
          <Link
            href="/"
            className="bg-muted text-muted-foreground hover:bg-muted/80 flex h-7 w-7 items-center justify-center rounded-full"
          >
            <X className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-8 flex flex-col">
          {RESULTS.map((post, i) => (
            <div key={post.slug}>
              <PostCardHorizontal {...post} />
              {i === 0 && (
                <div className="py-6">
                  <AdPlaceholder size="728x90" />
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-muted-foreground mt-6 text-center text-sm">3 result(s)</p>
      </main>
    </div>
  );
}

const meta: Meta = {
  title: "Pages/Filtered Results",
  component: FilteredResultsPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
