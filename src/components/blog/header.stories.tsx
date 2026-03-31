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

export const LoggedOut: Story = {};

export const LoggedIn: Story = {
  args: {
    user: { name: "Jane Doe", image: null, role: "user" },
  },
};

export const Admin: Story = {
  args: {
    user: { name: "Admin User", image: null, role: "admin" },
  },
};
