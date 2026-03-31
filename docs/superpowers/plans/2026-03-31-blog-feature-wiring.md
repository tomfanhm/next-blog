# Next.js Blog Feature Wiring — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire all UI pages to the existing backend (Prisma DB functions, server actions, Auth.js) — replacing placeholder data with real data fetching, form submission, and interactive features.

**Architecture:** Pages are Server Components that call Prisma directly for reads. Mutations use server actions via `useActionState`. Client interactivity (search input, comment form, reply toggle) is pushed into small `"use client"` leaf components. The avatar system uses `AVATAR_PRESETS` string identifiers (not emojis).

**Tech Stack:** Next.js 16 App Router, Prisma + PostgreSQL, Auth.js v5, react-markdown + remark-gfm, Zod validation, TanStack Query (for profile), Cloudflare R2 (uploads)

---

### Task 1: Update avatar system to use AVATAR_PRESETS

The current `AvatarPicker` uses emoji strings but the database schema stores `AVATAR_PRESETS` identifiers (`"avatar-cat"`, `"avatar-dog"`, etc.). Update the picker and the `Avatar` display to use these presets.

**Files:**

- Modify: `src/components/blog/avatar-picker.tsx`
- Modify: `src/components/blog/comment-item.tsx`
- Test: `tests/unit/validators.test.ts` (already has AVATAR_PRESETS tests — verify no regression)

- [ ] **Step 1: Rewrite AvatarPicker to use AVATAR_PRESETS**

Replace `src/components/blog/avatar-picker.tsx` with:

```tsx
"use client";

import { cn } from "@/lib/utils";
import { AVATAR_PRESETS, type AvatarPreset } from "@/lib/validators";

const AVATAR_LABELS: Record<AvatarPreset, string> = {
  "avatar-cat": "🐱",
  "avatar-dog": "🐶",
  "avatar-fox": "🦊",
  "avatar-owl": "🦉",
  "avatar-bear": "🐻",
  "avatar-rabbit": "🐰",
  "avatar-panda": "🐼",
  "avatar-koala": "🐨",
};

interface AvatarPickerProps {
  selected: AvatarPreset;
  onSelect: (avatar: AvatarPreset) => void;
  className?: string;
}

export function AvatarPicker({ selected, onSelect, className }: AvatarPickerProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-sm font-medium">Choose an Avatar</span>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {AVATAR_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => {
              onSelect(preset);
            }}
            className={cn(
              "flex size-10 items-center justify-center rounded-full text-lg transition-colors",
              selected === preset
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-accent",
            )}
          >
            {AVATAR_LABELS[preset]}
          </button>
        ))}
      </div>
    </div>
  );
}

export function avatarEmoji(preset: string): string {
  return AVATAR_LABELS[preset as AvatarPreset] ?? "👤";
}
```

- [ ] **Step 2: Update CommentItem to render avatar presets**

Replace `src/components/blog/comment-item.tsx` with:

```tsx
import { Avatar, AvatarText } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { avatarEmoji } from "./avatar-picker";

interface CommentItemProps {
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  content: string;
  onReply?: () => void;
  className?: string;
}

export function CommentItem({
  authorName,
  authorAvatar,
  timeAgo,
  content,
  onReply,
  className,
}: CommentItemProps) {
  return (
    <div className={cn("flex gap-3 py-4", className)}>
      <Avatar className="size-8 shrink-0">
        <AvatarText>{avatarEmoji(authorAvatar)}</AvatarText>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{authorName}</span>
          <span className="text-muted-foreground text-xs">{timeAgo}</span>
        </div>

        <p className="text-muted-foreground mt-1 text-sm">{content}</p>

        {onReply && (
          <button
            onClick={onReply}
            className="text-muted-foreground hover:text-foreground mt-1 text-xs font-medium"
          >
            Reply
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run lint and typecheck**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS — no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/blog/avatar-picker.tsx src/components/blog/comment-item.tsx
git commit -m "refactor: use AVATAR_PRESETS instead of emojis in avatar system"
```

