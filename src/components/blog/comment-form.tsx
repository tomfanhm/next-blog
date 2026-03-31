"use client";

import { useActionState, useRef, useState } from "react";

import { createCommentAction } from "@/app/actions/comment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(
    _prev: ActionResult<{ id: string }> | null,
    formData: FormData,
  ): Promise<ActionResult<{ id: string }>> {
    formData.set("postId", postId);
    if (parentId) formData.set("parentId", parentId);
    formData.set("authorAvatar", avatar);
    const result = await createCommentAction(formData);
    if (result.success) {
      formRef.current?.reset();
      setAvatar(AVATAR_PRESETS[0]);
    }
    return result;
  }

  const [state, action, isPending] = useActionState(handleSubmit, null);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="authorName">Name</Label>
        <Input id="authorName" name="authorName" placeholder="Your name" required />
      </div>

      <AvatarPicker selected={avatar} onSelect={setAvatar} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="content">Comment</Label>
        <Textarea
          id="content"
          name="content"
          placeholder={parentId ? "Write a reply..." : "Share your thoughts on this post..."}
          required
          className="resize-none"
        />
      </div>

      <div aria-live="polite">
        {state && !state.success && <p className="text-destructive text-sm">{state.error}</p>}
        {state?.success && <p className="text-success text-sm">Comment posted!</p>}
      </div>

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
