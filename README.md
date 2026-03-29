# Next Starter

Enterprise-grade Next.js 16 starter with App Router, designed for high-traffic production environments.

## Stack

| Layer      | Technology                                         |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack)                 |
| Language   | TypeScript (strict mode)                           |
| Styling    | Tailwind CSS v4 + CVA + Geist fonts                |
| State      | TanStack Query (React Query)                       |
| Validation | Zod                                                |
| Database   | Prisma ORM (PostgreSQL)                            |
| Auth       | Auth.js v5 (NextAuth) — GitHub & Google OAuth      |
| Linting    | ESLint 9 (strict TS rules, import sorting)         |
| Formatting | Prettier + Tailwind plugin                         |
| Git Hooks  | Husky — pre-commit (lint-staged), pre-push (build) |
| Unit Tests | Vitest + Testing Library                           |
| E2E Tests  | Playwright (Chromium, Firefox, WebKit)             |
| CI/CD      | GitHub Actions (preview + production pipelines)    |

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

| Variable             | Description                                |
| -------------------- | ------------------------------------------ |
| `DATABASE_URL`       | PostgreSQL connection string               |
| `AUTH_SECRET`        | Auth.js secret (`openssl rand -base64 32`) |
| `AUTH_GITHUB_ID`     | GitHub OAuth App client ID                 |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App client secret             |
| `AUTH_GOOGLE_ID`     | Google OAuth client ID                     |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret                 |

## Scripts

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `pnpm dev`         | Start dev server with Turbopack    |
| `pnpm build`       | Production build                   |
| `pnpm start`       | Start production server            |
| `pnpm lint`        | Run ESLint (zero warnings allowed) |
| `pnpm typecheck`   | TypeScript type checking           |
| `pnpm test`        | Run unit tests (Vitest)            |
| `pnpm test:e2e`    | Run E2E tests (Playwright)         |
| `pnpm db:generate` | Generate Prisma client             |
| `pnpm db:migrate`  | Run database migrations            |
| `pnpm db:studio`   | Open Prisma Studio                 |

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Auth route group (sign-in, sign-up)
│   ├── (dashboard)/         # Protected dashboard route group
│   ├── api/auth/            # Auth.js API route handler
│   ├── layout.tsx           # Root layout (fonts, providers)
│   ├── page.tsx             # Home page
│   ├── loading.tsx          # Global loading state
│   ├── error.tsx            # Global error boundary
│   └── not-found.tsx        # 404 page
├── components/ui/           # Reusable UI components (CVA)
├── lib/
│   ├── auth.ts              # Auth.js configuration
│   ├── db.ts                # Prisma client (lazy singleton)
│   ├── query-client.ts      # TanStack Query client
│   ├── utils.ts             # cn() utility
│   └── validators.ts        # Zod schemas
├── providers/               # Client-side providers (React Query)
└── proxy.ts                 # Route protection (Next.js 16 proxy)
tests/
├── unit/                    # Vitest unit tests
└── e2e/                     # Playwright E2E tests
.github/workflows/
├── preview.yml              # PR pipeline (lint → typecheck → test → e2e)
└── production.yml           # Main branch pipeline (quality → build → e2e)
```

## CI/CD

**Preview** (`preview.yml`) — Runs on every pull request:

- Lint, type check, unit tests (parallel-ready)
- E2E tests against Chromium

**Production** (`production.yml`) — Runs on push to `main`:

- Full quality checks → production build → E2E tests

## License

MIT