---

### Task 2: Wire home page to database with date filtering

Replace placeholder data with real Prisma queries. Support filtering via `?year=2024&month=3` searchParams.

**Files:**

- Modify: `src/app/(main)/page.tsx`
- Modify: `src/components/blog/post-card.tsx` (adjust props to match DB shape)
- Modify: `src/components/blog/date-sidebar.tsx` (wire to URL params)

- [ ] **Step 1: Update PostCard to accept DB post shape**

The Post model has `content` (full text) but PostCard needs an excerpt. Add a helper and accept the Post type. Replace `src/components/blog/post-card.tsx`:

```tsx
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface PostCardProps {
  slug: string;
  title: string;
  content: string;
  createdAt: Date;
  views: number;
  thumbnail?: string | null;
  className?: string;
}

function excerpt(content: string, maxLength = 160): string {
  const plain = content.replace(/[#*`>\-\[\]()!]/g, "").trim();
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trimEnd() + "…";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostCard({
  slug,
  title,
  content,
  createdAt,
  views,
  thumbnail,
  className,
}: PostCardProps) {
  return (
    <article className={cn("border-border border-b pb-6", className)}>
      <Link href={`/blog/${slug}`} className="group block">
        {thumbnail && (
          <div className="bg-muted relative mb-4 aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-[1.02]"
            />
          </div>
        )}

        <h2 className="group-hover:text-foreground/80 text-lg font-semibold">{title}</h2>

        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{excerpt(content)}</p>

        <div className="text-muted-foreground mt-3 flex items-center gap-3 text-xs">
          <time>{formatDate(createdAt)}</time>
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {views.toLocaleString()} views
          </span>
        </div>
      </Link>
    </article>
  );
}
```

- [ ] **Step 2: Wire DateSidebar to URL search params**

Replace `src/components/blog/date-sidebar.tsx`:

```tsx
"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface DateGroup {
  year: number;
  months: string[];
}

interface DateSidebarProps {
  dateGroups: DateGroup[];
  className?: string;
}

