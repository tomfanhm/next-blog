import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CommentCard } from "./comment-card";

const NOW = new Date();
const hoursAgo = (h: number) => new Date(NOW.getTime() - h * 3600000);

const meta: Meta<typeof CommentCard> = {
  title: "Components/CommentCard",
  component: CommentCard,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 700, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CommentCard>;

const baseComment = {
  id: "comment-1",
  content: "This is a great blog post! I learned a lot about Next.js server components.",
  authorName: "Alice",
  authorAvatar: "avatar-cat",
  postId: "post-1",
  parentId: null,
  createdAt: hoursAgo(3),
};

export const Default: Story = {
  args: {
    comment: { ...baseComment, replies: [] },
    postId: "post-1",
  },
};

export const WithReplies: Story = {
  args: {
    comment: {
      ...baseComment,
      replies: [
        {
          id: "reply-1",
          content: "Thanks Alice! Glad you found it helpful.",
          authorName: "Bob",
          authorAvatar: "avatar-fox",
          postId: "post-1",
          parentId: "comment-1",
          createdAt: hoursAgo(1),
        },
        {
          id: "reply-2",
          content: "I agree, this was very informative. The section on streaming was eye-opening.",
          authorName: "Charlie",
          authorAvatar: "avatar-owl",
          postId: "post-1",
          parentId: "comment-1",
          createdAt: hoursAgo(0.5),
        },
      ],
    },
    postId: "post-1",
  },
};

export const AsReply: Story = {
  args: {
    comment: {
      ...baseComment,
      id: "reply-1",
      parentId: "comment-1",
      content: "Thanks for sharing!",
      authorName: "Bob",
      authorAvatar: "avatar-dog",
    },
    postId: "post-1",
    isReply: true,
  },
};
