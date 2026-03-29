"use server";

import { revalidatePath } from "next/cache";

import { createComment, deleteComment, getDb } from "@/lib/db";
import {
  type ActionResult,
  createActionError,
  createActionResult,
  createCommentSchema,
} from "@/lib/validators";

export async function createCommentAction(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = createCommentSchema.safeParse({
      content: formData.get("content"),
      authorName: formData.get("authorName"),
      authorAvatar: formData.get("authorAvatar"),
      postId: formData.get("postId"),
      parentId: formData.get("parentId") || undefined,
    });

    if (!parsed.success) return createActionError(parsed.error.issues[0].message);

    // Enforce one level of nesting: if parentId is set, ensure parent has no parent
    if (parsed.data.parentId) {
      const parent = await getDb().comment.findUnique({
        where: { id: parsed.data.parentId },
        select: { parentId: true },
      });
      if (parent?.parentId) {
        return createActionError("Replies can only be one level deep");
      }
    }

    const comment = await createComment(parsed.data);

    // Get the post slug to revalidate the correct page
    const post = await getDb().post.findUnique({
      where: { id: parsed.data.postId },
      select: { slug: true },
    });
    if (post) revalidatePath(`/blog/${post.slug}`);

    return createActionResult({ id: comment.id });
  } catch (e) {
    return createActionError(e instanceof Error ? e.message : "Failed to post comment");
  }
}

export async function deleteCommentAction(id: string): Promise<ActionResult> {
  try {
    const comment = await getDb().comment.findUnique({
      where: { id },
      select: { post: { select: { slug: true } } },
    });

    await deleteComment(id);

    if (comment?.post.slug) revalidatePath(`/blog/${comment.post.slug}`);
    return createActionResult(undefined);
  } catch (e) {
    return createActionError(e instanceof Error ? e.message : "Failed to delete comment");
  }
}
