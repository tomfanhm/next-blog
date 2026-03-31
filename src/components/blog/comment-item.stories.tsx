import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CommentItem } from "./comment-item";

const meta = {
  title: "Blog/CommentItem",
  component: CommentItem,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    authorName: "Emma Torres",
    authorAvatar: "avatar-cat",
    timeAgo: "2 hours ago",
    content:
      "I've bookmarked this for my team's next design review. The principles apply perfectly to our product's redesign efforts.",
  },
};

export const LongComment: Story = {
  args: {
    authorName: "Sarah Lee",
    authorAvatar: "avatar-fox",
    timeAgo: "5 hours ago",
    content:
      "As someone transitioning from print to digital design, this article bridges the gap beautifully. The core principles remain the same — clarity, intentionality, and restraint. I especially appreciated the section on typography in minimalist contexts.",
  },
};
