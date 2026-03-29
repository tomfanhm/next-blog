import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MarkdownEditor } from "./markdown-editor";

const meta: Meta<typeof MarkdownEditor> = {
  title: "Components/MarkdownEditor",
  component: MarkdownEditor,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MarkdownEditor>;

export const Empty: Story = {
  args: {
    name: "content",
  },
};

export const WithContent: Story = {
  args: {
    name: "content",
    defaultValue: `# My Blog Post

## Introduction

This is a sample blog post written in **Markdown**.

- Point one
- Point two
- Point three

\`\`\`javascript
console.log("Hello, world!");
\`\`\`

> A wise quote goes here.
`,
  },
};
