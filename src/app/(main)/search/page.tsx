import { ChevronDown } from "lucide-react";

import { PostCard } from "@/components/blog/post-card";

export const metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q ?? "";

  // TODO: Fetch filtered posts from database using full-text search
  const results = [
    {
      slug: "understanding-react-hooks",
      title: "Understanding React Hooks: A Complete Guide",
      content:
        "Learn how to use useState, useEffect, and custom hooks to build powerful React applications. This guide covers everything from basics to advanced patterns.",
      createdAt: new Date("2024-05-15"),
      views: 15897,
      thumbnail: "/placeholder-hooks.jpg",
    },
    {
      slug: "building-custom-hooks",
      title: "Building Custom Hooks for State Management",
      content:
        "Explore how custom React hooks can simplify complex state logic across your application. Practical examples and best practices included.",
      createdAt: new Date("2024-03-10"),
      views: 1826,
      thumbnail: "/placeholder-custom-hooks.jpg",
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-6 md:py-8">
      {/* Search header */}
      <div className="mb-6 flex items-center gap-2">
        <h1 className="text-xl font-semibold">Search: {query || "All posts"}</h1>
        <button className="text-muted-foreground">
          <ChevronDown className="size-4" />
        </button>
      </div>

      {/* Results */}
      <div className="flex flex-col gap-8">
        {results.length > 0 ? (
          results.map((post) => <PostCard key={post.slug} {...post} />)
        ) : (
          <p className="text-muted-foreground py-12 text-center text-sm">
            No posts found for &quot;{query}&quot;
          </p>
        )}
      </div>
    </div>
  );
}
