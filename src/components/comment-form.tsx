"use client";

import { useActionState, useState } from "react";

import { createCommentAction } from "@/app/actions/comment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/validators";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

export function CommentForm({ postId, parentId, compact, onSuccess }: CommentFormProps) {
  const [anonymous, setAnonymous] = useState(false);
  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult<{ id: string }> | null, formData: FormData) => {
      const result = await createCommentAction(formData);
      if (result.success) onSuccess?.();
      return result;
    },
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="postId" value={postId} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}
      <input type="hidden" name="authorAvatar" value="avatar-cat" />

      {!compact && <label className="text-foreground text-sm font-medium">Add a comment</label>}

      <Textarea
        name="content"
        placeholder={compact ? "Write a reply..." : "Share your thoughts on this post..."}
        required
        maxLength={2000}
        rows={compact ? 2 : 4}
      />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {anonymous ? (
            <input type="hidden" name="authorName" value="Anonymous" />
          ) : (
            <input
              name="authorName"
              placeholder="Your name"
              required
              maxLength={50}
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-9 w-36 rounded-md border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          )}
          <button
            type="button"
            role="switch"
            aria-checked={anonymous}
            onClick={() => {
              setAnonymous((prev) => !prev);
            }}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
              anonymous ? "bg-primary" : "bg-input"
            }`}
          >
            <span
              className={`bg-background inline-block h-4 w-4 rounded-full shadow-sm transition-transform ${
                anonymous ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className="text-muted-foreground text-[13px]">Anonymity Mode</span>
        </div>

        <Button type="submit" disabled={isPending} size={compact ? "sm" : "default"}>
          {isPending ? "Posting..." : "Post Comment"}
        </Button>
      </div>

      {state && !state.success && <p className="text-destructive text-sm">{state.error}</p>}
    </form>
  );
}
