"use client";

import { ArrowLeft, ImageIcon, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import { createPostAction } from "@/app/actions/post";
import { MarkdownEditor } from "@/components/markdown-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ActionResult } from "@/lib/validators";

export default function NewPostPage() {
  const router = useRouter();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult<{ slug: string }> | null, formData: FormData) => {
      const result = await createPostAction(formData);
      if (result.success) router.push(`/blog/${result.data.slug}`);
      return result;
    },
    null,
  );

  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  }

  return (
    <form action={formAction} className="bg-background flex h-screen flex-col">
      {/* Top Bar */}
      <div className="border-border flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-foreground hover:text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="text-foreground text-base font-medium">Edit Post</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-[13px]">
            Automatically saved to local storage
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              router.back();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      {/* Title Section */}
      <div className="border-border border-b px-6 py-4">
        <Input
          name="title"
          placeholder="Enter your title..."
          required
          className="text-foreground placeholder:text-muted-foreground border-0 bg-transparent text-[28px] font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <input type="hidden" name="published" value="true" />
      </div>

      {/* Slug */}
      <div className="border-border border-b px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Slug:</span>
          <Input
            name="slug"
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            placeholder="my-post-slug"
            className="h-8 max-w-xs border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Thumbnail Section */}
      <div className="border-border flex items-center gap-6 border-b px-6 py-4">
        <div className="border-border bg-accent flex h-[130px] w-[200px] shrink-0 items-center justify-center overflow-hidden rounded-lg border">
          {thumbnailPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <ImageIcon className="text-muted-foreground h-8 w-8" />
              <span className="text-muted-foreground text-xs">No image</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-foreground text-sm font-medium">Featured Image (Optional)</span>
          <p className="text-muted-foreground text-[13px] leading-relaxed">
            Add a thumbnail image to your post. Recommended size: 1200x630px. Supported formats:
            JPG, PNG, WebP.
          </p>
          <label className="cursor-pointer">
            <Button type="button" variant="outline" size="sm" className="gap-2" asChild>
              <span>
                <Upload className="h-3.5 w-3.5" />
                Upload Image
              </span>
            </Button>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
            />
          </label>
        </div>
      </div>

      {state && !state.success && (
        <div className="border-border border-b px-6 py-2">
          <p className="text-destructive text-sm">{state.error}</p>
        </div>
      )}

      {/* Split-pane Editor */}
      <div className="flex-1 overflow-hidden">
        <MarkdownEditor name="content" />
      </div>
    </form>
  );
}
