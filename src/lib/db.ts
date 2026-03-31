import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "@/env";
import type { Prisma } from "@/generated/prisma/client";
import { PrismaClient } from "@/generated/prisma/client";

// Lazy singleton pattern — safe during `next build` static generation
// when DATABASE_URL may not be available yet.

let _db: PrismaClient | null = null;

export function getDb(): PrismaClient {
  if (!_db) {
    _db = new PrismaClient({
      adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
    });
  }
  return _db;
}

// ─── Types ────────────────────────────────────────────────

export interface PostFilters {
  search?: string;
  year?: number;
  month?: number; // 1-12
  day?: number; // 1-31
  page?: number;
  limit?: number;
}

interface PostRow {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string | null;
  views: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  rank: number;
}

// ─── Full Text Search ─────────────────────────────────────

/**
 * Search published posts using Postgres tsvector with ranked results.
 * Falls back to listing all published posts when no query is given.
 */
export async function searchPosts(query: string, limit = 20, offset = 0) {
  const db = getDb();

  // Sanitize: strip tsquery special characters to prevent syntax errors
  const sanitized = query.replace(/[&|!<>():*'\\]/g, " ").trim();
  // Convert words to tsquery format: "hello world" → "hello & world"
  const tsquery = sanitized.split(/\s+/).filter(Boolean).join(" & ");

  if (!tsquery) {
    return db.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });
  }

  return db.$queryRaw<PostRow[]>`
    SELECT
      "id", "title", "slug", "content", "thumbnail",
      "views", "published", "createdAt", "updatedAt",
      ts_rank("search_vector", to_tsquery('english', ${tsquery})) AS rank
    FROM "Post"
    WHERE "published" = true
      AND "search_vector" @@ to_tsquery('english', ${tsquery})
    ORDER BY rank DESC, "createdAt" DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
}

// ─── Date Filtering ───────────────────────────────────────

/**
 * Fetch published posts filtered by year, month, and/or day.
 * Builds a date range from the most specific filter provided.
 */
export async function getPostsByDate(filters: PostFilters) {
  const { year, month, day, page = 1, limit = 20 } = filters;
  const db = getDb();

  const where: Prisma.PostWhereInput = { published: true };

  if (year) {
    const start = new Date(year, (month ?? 1) - 1, day ?? 1);
    let end: Date;

    if (day && month) {
      // Specific day
      end = new Date(year, month - 1, day + 1);
    } else if (month) {
      // Entire month
      end = new Date(year, month, 1);
    } else {
      // Entire year
      end = new Date(year + 1, 0, 1);
    }

    where.createdAt = { gte: start, lt: end };
  }

  const [posts, total] = await Promise.all([
    db.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
    db.post.count({ where }),
  ]);

  return { posts, total, page, totalPages: Math.ceil(total / limit) };
}

// ─── Single Post ──────────────────────────────────────────

/**
 * Get a post by slug, incrementing its view count atomically.
 * Includes top-level comments with one level of nested replies.
 * Returns null if the post does not exist.
 */
export async function getPostBySlug(slug: string) {
  const db = getDb();

  const post = await db.post.findUnique({
    where: { slug },
    include: {
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
        include: {
          replies: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!post) return null;

  // Only increment views for published posts
  if (post.published) {
    await db.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  }

  return post;
}

// ─── Post CRUD (admin) ───────────────────────────────────

export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  published?: boolean;
}) {
  return getDb().post.create({ data });
}

export async function updatePost(
  id: string,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    thumbnail?: string;
    published?: boolean;
  },
) {
  return getDb().post.update({ where: { id }, data });
}

export async function deletePost(id: string) {
  return getDb().post.delete({ where: { id } });
}

// ─── Comments ─────────────────────────────────────────────

export async function createComment(data: {
  content: string;
  authorName: string;
  authorAvatar: string;
  postId: string;
  parentId?: string;
}) {
  return getDb().comment.create({ data });
}

export async function deleteComment(id: string) {
  return getDb().comment.delete({ where: { id } });
}

// ─── Post Date Groups ────────────────────────────────────

interface YearMonth {
  year: number;
  month: number;
}

/**
 * Get distinct year/month combinations from published posts,
 * grouped by year with month names, ordered most recent first.
 */
export async function getPostDateGroups() {
  const db = getDb();

  const rows = await db.$queryRaw<YearMonth[]>`
    SELECT
      EXTRACT(YEAR FROM "createdAt")::int   AS year,
      EXTRACT(MONTH FROM "createdAt")::int  AS month
    FROM "Post"
    WHERE "published" = true
    GROUP BY year, month
    ORDER BY year DESC, month DESC
  `;

  const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const grouped = new Map<number, string[]>();
  for (const row of rows) {
    const months = grouped.get(row.year) ?? [];
    months.push(MONTH_NAMES[row.month - 1] ?? "");
    grouped.set(row.year, months);
  }

  return Array.from(grouped.entries()).map(([year, months]) => ({
    year,
    months,
  }));
}
