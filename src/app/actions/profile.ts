"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { type ActionResult, createActionError, createActionResult } from "@/lib/validators";

export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user.id) return createActionError("Not authenticated");

    const name = formData.get("name");
    if (typeof name !== "string" || name.trim().length === 0) {
      return createActionError("Name is required");
    }
    if (name.length > 100) {
      return createActionError("Name must be 100 characters or fewer");
    }

    await getDb().user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
    });

    revalidatePath("/profile");
    return createActionResult(undefined);
  } catch (e) {
    return createActionError(e instanceof Error ? e.message : "Failed to update profile");
  }
}
