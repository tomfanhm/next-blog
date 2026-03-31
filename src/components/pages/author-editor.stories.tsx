"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowLeft, Upload } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const meta = {
  title: "Pages/AuthorEditor",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMarkdown = `# Getting Started with Markdown

Markdown is a **lightweight markup language** that you can use to add formatting to plain text documents.

## Why Markdown?

- Simple and intuitive syntax
- Converts easily to HTML
- Widely supported across platforms
- Perfect for technical writing

> "Markdown is intended to be as easy-to-read and easy-to-write as is feasible."

## Code Example

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\``;

function EditorContent() {
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState(sampleMarkdown);

  const paragraphs = markdown.split("\n\n").filter(Boolean);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Editor header */}
      <div className="border-border flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <ArrowLeft className="text-muted-foreground size-4" />
          <span className="text-sm font-medium">Edit Post</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Publish</Button>
        </div>
      </div>

      {/* Title input */}
      <div className="px-6 py-4">
        <input
          type="text"
          placeholder="Enter your title..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className="placeholder:text-muted-foreground w-full border-none bg-transparent text-2xl font-bold outline-none"
        />
      </div>

      {/* Featured image */}
      <div className="border-border mx-6 flex items-center gap-4 rounded-lg border p-4">
        <div className="bg-muted flex size-16 items-center justify-center rounded-md">
          <Upload className="text-muted-foreground size-6" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Featured Image (Optional)</span>
          <span className="text-muted-foreground text-xs">
            Add a thumbnail image to your post. Recommended size: 1200×630px.
          </span>
          <Button variant="outline" size="sm" className="mt-1 w-fit">
            <Upload className="size-3.5" />
            Upload Image
          </Button>
        </div>
      </div>

      <Separator className="mt-4" />

      {/* Split pane */}
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="border-border flex-1 md:border-r">
          <Textarea
            value={markdown}
            onChange={(e) => {
              setMarkdown(e.target.value);
            }}
            className="min-h-96 resize-none rounded-none border-0 px-6 py-4 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="border-border flex-1 border-t md:border-t-0">
          <div className="px-6 py-4">
            {paragraphs.map((p, i) => {
              if (p.startsWith("# ")) {
                return (
                  <h1 key={i} className="mt-4 mb-3 text-xl font-bold">
                    {p.replace("# ", "")}
                  </h1>
                );
              }
              if (p.startsWith("## ")) {
                return (
                  <h2 key={i} className="mt-5 mb-2 text-lg font-semibold">
                    {p.replace("## ", "")}
                  </h2>
                );
              }
              return (
                <p key={i} className="mb-3 text-sm leading-relaxed">
                  {p}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <EditorContent />,
};
