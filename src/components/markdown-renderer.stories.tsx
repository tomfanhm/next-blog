import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MarkdownRenderer } from "./markdown-renderer";

const meta: Meta<typeof MarkdownRenderer> = {
  title: "Components/MarkdownRenderer",
  component: MarkdownRenderer,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 800, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MarkdownRenderer>;

export const Default: Story = {
  args: {
    content: `# Hello World

This is a **blog post** rendered from Markdown.

## Features

- Server Components
- Streaming SSR
- Built-in \`Image\` optimization

### Code Example

\`\`\`typescript
export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}
\`\`\`

> Blockquotes look like this. They're great for highlighting key points.

Here's a [link to Next.js](https://nextjs.org) for reference.

---

| Feature | Status |
|---------|--------|
| App Router | ✅ Stable |
| Turbopack | ✅ Default |
| PPR | 🔄 Migrating |

That's a wrap!
`,
  },
};

export const ShortContent: Story = {
  args: {
    content: "Just a simple paragraph of text with some **bold** and *italic* formatting.",
  },
};
