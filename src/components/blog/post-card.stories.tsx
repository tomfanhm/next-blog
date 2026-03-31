import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PostCard } from "./post-card";

const meta = {
  title: "Blog/PostCard",
  component: PostCard,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    slug: "building-a-second-brain",
    title: "Building a Second Brain: Digital Note-Taking in 2024",
    content:
      "Explore how modern note-taking systems can help you organize thoughts, boost creativity, and build a personal knowledge management workflow.",
    createdAt: new Date("2024-03-14"),
    views: 1389,
    thumbnail: "https://picsum.photos/seed/brain/800/450",
  },
};

export const WithoutImage: Story = {
  args: {
    slug: "minimalism-beyond-aesthetics",
    title: "Minimalism Beyond Aesthetics",
    content:
      "Why minimalism is more than just clean visuals — simplicity, from reductive thinking, applies to writing, workflow design, and creative decision-making.",
    createdAt: new Date("2024-02-10"),
    views: 643,
  },
};

export const LongExcerpt: Story = {
  args: {
    slug: "understanding-react-hooks",
    title: "Understanding React Hooks: A Complete Guide",
    content:
      "Learn how to use useState, useEffect, and custom hooks to build powerful React applications. This guide covers everything from basics to advanced patterns. We explore the mental model behind hooks and how they simplify state management.",
    createdAt: new Date("2024-05-15"),
    views: 15897,
    thumbnail: "https://picsum.photos/seed/hooks/800/450",
  },
};
