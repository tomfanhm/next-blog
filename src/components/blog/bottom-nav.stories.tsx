import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BottomNav } from "./bottom-nav";

const meta = {
  title: "Blog/BottomNav",
  component: BottomNav,
  parameters: {
    layout: "fullscreen",
    viewport: { defaultViewport: "mobile1" },
    nextjs: {
      navigation: { pathname: "/" },
    },
  },
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomeActive: Story = {};

export const SearchActive: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: "/search" },
    },
  },
};

export const ProfileActive: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: "/profile" },
    },
  },
};
