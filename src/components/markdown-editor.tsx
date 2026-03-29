"use client";

import { useState } from "react";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}

/**
 * Split-pane Markdown editor matching the Author Editor design.
 * Left pane: monospace text editor. Right pane: live rendered preview.
 */
export function MarkdownEditor({ name, defaultValue = "", placeholder }: MarkdownEditorProps) {
  const [content, setContent] = useState(defaultValue);
  const [activePane, setActivePane] = useState<"split" | "write" | "preview">("split");

  return (
    <div className="flex h-full flex-col">
      {/* Pane toggle — visible on smaller viewports */}
      <div className="border-border flex border-b lg:hidden">
        {(["write", "preview"] as const).map((pane) => (
          <button
            key={pane}
            type="button"
            onClick={() => {
              setActivePane(pane);
            }}
            className={cn(
              "px-4 py-2 text-sm font-medium capitalize",
              activePane === pane
                ? "border-primary text-foreground border-b-2"
                : "text-muted-foreground",
            )}
          >
            {pane}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Write pane */}
        <div className={cn("flex-1", activePane === "preview" ? "hidden lg:flex" : "flex")}>
          <textarea
            name={name}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            placeholder={placeholder ?? "Write your post in Markdown..."}
            className="bg-background text-foreground placeholder:text-muted-foreground h-full w-full resize-none p-6 font-mono text-sm leading-[1.7] focus:outline-none"
          />
        </div>

        {/* Divider */}
        <div className={cn("bg-border w-px", activePane !== "split" ? "hidden lg:block" : "")} />

        {/* Preview pane */}
        <div
          className={cn(
            "bg-secondary flex-1 overflow-y-auto p-6",
            activePane === "write" ? "hidden lg:block" : "block",
          )}
        >
          {content ? (
            <MarkdownRenderer content={content} />
          ) : (
            <p className="text-muted-foreground text-sm">Preview will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
}