const MONTH_INDEX: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export function DateSidebar({ dateGroups, className }: DateSidebarProps) {
  const searchParams = useSearchParams();
  const activeYear = searchParams.get("year");
  const activeMonth = searchParams.get("month");

  const [expandedYears, setExpandedYears] = useState<Set<number>>(
    () => new Set([dateGroups[0]?.year ?? new Date().getFullYear()]),
  );

  function toggleYear(year: number) {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  }

  return (
    <aside className={cn("hidden w-48 shrink-0 lg:block", className)}>
      <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
        Filter by Date
      </h3>

      <div className="flex flex-col gap-1">
        {dateGroups.map((group) => {
          const isExpanded = expandedYears.has(group.year);
          const isYearActive = activeYear === String(group.year) && !activeMonth;

          return (
            <div key={group.year}>
              <button
                onClick={() => {
                  toggleYear(group.year);
                }}
                className={cn(
                  "hover:text-foreground flex w-full items-center gap-1 py-1 text-sm font-medium",
                  isYearActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <ChevronRight
                  className={cn("size-3.5 transition-transform", isExpanded && "rotate-90")}
                />
                {group.year}
              </button>

              {isExpanded && (
                <div className="ml-5 flex flex-col gap-0.5">
                  {group.months.map((month) => {
                    const monthNum = MONTH_INDEX[month];
                    const isMonthActive =
                      activeYear === String(group.year) && activeMonth === String(monthNum);

                    return (
                      <Link
                        key={month}
                        href={`/?year=${String(group.year)}&month=${String(monthNum)}`}
                        className={cn(
                          "py-0.5 text-left text-sm",
                          isMonthActive
                            ? "text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {month}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(activeYear ?? activeMonth) && (
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mt-4 block text-xs underline"
        >
          Clear filters
        </Link>
      )}
    </aside>
  );
}
```

- [ ] **Step 3: Wire home page to DB queries**

Replace `src/app/(main)/page.tsx`:

```tsx
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
```

- [ ] **Step 4: Run lint and typecheck**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/\(main\)/page.tsx src/components/blog/post-card.tsx src/components/blog/date-sidebar.tsx
git commit -m "feat: wire home page to database with date filtering"
```

---

### Task 3: Wire header search to /search route

Make the search input in BlogHeader navigate to `/search?q=...` on submit.

**Files:**

- Modify: `src/components/blog/header.tsx`

- [ ] **Step 1: Create SearchInput client component and wire header**

Replace `src/components/blog/header.tsx`:

```tsx
"use client";

import { Search, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BlogHeaderProps {
  className?: string;
}

export function BlogHeader({ className }: BlogHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/search");
    }
  }

  return (
    <header className={cn("border-border border-b", className)}>
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-lg font-bold">
          Next Blog
        </Link>

        <form onSubmit={handleSearch} className="hidden md:block">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search posts..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              className="h-9 w-64 pl-9"
            />
          </div>
        </form>

        <Link href="/profile" className="text-muted-foreground hover:text-foreground">
          <User className="size-5" />
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Run lint and typecheck**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/header.tsx
git commit -m "feat: wire header search input to /search route"
```

---

### Task 4: Wire search page to searchPosts()

Replace placeholder data with real full-text search.

**Files:**

- Modify: `src/app/(main)/search/page.tsx`

- [ ] **Step 1: Wire search page to DB**

Replace `src/app/(main)/search/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Run lint and typecheck**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/\(main\)/search/page.tsx
git commit -m "feat: wire search page to full-text search"
```

---

### Task 5: Wire blog/[slug] page with markdown rendering and comments

Replace placeholder data with real DB fetch. Render markdown content with `react-markdown`. Wire comment form to `createCommentAction`. Support one-level nested replies.

**Files:**

- Create: `src/components/blog/comment-form.tsx` (client component for form + useActionState)
- Create: `src/components/blog/comment-list.tsx` (client component for reply toggle state)
- Create: `src/components/blog/markdown-content.tsx` (client component wrapping react-markdown)
- Modify: `src/app/(main)/blog/[slug]/page.tsx`

- [ ] **Step 1: Create MarkdownContent component**

Create `src/components/blog/markdown-content.tsx`:

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-neutral prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-foreground prose-strong:text-foreground prose-code:text-foreground max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 2: Create CommentForm client component**

Create `src/components/blog/comment-form.tsx`:

```tsx
"use client";

import { useActionState, useState } from "react";

import { createCommentAction } from "@/app/actions/comment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AVATAR_PRESETS, type ActionResult, type AvatarPreset } from "@/lib/validators";

import { AvatarPicker } from "./avatar-picker";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCancel?: () => void;
}

export function CommentForm({ postId, parentId, onCancel }: CommentFormProps) {
  const [avatar, setAvatar] = useState<AvatarPreset>(AVATAR_PRESETS[0]);

  async function handleSubmit(
    _prev: ActionResult<{ id: string }> | null,
    formData: FormData,
  ): Promise<ActionResult<{ id: string }>> {
    formData.set("postId", postId);
    if (parentId) formData.set("parentId", parentId);
    formData.set("authorAvatar", avatar);
    return createCommentAction(formData);
  }

  const [state, action, isPending] = useActionState(handleSubmit, null);

  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Input name="authorName" placeholder="Your name" required className="flex-1" />
      </div>

      <AvatarPicker selected={avatar} onSelect={setAvatar} />

      <Textarea
        name="content"
        placeholder={parentId ? "Write a reply..." : "Share your thoughts on this post..."}
        required
        className="min-h-[80px] resize-none"
      />

      {state && !state.success && <p className="text-destructive text-sm">{state.error}</p>}

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Create CommentList client component with reply toggling**

Create `src/components/blog/comment-list.tsx`:

```tsx
"use client";

import { useState } from "react";

import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

interface CommentData {
  id: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  createdAt: Date;
  replies: CommentData[];
}

interface CommentListProps {
  comments: CommentData[];
  postId: string;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${String(minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${String(hours)}h ago`;
  const days = Math.floor(hours / 24);
  return `${String(days)}d ago`;
}

export function CommentList({ comments, postId }: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      {comments.map((comment) => (
        <div key={comment.id} className="border-border border-b last:border-b-0">
          <CommentItem
            authorName={comment.authorName}
            authorAvatar={comment.authorAvatar}
            timeAgo={timeAgo(comment.createdAt)}
            content={comment.content}
            onReply={() => {
              setReplyingTo(replyingTo === comment.id ? null : comment.id);
            }}
          />

          {/* Nested replies */}
          {comment.replies.length > 0 && (
            <div className="ml-11 flex flex-col">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  authorName={reply.authorName}
                  authorAvatar={reply.authorAvatar}
                  timeAgo={timeAgo(reply.createdAt)}
                  content={reply.content}
                />
              ))}
            </div>
          )}

          {/* Reply form */}
          {replyingTo === comment.id && (
            <div className="ml-11 pb-4">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onCancel={() => {
                  setReplyingTo(null);
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Wire blog/[slug] page to DB**

Replace `src/app/(main)/blog/[slug]/page.tsx`:

```tsx
import { Eye } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { CommentForm } from "@/components/blog/comment-form";
import { CommentList } from "@/components/blog/comment-list";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { Separator } from "@/components/ui/separator";
import { getPostBySlug } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Lightweight query — getPostBySlug increments views, so use findUnique for metadata
  return { title: slug.replace(/-/g, " ") };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post.published) notFound();

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <article className="mx-auto max-w-2xl px-4 py-6 md:px-6 md:py-8">
      <h1 className="text-2xl font-bold md:text-3xl">{post.title}</h1>

      <div className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
        <time>{formatDate(post.createdAt)}</time>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Eye className="size-3.5" />
          {post.views.toLocaleString()} views
        </span>
      </div>

      {post.thumbnail && (
        <div className="bg-muted relative mt-6 aspect-[16/9] overflow-hidden rounded-lg">
          <Image src={post.thumbnail} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="mt-8">
        <MarkdownContent content={post.content} />
      </div>

      <Separator className="my-8" />

      <section>
        <h2 className="text-lg font-semibold">{post.comments.length} Comments</h2>

        <div className="mt-6">
          <CommentForm postId={post.id} />
        </div>

        <Separator className="my-6" />

        <CommentList comments={post.comments} postId={post.id} />
      </section>
    </article>
  );
}
```

- [ ] **Step 5: Run lint and typecheck**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/blog/markdown-content.tsx src/components/blog/comment-form.tsx src/components/blog/comment-list.tsx src/app/\(main\)/blog/\[slug\]/page.tsx
git commit -m "feat: wire blog post page with markdown rendering and comments"
```

---

### Task 6: Wire auth pages to signIn()

Connect the OAuth buttons and login/signup forms to Auth.js `signIn()`.

**Files:**

- Modify: `src/components/auth/oauth-buttons.tsx`
- Modify: `src/app/(auth)/sign-in/page.tsx`
- Modify: `src/app/(auth)/sign-up/page.tsx`

- [ ] **Step 1: Wire OAuth buttons to signIn server action**

Replace `src/components/auth/oauth-buttons.tsx`:

```tsx
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function OAuthButtons() {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">or continue with</span>
        </div>
      </div>

      <div className="flex gap-3">
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/" });
          }}
          className="flex-1"
        >
          <Button variant="outline" className="w-full" type="submit">
            <GitHubIcon />
            GitHub
          </Button>
        </form>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
          className="flex-1"
        >
          <Button variant="outline" className="w-full" type="submit">
            <GoogleIcon />
            Google
          </Button>
        </form>
      </div>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
```

- [ ] **Step 2: Simplify sign-in page (OAuth only — Auth.js handles email/password via providers)**

Replace `src/app/(auth)/sign-in/page.tsx`:

```tsx
import Link from "next/link";

import { OAuthButtons } from "@/components/auth/oauth-buttons";

export const metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-bold">Next Blog</h1>
          <p className="text-muted-foreground text-sm">Sign in to your account</p>
        </div>

        <OAuthButtons />

        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-foreground font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Simplify sign-up page (OAuth only)**

Replace `src/app/(auth)/sign-up/page.tsx`:

```tsx
import Link from "next/link";

import { OAuthButtons } from "@/components/auth/oauth-buttons";

export const metadata = { title: "Sign Up" };

export default function SignUpPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-bold">Next Blog</h1>
          <p className="text-muted-foreground text-sm">Create your account</p>
        </div>

        <OAuthButtons />

        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-foreground font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run lint and typecheck**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/auth/oauth-buttons.tsx src/app/\(auth\)/sign-in/page.tsx src/app/\(auth\)/sign-up/page.tsx
git commit -m "feat: wire auth pages to Auth.js signIn()"
```

---

### Task 7: Wire profile page to session and create updateProfileAction

Add a server action for updating user name, and wire the profile page to the session.

**Files:**

- Create: `src/app/actions/profile.ts`
- Modify: `src/app/(main)/profile/page.tsx`

- [ ] **Step 1: Create updateProfileAction**

Create `src/app/actions/profile.ts`:

```tsx
"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { type ActionResult, createActionError, createActionResult } from "@/lib/validators";

export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user.id) return createActionError("Not authenticated");

    const name = formData.get("name");
    if (typeof name !== "string" || name.trim().length === 0) {
      return createActionError("Name is required");
    }
    if (name.length > 100) {
      return createActionError("Name must be 100 characters or fewer");
    }

    await getDb().user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
    });

    revalidatePath("/profile");
    return createActionResult(undefined);
  } catch (e) {
    return createActionError(e instanceof Error ? e.message : "Failed to update profile");
  }
}
```

- [ ] **Step 2: Wire profile page to session**

Replace `src/app/(main)/profile/page.tsx`:

```tsx
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { ProfileForm } from "./profile-form";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/profile");

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <ProfileForm userName={session.user.name ?? ""} />
    </div>
  );
}
```

- [ ] **Step 3: Create ProfileForm client component**

Create `src/app/(main)/profile/profile-form.tsx`:

```tsx
"use client";

import { useActionState } from "react";

import { updateProfileAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ActionResult } from "@/lib/validators";

interface ProfileFormProps {
  userName: string;
}

export function ProfileForm({ userName }: ProfileFormProps) {
  async function handleSubmit(
    _prev: ActionResult | null,
    formData: FormData,
  ): Promise<ActionResult> {
    return updateProfileAction(formData);
  }

  const [state, action, isPending] = useActionState(handleSubmit, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Manage your display identity for comments</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={action} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Display Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your nickname"
              defaultValue={userName}
              required
            />
          </div>

          {state && !state.success && <p className="text-destructive text-sm">{state.error}</p>}

          {state?.success && <p className="text-sm text-green-600">Profile updated!</p>}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Run lint and typecheck**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/actions/profile.ts src/app/\(main\)/profile/page.tsx src/app/\(main\)/profile/profile-form.tsx
git commit -m "feat: wire profile page to session with updateProfileAction"
```

---

### Task 8: Wire editor page to createPostAction with image upload and react-markdown preview

Connect the post editor to the `createPostAction` server action, add real R2 image upload, and use `react-markdown` for live preview.

**Files:**

- Modify: `src/app/(dashboard)/dashboard/posts/new/page.tsx`

- [ ] **Step 1: Rewrite editor page with full wiring**

Replace `src/app/(dashboard)/dashboard/posts/new/page.tsx`:

```tsx
"use client";

import { ArrowLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { createPostAction } from "@/app/actions/post";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailFileRef = useRef<File | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    thumbnailFileRef.current = file;
    setThumbnailPreview(URL.createObjectURL(file));
  }

  function clearThumbnail() {
    thumbnailFileRef.current = null;
    setThumbnailPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handlePublish() {
    if (!title.trim() || !markdown.trim()) {
      setError("Title and content are required");
      return;
    }

    const formData = new FormData();
    formData.set("title", title.trim());
    formData.set("slug", slugify(title));
    formData.set("content", markdown);
    formData.set("published", "true");
    if (thumbnailFileRef.current) {
      formData.set("thumbnail", thumbnailFileRef.current);
    }

    startTransition(async () => {
      const result = await createPostAction(formData);
      if (result.success) {
        router.push(`/blog/${result.data.slug}`);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="-mx-6 -mt-8">
      {/* Editor header */}
      <div className="border-border flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
          </Link>
          <span className="text-sm font-medium">New Post</span>
        </div>

        <div className="flex items-center gap-3">
          {error && <span className="text-destructive hidden text-xs sm:block">{error}</span>}
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <Button size="sm" disabled={isPending} onClick={handlePublish}>
            {isPending ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      {/* Title input */}
      <div className="px-6 py-4">
        <input
          type="text"
          placeholder="Enter your title..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
          className="placeholder:text-muted-foreground w-full border-none bg-transparent text-2xl font-bold outline-none"
        />
      </div>

      {/* Featured image */}
      <div className="border-border mx-6 flex items-center gap-4 rounded-lg border p-4">
        {thumbnailPreview ? (
          <div className="relative size-16 shrink-0 overflow-hidden rounded-md">
            <Image src={thumbnailPreview} alt="Thumbnail" fill className="object-cover" />
            <button
              onClick={clearThumbnail}
              className="bg-background/80 absolute top-0 right-0 rounded-bl p-0.5"
            >
              <X className="size-3" />
            </button>
          </div>
        ) : (
          <div className="bg-muted flex size-16 shrink-0 items-center justify-center rounded-md">
            <Upload className="text-muted-foreground size-6" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Featured Image (Optional)</span>
          <span className="text-muted-foreground text-xs">
            Recommended size: 1200×630px. JPG, PNG, WebP.
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-1 w-fit"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <Upload className="size-3.5" />
            {thumbnailPreview ? "Replace" : "Upload Image"}
          </Button>
        </div>
      </div>

      <Separator className="mt-4" />

      {/* Editor split pane */}
      <div className="flex flex-col md:flex-row">
        <div className="border-border flex-1 md:border-r">
          <Textarea
            placeholder="Write your post content in Markdown..."
            value={markdown}
            onChange={(e) => {
              setMarkdown(e.target.value);
              setError(null);
            }}
            className="min-h-[500px] resize-none rounded-none border-0 px-6 py-4 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <div className="border-border flex-1 border-t md:border-t-0">
          <div className="prose prose-neutral max-w-none px-6 py-4">
            {markdown ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                Start typing to see a live preview...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run lint and typecheck**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/\(dashboard\)/dashboard/posts/new/page.tsx
git commit -m "feat: wire editor with createPostAction, R2 upload, and react-markdown preview"
```

---

### Task 9: Update Storybook stories for new component APIs

The component APIs changed (PostCard accepts `content`+`createdAt` instead of `excerpt`+`date`, CommentItem uses `authorAvatar` instead of `authorInitial`, AvatarPicker uses `AvatarPreset`). Update all affected stories.

**Files:**

- Modify: `src/components/blog/post-card.stories.tsx`
- Modify: `src/components/blog/comment-item.stories.tsx`
- Modify: `src/components/blog/avatar-picker.stories.tsx`
- Modify: `src/components/pages/blog-home.stories.tsx`
- Modify: `src/components/pages/post-view.stories.tsx`
- Modify: `src/components/pages/filtered-results.stories.tsx`
- Modify: `src/components/pages/user-profile.stories.tsx`

- [ ] **Step 1: Update post-card stories**

Replace `src/components/blog/post-card.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PostCard } from "./post-card";

const meta = {
  title: "Blog/PostCard",
  component: PostCard,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    slug: "building-a-second-brain",
    title: "Building a Second Brain: Digital Note-Taking in 2024",
    content:
      "Explore how modern note-taking systems can help you organize thoughts, boost creativity, and build a personal knowledge management workflow.",
    createdAt: new Date("2024-03-14"),
    views: 1389,
    thumbnail: "https://picsum.photos/seed/brain/800/450",
  },
};

export const WithoutImage: Story = {
  args: {
    slug: "minimalism-beyond-aesthetics",
    title: "Minimalism Beyond Aesthetics",
    content:
      "Why minimalism is more than just clean visuals — simplicity, from reductive thinking, applies to writing, workflow design, and creative decision-making.",
    createdAt: new Date("2024-02-10"),
    views: 643,
  },
};
```

- [ ] **Step 2: Update comment-item stories**

Replace `src/components/blog/comment-item.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CommentItem } from "./comment-item";

const meta = {
  title: "Blog/CommentItem",
  component: CommentItem,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    authorName: "Emma Torres",
    authorAvatar: "avatar-fox",
    timeAgo: "2 hours ago",
    content:
      "I've bookmarked this for my team's next design review. The principles apply perfectly to our product's redesign efforts.",
  },
};

export const WithReplyButton: Story = {
  args: {
    authorName: "Sarah Lee",
    authorAvatar: "avatar-cat",
    timeAgo: "5 hours ago",
    content:
      "As someone transitioning from print to digital design, this article bridges the gap beautifully.",
    onReply: () => {},
  },
};
```

- [ ] **Step 3: Update avatar-picker stories**

Replace `src/components/blog/avatar-picker.stories.tsx`:

```tsx
"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import type { AvatarPreset } from "@/lib/validators";

import { AvatarPicker } from "./avatar-picker";

const meta = {
  title: "Blog/AvatarPicker",
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function AvatarPickerControlled() {
  const [selected, setSelected] = useState<AvatarPreset>("avatar-cat");
  return <AvatarPicker selected={selected} onSelect={setSelected} />;
}

export const Default: Story = {
  render: () => <AvatarPickerControlled />,
};
```

- [ ] **Step 4: Update page-level stories (blog-home, post-view, filtered-results, user-profile)**

Update the stories to use the new component APIs. Key changes:

- `PostCard` props: `content` instead of `excerpt`, `createdAt` (Date) instead of `date` (string), `thumbnail` instead of `coverImage`
- `CommentItem` props: `authorAvatar` instead of `authorInitial`
- Remove `AvatarPicker` from user-profile story (profile now uses just a name input)

For each page story, update the post/comment data objects accordingly. (The file-specific code follows the same pattern as the component stories above — update prop names to match the new interfaces.)

- [ ] **Step 5: Run lint, typecheck, and build-storybook**

Run: `pnpm typecheck && pnpm lint && pnpm build-storybook`
Expected: All PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/blog/*.stories.tsx src/components/pages/*.stories.tsx
git commit -m "fix: update storybook stories for new component APIs"
```

---

### Task 10: Final cleanup and verification

- [ ] **Step 1: Run full lint + typecheck + test suite**

Run: `pnpm typecheck && pnpm lint && pnpm test`
Expected: All PASS

- [ ] **Step 2: Run Storybook build**

Run: `pnpm build-storybook`
Expected: PASS with no errors

- [ ] **Step 3: Run production build**

Run: `pnpm build`
Expected: PASS (pages that hit DB will fail during static gen if no DATABASE_URL — that's expected and handled by env.ts skip logic)

- [ ] **Step 4: Commit any remaining fixes**

```bash
git add -A
git commit -m "chore: final cleanup after feature wiring"
```
