import { Search, X } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { AdPlaceholder } from "@/components/ad-placeholder";
import { DateSidebar } from "@/components/date-sidebar";
import { Navbar } from "@/components/navbar";
import { PostCard, PostCardHorizontal } from "@/components/post-card";
import { getPostsByDate, searchPosts } from "@/lib/db";
import { postFiltersSchema } from "@/lib/validators";

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const raw = await searchParams;
  const filters = postFiltersSchema.parse(raw);
  const hasSearch = filters.search && filters.search.trim().length > 0;

  let posts;
  let total = 0;
  let page = filters.page;
  let totalPages = 1;

  if (hasSearch && filters.search) {
    const results = await searchPosts(filters.search, filters.limit, (page - 1) * filters.limit);
    posts = results;
    total = results.length;
  } else {
    const result = await getPostsByDate(filters);
    posts = result.posts;
    total = result.total;
    page = result.page;
    totalPages = result.totalPages;
  }

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  // If searching, render the Filtered Results layout (no sidebar, horizontal cards)
  if (hasSearch) {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-[900px] px-6 py-12">
          {/* Filter status bar */}
          <div className="flex items-center gap-3">
            <h1 className="text-foreground text-[22px] font-semibold">Search: {filters.search}</h1>
            <Link
              href="/"
              className="bg-muted text-muted-foreground hover:bg-muted/80 flex h-7 w-7 items-center justify-center rounded-full"
            >
              <X className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Horizontal post cards */}
          <div className="mt-8 flex flex-col">
            {posts.map((post, i) => (
              <div key={post.id}>
                <PostCardHorizontal
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.content.slice(0, 200)}
                  date={formatDate(post.createdAt)}
                  views={post.views}
                  thumbnail={post.thumbnail}
                />
                {i === 0 && posts.length > 1 && (
                  <div className="py-6">
                    <AdPlaceholder size="728x90" />
                  </div>
                )}
              </div>
            ))}
            {posts.length === 0 && (
              <div className="border-border flex flex-col items-center gap-4 rounded-lg border py-20">
                <Search className="text-muted-foreground h-12 w-12" />
                <p className="text-foreground text-lg font-medium">No results found</p>
                <p className="text-muted-foreground text-sm">
                  Try a different search term or date filter
                </p>
              </div>
            )}
          </div>

          <p className="text-muted-foreground mt-6 text-center text-sm">{total} result(s)</p>
        </main>
      </div>
    );
  }

  // Default Blog Home layout with sidebar
  // Static year groups — in production, derive from actual post dates
  const yearGroups = [
    { year: 2024, months: ["March", "February", "January"] },
    { year: 2023, months: [] },
    { year: 2022, months: [] },
  ];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Suspense>
          <DateSidebar years={yearGroups} />
        </Suspense>

        <main className="flex flex-1 flex-col gap-6 px-12 py-8">
          {/* Post cards */}
          <div className="flex flex-col gap-4">
            {posts.map((post, i) => (
              <div key={post.id}>
                <PostCard
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.content.slice(0, 200)}
                  date={formatDate(post.createdAt)}
                  views={post.views}
                  thumbnail={post.thumbnail}
                />
                {i === 2 && posts.length > 3 && (
                  <div className="mt-4">
                    <AdPlaceholder size="728x90" label="Ad Unit [728x90]" />
                  </div>
                )}
              </div>
            ))}
            {posts.length === 0 && (
              <p className="text-muted-foreground py-12 text-center">No posts yet.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center">
              {page > 1 && (
                <Link
                  href={{ pathname: "/", query: { ...raw, page: page - 1 } }}
                  className="text-foreground hover:bg-accent rounded-md px-6 py-2 text-sm font-medium"
                >
                  Previous
                </Link>
              )}

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={{ pathname: "/", query: { ...raw, page: p } }}
                    className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium ${
                      p === page
                        ? "border-border bg-card border shadow-sm"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {p}
                  </Link>
                ))}

                {totalPages > 5 && (
                  <span className="text-muted-foreground flex h-10 w-10 items-center justify-center text-sm">
                    ...
                  </span>
                )}
              </div>

              {page < totalPages && (
                <Link
                  href={{ pathname: "/", query: { ...raw, page: page + 1 } }}
                  className="text-foreground hover:bg-accent rounded-md px-6 py-2 text-sm font-medium"
                >
                  Next
                </Link>
              )}
            </nav>
          )}
        </main>
      </div>
    </div>
  );
}
