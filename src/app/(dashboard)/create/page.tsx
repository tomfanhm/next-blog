"use client";

import { ArrowLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { createPostAction } from "@/app/actions/post";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/format";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailFileRef = useRef<File | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    thumbnailFileRef.current = file;
    setThumbnailPreview(URL.createObjectURL(file));
  }

  function clearThumbnail() {
    thumbnailFileRef.current = null;
    setThumbnailPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handlePublish() {
    if (!title.trim() || !markdown.trim()) {
      setError("Title and content are required");
      return;
    }

    const formData = new FormData();
    formData.set("title", title.trim());
    formData.set("slug", slugify(title));
    formData.set("content", markdown);
    formData.set("published", "true");
    if (thumbnailFileRef.current) {
      formData.set("thumbnail", thumbnailFileRef.current);
    }

    startTransition(async () => {
      const result = await createPostAction(formData);
      if (result.success) {
        router.push(`/blog/${result.data.slug}`);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="-mx-6 -mt-8">
      {/* Editor header */}
      <div className="border-border flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
          </Link>
          <span className="text-sm font-medium">New Post</span>
        </div>

        <div className="flex items-center gap-3">
          {error && <span className="text-destructive hidden text-xs sm:block">{error}</span>}
          {!error && (
            <span className="text-muted-foreground hidden text-xs sm:block">
              Autosave: saved to local storage
            </span>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Cancel</Link>
          </Button>
          <Button size="sm" disabled={isPending} onClick={handlePublish}>
            {isPending ? "Publishing..." : "Publish"}
          </Button>
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
            setError(null);
          }}
          className="placeholder:text-muted-foreground w-full border-none bg-transparent text-2xl font-bold outline-none"
        />
      </div>

      {/* Featured image */}
      <div className="border-border mx-6 flex items-center gap-4 rounded-lg border p-4">
        {thumbnailPreview ? (
          <div className="relative size-16 shrink-0 overflow-hidden rounded-md">
            <Image src={thumbnailPreview} alt="Thumbnail" fill className="object-cover" />
            <Button
              variant="ghost"
              size="icon"
              onClick={clearThumbnail}
              className="absolute top-0 right-0 size-5 rounded-bl"
            >
              <X className="size-3" />
            </Button>
          </div>
        ) : (
          <div className="bg-muted flex size-16 shrink-0 items-center justify-center rounded-md">
            <Upload className="text-muted-foreground size-6" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Featured Image (Optional)</span>
          <span className="text-muted-foreground text-xs">
            Recommended size: 1200x630px. JPG, PNG, WebP.
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-1 w-fit"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <Upload className="size-3.5" />
            {thumbnailPreview ? "Replace" : "Upload Image"}
          </Button>
        </div>
      </div>

      <Separator className="mt-4" />

      {/* Editor split pane */}
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="border-border flex-1 md:border-r">
          <Textarea
            placeholder="Write your post content in Markdown..."
            value={markdown}
            onChange={(e) => {
              setMarkdown(e.target.value);
              setError(null);
            }}
            className="min-h-96 resize-none rounded-none border-0 px-6 py-4 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <div className="border-border flex-1 border-t md:border-t-0">
          <div className="prose prose-neutral max-w-none px-6 py-4">
            {markdown ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                Start typing to see a live preview...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
