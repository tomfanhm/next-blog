// Storybook mock — prevents @prisma/adapter-pg (Node.js-only) from being bundled
export class PrismaPg {
  constructor(_opts?: unknown) {
    // no-op in browser
  }
}
