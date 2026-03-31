import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BottomNav } from "@/components/blog/bottom-nav";
import { DateSidebar } from "@/components/blog/date-sidebar";
import { BlogHeader } from "@/components/blog/header";
import { PostCard } from "@/components/blog/post-card";

const meta = {
  title: "Pages/Home",
  parameters: {
    layout: "fullscreen",
    nextjs: {
      navigation: { pathname: "/" },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const dateGroups = [
  { year: 2024, months: ["March", "February", "January"] },
  { year: 2023, months: ["December", "November"] },
  { year: 2022, months: [] },
];

const posts = [
  {
    slug: "building-a-second-brain",
    title: "Building a Second Brain: Digital Note-Taking in 2024",
    content:
      "Explore how modern note-taking systems can help you organize thoughts, boost creativity, and build a personal knowledge management workflow that actually sticks.",
    createdAt: new Date("2024-03-14"),
    views: 1389,
    thumbnail: "https://picsum.photos/seed/brain/800/450",
  },
  {
    slug: "the-art-of-slow-reading",
    title: "The Art of Slow Reading",
    content:
      "In a world of skimming and speed-reading, rediscovering the lost practice of slow, deliberate reading can transform how you absorb and retain information.",
    createdAt: new Date("2024-02-28"),
    views: 872,
    thumbnail: "https://picsum.photos/seed/reading/800/450",
  },
  {
    slug: "minimalism-beyond-aesthetics",
    title: "Minimalism Beyond Aesthetics",
    content:
      "Why minimalism is more than just clean visuals — simplicity, from reductive thinking, applies to writing, workflow design, and creative decision-making.",
    createdAt: new Date("2024-02-10"),
    views: 643,
  },
];

export const Desktop: Story = {
  render: () => (
    <div className="bg-background flex min-h-screen flex-col">
      <BlogHeader />
      <div className="mx-auto flex max-w-5xl gap-8 px-6 py-8">
        <DateSidebar dateGroups={dateGroups} className="block w-48 shrink-0" />
        <div className="flex flex-1 flex-col gap-8">
          {posts.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: () => (
    <div className="bg-background flex min-h-screen flex-col">
      <BlogHeader />
      <div className="flex-1 px-4 py-6 pb-20">
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  ),
};
