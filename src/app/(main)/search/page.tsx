import { PostCard } from "@/components/blog/post-card";
import { searchPosts } from "@/lib/db";

export const metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q ?? "";

  const posts = await searchPosts(query, 20, 0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">{query ? `Search: ${query}` : "All Posts"}</h1>
      </div>

      <div className="flex flex-col gap-8">
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
          <p className="text-muted-foreground py-12 text-center text-sm">
            {query ? `No posts found for "${query}"` : "No posts published yet."}
          </p>
        )}
      </div>
    </div>
  );
}
