import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/nextjs-vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextImageMockPath = path.resolve(__dirname, "mocks/next-image.tsx");

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
    });

    // Override next/image with a simple <img> mock.
    // vite-plugin-storybook-nextjs intercepts next/image via resolveId before
    // aliases take effect, so we need a plugin with enforce: "pre" to win.
    config.plugins ??= [];
    config.plugins.unshift({
      name: "storybook-next-image-mock",
      enforce: "pre",
      resolveId(id) {
        if (id === "next/image") return nextImageMockPath;
      },
    });

    return config;
  },
};
export default config;
