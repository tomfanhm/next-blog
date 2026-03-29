# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Dev server (Turbopack)
pnpm build            # Production build
pnpm lint             # ESLint — zero warnings enforced (--max-warnings 0)
pnpm lint:fix         # Auto-fix lint issues
pnpm typecheck        # tsc --noEmit
pnpm test             # Vitest unit tests
pnpm test:e2e         # Playwright E2E (Chromium, Firefox, WebKit)
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database (no migration)
pnpm db:migrate       # Run dev migrations
pnpm db:studio        # Open Prisma Studio GUI
pnpm storybook        # Storybook dev server on port 6006
pnpm build-storybook  # Build static Storybook
```

Run a single unit test: `pnpm vitest run tests/unit/validators.test.ts`
Run a single E2E test: `pnpm playwright test tests/e2e/auth.spec.ts`

## Architecture

**Next.js 16 App Router** with route groups for logical separation:

- `(auth)` — public auth pages (sign-in, sign-up)
- `(dashboard)` — protected pages, guarded by `src/proxy.ts`

**Route protection** uses Next.js 16's `proxy.ts` (replaces `middleware.ts`). Protected paths are defined in `protectedPaths` array — unauthenticated users redirect to `/sign-in` with a `callbackUrl` param.

**Auth** is Auth.js v5 with database session strategy (not JWT) via PrismaAdapter. Providers: GitHub and Google OAuth. Config in `src/lib/auth.ts`.

**Database** uses Prisma with PostgreSQL (Neon). The Prisma client in `src/lib/db.ts` is a lazy singleton — it defers instantiation to avoid errors during static generation. Key models: `Post` (blog content with slug, views, published flag), `Comment` (self-referential via `CommentReplies` relation for one-level nesting), and Auth.js models (`User` with `role` field, `Account`, `Session`).

**Full-text search** uses a Postgres `tsvector` generated column on Post (`search_vector`) with a GIN index. Title is weighted 'A', content 'B'. Queries use `$queryRaw` with `ts_rank` for relevance ordering. The migration is in `prisma/migrations/0001_add_search_index/`. The `fullTextSearchPostgres` preview feature is enabled in the Prisma schema.

**File uploads** go to Cloudflare R2 via `@aws-sdk/client-s3` (S3-compatible). Upload/delete helpers are in `src/lib/s3.ts`. Environment variables prefixed with `R2_`.

**Server Actions** are in `src/app/actions/` — `post.ts` (CRUD with `requireAdmin()` guard) and `comment.ts` (create/delete with one-level nesting enforcement). Actions use `useActionState` on the client side.

**Server state** is managed by TanStack Query with a 60s `staleTime`. The query client factory in `src/lib/query-client.ts` creates a new instance server-side and reuses a singleton on the browser.

**Validation** uses Zod schemas in `src/lib/validators.ts` with an `ActionResult<T>` discriminated union pattern for server action return types.

**UI components** in `src/components/ui/` use CVA (class-variance-authority) for type-safe variants, Radix UI primitives for accessibility, and `cn()` (clsx + tailwind-merge) from `src/lib/utils.ts`.

**Storybook** (`@storybook/nextjs-vite`) has component stories alongside source files (`*.stories.tsx`) and page-level composite stories in `src/components/pages/`. Page stories reconstruct layouts from presentational components to avoid Server Action/DB imports.

## Code Conventions

- **TypeScript strict mode** — no `any`, no unused variables
- **Path alias**: `@/*` maps to `src/*`
- **Imports**: sorted by `simple-import-sort` (ESLint plugin) — external first, then internal
- **Styling**: Tailwind CSS v4 with Prettier plugin for class sorting, 100-char line width
- **Git hooks** (Husky): pre-commit runs lint-staged (ESLint + Prettier on staged files), pre-push runs `pnpm build`
- **CI**: PR triggers `preview.yml` (lint → typecheck → test → e2e), push to `main` triggers `production.yml`

## Lint Gotchas

- `@typescript-eslint/no-non-null-assertion` is enforced — use guard clauses or a `getEnv()` helper (see `src/lib/s3.ts`) instead of `!`
- `@typescript-eslint/restrict-template-expressions` — wrap numbers in `String()` inside template literals
- `@typescript-eslint/no-confusing-void-expression` — wrap void arrow returns in braces `{ fn(); }`
- `simple-import-sort/imports` — run `pnpm lint:fix` to auto-sort

## Environment Variables

Requires `DATABASE_URL`, `AUTH_SECRET`, OAuth credentials (`AUTH_GITHUB_ID/SECRET`, `AUTH_GOOGLE_ID/SECRET`), and R2 credentials (`R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`). Copy `.env.example` to `.env.local`.
