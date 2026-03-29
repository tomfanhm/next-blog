import type { MetadataRoute } from "next";

import { getDb } from "@/lib/db";

// Generate at request time — DB is not available during static build
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const posts = await getDb().post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...postEntries,
  ];
}
