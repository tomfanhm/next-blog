# Next Blog

A full-featured blog platform built on top of Next Starter, a handy Next.js 16 starter. Includes posts with full-text search, nested comments, image uploads, OAuth authentication, and a component-driven UI with Storybook.

## Stack

| Layer        | Technology                                         |
| ------------ | -------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack)                 |
| Language     | TypeScript (strict mode)                           |
| Styling      | Tailwind CSS v4 + CVA + Geist fonts                |
| State        | TanStack Query (React Query)                       |
| Validation   | Zod                                                |
| Database     | Prisma 7 + PostgreSQL (Neon)                       |
| Auth         | Auth.js v5 — GitHub & Google OAuth, DB sessions    |
| File Storage | Cloudflare R2 (S3-compatible)                      |
| Components   | Storybook 10 (`@storybook/nextjs-vite`)            |
| Linting      | ESLint 9 (strict TS rules, import sorting)         |
| Formatting   | Prettier + Tailwind plugin                         |
| Git Hooks    | Husky — pre-commit (lint-staged), pre-push (build) |
| Unit Tests   | Vitest + Testing Library                           |
| E2E Tests    | Playwright (Chromium, Firefox, WebKit)             |
| CI/CD        | GitHub Actions (preview + production pipelines)    |

## Features

- **Blog posts** — Create, edit, delete, and publish posts with Markdown content. Each post has a unique slug, view counter, and published flag.
- **Full-text search** — Postgres `tsvector` generated column with GIN index. Title weighted 'A', content 'B', ranked by `ts_rank`.
- **Nested comments** — One level of reply nesting via a self-referential `CommentReplies` relation.
- **Image uploads** — Upload to Cloudflare R2 via presigned S3-compatible URLs.
- **Route protection** — `proxy.ts` (Next.js 16) redirects unauthenticated users to `/sign-in` with a `callbackUrl`.
- **Server Actions** — Form handling via `useActionState` with Zod validation and `ActionResult<T>` discriminated union returns.
- **Storybook** — Component stories alongside source files (`*.stories.tsx`) plus page-level composite stories.

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment variables and fill in your values
cp .env.example .env.local

# Generate Prisma client and push schema to database
pnpm db:generate
pnpm db:push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable               | Description                                |
| ---------------------- | ------------------------------------------ |
| `DATABASE_URL`         | PostgreSQL connection string (Neon)        |
| `AUTH_SECRET`          | Auth.js secret (`openssl rand -base64 32`) |
| `AUTH_GITHUB_ID`       | GitHub OAuth App client ID                 |
| `AUTH_GITHUB_SECRET`   | GitHub OAuth App client secret             |
| `AUTH_GOOGLE_ID`       | Google OAuth client ID                     |
| `AUTH_GOOGLE_SECRET`   | Google OAuth client secret                 |
| `R2_ENDPOINT`          | Cloudflare R2 S3-compatible endpoint       |
| `R2_ACCESS_KEY_ID`     | R2 access key ID                           |
| `R2_SECRET_ACCESS_KEY` | R2 secret access key                       |
| `R2_BUCKET_NAME`       | R2 bucket name                             |
| `R2_PUBLIC_URL`        | Public URL prefix for uploaded files       |

## Scripts

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `pnpm dev`             | Start dev server with Turbopack    |
| `pnpm build`           | Production build                   |
| `pnpm start`           | Start production server            |
| `pnpm lint`            | Run ESLint (zero warnings allowed) |
| `pnpm typecheck`       | TypeScript type checking           |
| `pnpm test`            | Run unit tests (Vitest)            |
| `pnpm test:e2e`        | Run E2E tests (Playwright)         |
| `pnpm db:generate`     | Generate Prisma client             |
| `pnpm db:push`         | Push schema to database            |
| `pnpm db:migrate`      | Run database migrations            |
| `pnpm db:studio`       | Open Prisma Studio                 |
| `pnpm storybook`       | Storybook dev server (port 6006)   |
| `pnpm build-storybook` | Build static Storybook             |

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Public auth pages (sign-in, sign-up)
│   ├── (dashboard)/         # Protected pages (posts, comments, admin)
│   ├── actions/             # Server Actions (post.ts, comment.ts)
│   ├── api/auth/            # Auth.js API route handler
│   ├── layout.tsx           # Root layout (fonts, providers)
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # Reusable UI components (CVA + Radix)
│   └── pages/               # Page-level composite stories
├── lib/
│   ├── auth.ts              # Auth.js configuration
│   ├── db.ts                # Prisma client (lazy singleton)
│   ├── s3.ts                # R2 upload/delete helpers
│   ├── query-client.ts      # TanStack Query client factory
│   ├── utils.ts             # cn() utility
│   └── validators.ts        # Zod schemas + ActionResult<T>
├── providers/               # Client-side providers (React Query)
└── proxy.ts                 # Route protection (Next.js 16 proxy)
tests/
├── unit/                    # Vitest unit tests
└── e2e/                     # Playwright E2E tests
prisma/
├── schema.prisma            # Database schema (Post, Comment, User, etc.)
└── migrations/              # Includes full-text search index migration
.github/workflows/
├── preview.yml              # PR: lint → typecheck → test → e2e
└── production.yml           # main: quality → build → e2e
```

## CI/CD

**Preview** (`preview.yml`) — Runs on every pull request:

- Lint, type check, unit tests
- E2E tests against Chromium

**Production** (`production.yml`) — Runs on push to `main`:

- Full quality checks → production build → E2E tests

## License

MIT
