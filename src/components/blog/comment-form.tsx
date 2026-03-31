"use client";

import { useActionState, useState } from "react";

import { createCommentAction } from "@/app/actions/comment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type ActionResult, AVATAR_PRESETS, type AvatarPreset } from "@/lib/validators";

import { AvatarPicker } from "./avatar-picker";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCancel?: () => void;
}

export function CommentForm({ postId, parentId, onCancel }: CommentFormProps) {
  const [avatar, setAvatar] = useState<AvatarPreset>(AVATAR_PRESETS[0]);

  async function handleSubmit(
    _prev: ActionResult<{ id: string }> | null,
    formData: FormData,
  ): Promise<ActionResult<{ id: string }>> {
    formData.set("postId", postId);
    if (parentId) formData.set("parentId", parentId);
    formData.set("authorAvatar", avatar);
    return createCommentAction(formData);
  }

  const [state, action, isPending] = useActionState(handleSubmit, null);

  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Input name="authorName" placeholder="Your name" required className="flex-1" />
      </div>

      <AvatarPicker selected={avatar} onSelect={setAvatar} />

      <Textarea
        name="content"
        placeholder={parentId ? "Write a reply..." : "Share your thoughts on this post..."}
        required
        className="min-h-[80px] resize-none"
      />

      {state && !state.success && <p className="text-destructive text-sm">{state.error}</p>}

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
}
