import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { MarkdownEditor } from "@/components/markdown-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function AuthorEditorPage() {
  return (
    <div className="bg-background text-foreground flex h-screen flex-col">
      {/* Top bar */}
      <header className="border-border flex h-14 items-center justify-between border-b px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="text-muted-foreground text-sm">Draft</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button size="sm">Publish</Button>
        </div>
      </header>

      {/* Title & slug */}
      <div className="border-border flex flex-col gap-3 border-b px-6 py-4">
        <Input
          placeholder="Post title"
          defaultValue="Understanding React Server Components"
          className="border-0 text-2xl font-semibold focus-visible:ring-0"
        />
        <Input
          placeholder="post-slug"
          defaultValue="understanding-react-server-components"
          className="text-muted-foreground w-80 border-0 text-sm focus-visible:ring-0"
        />
      </div>

      {/* Editor */}
      <div className="flex-1">
        <MarkdownEditor
          name="content"
          defaultValue={`## Introduction

React Server Components represent a fundamental shift in how we think about rendering in React applications.

## Key Concepts

- **Zero bundle size** — Server Components don't add to your JavaScript bundle
- **Direct data access** — Query databases without APIs
- **Streaming** — Progressive rendering with Suspense

\`\`\`tsx
// This component runs on the server
export default async function PostPage({ params }) {
  const post = await db.post.findUnique({
    where: { slug: params.slug },
  });

  return <Article post={post} />;
}
\`\`\`

> Server Components are the default in the App Router — no opt-in needed.
`}
        />
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Pages/Author Editor",
  component: AuthorEditorPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
