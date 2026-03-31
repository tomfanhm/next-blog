import { Suspense } from "react";

import { DateSidebar } from "@/components/blog/date-sidebar";
import { PostCard } from "@/components/blog/post-card";
import { getPostDateGroups, getPostsByDate } from "@/lib/db";

export const metadata = { title: "Home" };

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string; page?: string }>;
}) {
  const params = await searchParams;
  const year = params.year ? Number(params.year) : undefined;
  const month = params.month ? Number(params.month) : undefined;
  const page = params.page ? Number(params.page) : 1;

  const [dateGroups, { posts }] = await Promise.all([
    getPostDateGroups(),
    getPostsByDate({ year, month, page, limit: 20 }),
  ]);

  return (
    <div className="mx-auto flex max-w-5xl gap-8 px-4 py-8 md:px-6">
      <Suspense>
        <DateSidebar dateGroups={dateGroups} />
      </Suspense>

      <div className="flex flex-1 flex-col gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              content={post.content}
              createdAt={post.createdAt}
              views={post.views}
              thumbnail={post.thumbnail}
            />
          ))
        ) : (
          <p className="text-muted-foreground py-12 text-center text-sm">No posts found.</p>
        )}
      </div>
    </div>
  );
}
