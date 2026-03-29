// Storybook mock — prevents Prisma Client (Node.js-only) from being bundled
// Only types are re-exported for components that need them

export class PrismaClient {
  constructor(_opts?: unknown) {
    // no-op in browser
  }
}

export type Prisma = Record<string, unknown>;
