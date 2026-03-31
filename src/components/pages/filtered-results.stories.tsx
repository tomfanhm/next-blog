import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChevronDown } from "lucide-react";

import { BottomNav } from "@/components/blog/bottom-nav";
import { BlogHeader } from "@/components/blog/header";
import { PostCard } from "@/components/blog/post-card";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Pages/FilteredResults",
  parameters: {
    layout: "fullscreen",
    nextjs: {
      navigation: {
        pathname: "/search",
        searchParams: { q: "React hooks" },
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const results = [
  {
    slug: "understanding-react-hooks",
    title: "Understanding React Hooks: A Complete Guide",
    content:
      "Learn how to use useState, useEffect, and custom hooks to build powerful React applications. This guide covers everything from basics to advanced patterns.",
    createdAt: new Date("2024-05-15"),
    views: 15897,
    thumbnail: "https://picsum.photos/seed/hooks/800/450",
  },
  {
    slug: "building-custom-hooks",
    title: "Building Custom Hooks for State Management",
    content:
      "Explore how custom React hooks can simplify complex state logic across your application. Practical examples and best practices included.",
    createdAt: new Date("2024-03-10"),
    views: 1826,
    thumbnail: "https://picsum.photos/seed/custom-hooks/800/450",
  },
];

function SearchContent({ showMobileNav }: { showMobileNav?: boolean }) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <BlogHeader />
      <div
        className={`mx-auto w-full max-w-2xl px-4 py-6 md:px-6 md:py-8 ${showMobileNav ? "pb-20" : ""}`}
      >
        <div className="mb-6 flex items-center gap-2">
          <h1 className="text-xl font-semibold">Search: React hooks</h1>
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronDown className="size-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-8">
          {results.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      </div>
      {showMobileNav && <BottomNav />}
    </div>
  );
}

export const Desktop: Story = {
  render: () => <SearchContent />,
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: () => <SearchContent showMobileNav />,
};
