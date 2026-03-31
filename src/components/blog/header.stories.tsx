import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BlogHeader } from "./header";

const meta = {
  title: "Blog/Header",
  component: BlogHeader,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof BlogHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutSearch: Story = {
  args: {
    showSearch: false,
  },
};
