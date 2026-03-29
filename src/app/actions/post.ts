"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { createPost, deletePost, getDb, updatePost } from "@/lib/db";
import { deleteThumbnail, uploadThumbnail } from "@/lib/s3";
import {
  type ActionResult,
  createActionError,
  createActionResult,
  createPostSchema,
  updatePostSchema,
} from "@/lib/validators";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user.id) throw new Error("Not authenticated");

  const user = await getDb().user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== "admin") throw new Error("Not authorized");
  return session.user;
}

export async function createPostAction(
  formData: FormData,
): Promise<ActionResult<{ slug: string }>> {
  try {
    await requireAdmin();

    const raw = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      content: formData.get("content"),
      published: formData.get("published") === "true",
    };

    const parsed = createPostSchema.safeParse(raw);
    if (!parsed.success) return createActionError(parsed.error.issues[0].message);

    // Handle thumbnail upload
    let thumbnail: string | undefined;
    const file = formData.get("thumbnail") as File | null;
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      thumbnail = await uploadThumbnail(buffer, file.name, file.type);
    }

    const post = await createPost({ ...parsed.data, thumbnail });
    revalidatePath("/");
    return createActionResult({ slug: post.slug });
  } catch (e) {
    return createActionError(e instanceof Error ? e.message : "Failed to create post");
  }
}

export async function updatePostAction(
  id: string,
  formData: FormData,
): Promise<ActionResult<{ slug: string }>> {
  try {
    await requireAdmin();

    const raw: Record<string, unknown> = {};
    for (const key of ["title", "slug", "content"] as const) {
      const val = formData.get(key);
      if (val !== null) raw[key] = val;
    }
    if (formData.has("published")) {
      raw.published = formData.get("published") === "true";
    }

    const parsed = updatePostSchema.safeParse(raw);
    if (!parsed.success) return createActionError(parsed.error.issues[0].message);

    // Handle thumbnail replacement
    const file = formData.get("thumbnail") as File | null;
    if (file && file.size > 0) {
      const existing = await getDb().post.findUnique({
        where: { id },
        select: { thumbnail: true },
      });
      if (existing?.thumbnail) await deleteThumbnail(existing.thumbnail);

      const buffer = Buffer.from(await file.arrayBuffer());
      parsed.data.thumbnail = await uploadThumbnail(buffer, file.name, file.type);
    }

    const post = await updatePost(id, parsed.data);
    revalidatePath("/");
    revalidatePath(`/blog/${post.slug}`);
    return createActionResult({ slug: post.slug });
  } catch (e) {
    return createActionError(e instanceof Error ? e.message : "Failed to update post");
  }
}

export async function deletePostAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    const post = await getDb().post.findUnique({ where: { id }, select: { thumbnail: true } });
    if (post?.thumbnail) await deleteThumbnail(post.thumbnail);

    await deletePost(id);
    revalidatePath("/");
    return createActionResult(undefined);
  } catch (e) {
    return createActionError(e instanceof Error ? e.message : "Failed to delete post");
  }
}
