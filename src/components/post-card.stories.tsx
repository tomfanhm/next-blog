import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PostCard, PostCardHorizontal } from "./post-card";

const SAMPLE_POST = {
  slug: "getting-started-with-nextjs",
  title: "Getting Started with Next.js 16",
  excerpt:
    "Learn how to build modern web applications with the latest version of Next.js, featuring the App Router, Server Components, and more.",
  date: "March 15, 2026",
  views: 1234,
  thumbnail: "https://picsum.photos/seed/nextjs/600/400",
};

// --- PostCard (vertical) ---

const verticalMeta: Meta<typeof PostCard> = {
  title: "Components/PostCard",
  component: PostCard,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default verticalMeta;
type VerticalStory = StoryObj<typeof PostCard>;

export const Default: VerticalStory = {
  args: SAMPLE_POST,
};

export const NoThumbnail: VerticalStory = {
  args: {
    ...SAMPLE_POST,
    thumbnail: null,
  },
};

export const LongTitle: VerticalStory = {
  args: {
    ...SAMPLE_POST,
    title:
      "This Is a Very Long Blog Post Title That Should Demonstrate How the Card Handles Overflow",
  },
};

// --- PostCardHorizontal ---

export const Horizontal: StoryObj<typeof PostCardHorizontal> = {
  render: (args) => (
    <div style={{ maxWidth: 900, padding: 24 }}>
      <PostCardHorizontal {...args} />
    </div>
  ),
  args: SAMPLE_POST,
};

export const HorizontalNoThumbnail: StoryObj<typeof PostCardHorizontal> = {
  render: (args) => (
    <div style={{ maxWidth: 900, padding: 24 }}>
      <PostCardHorizontal {...args} />
    </div>
  ),
  args: {
    ...SAMPLE_POST,
    thumbnail: null,
  },
};
