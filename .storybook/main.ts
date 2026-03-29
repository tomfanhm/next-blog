import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/nextjs-vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: "@storybook/nextjs-vite",
  viteFinal(config) {
    // Mock server-only modules that use Node.js APIs (Buffer, node:*)
    // so they don't break the browser bundle
    config.resolve ??= {};
    config.resolve.alias ??= {};
    Object.assign(config.resolve.alias, {
      "@prisma/adapter-pg": path.resolve(__dirname, "mocks/prisma-adapter.ts"),
      "@/generated/prisma/client": path.resolve(__dirname, "mocks/prisma-client.ts"),
      // next/image mock — built-in NextImage mock is broken with Next.js 16
      "next/image": path.resolve(__dirname, "mocks/next-image.tsx"),
    });
    return config;
  },
};
export default config;
