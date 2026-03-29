import { z } from "zod";

// ─── Shared validation schemas ───────────────────────────

export const emailSchema = z.string().email("Invalid email address").min(1);

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ─── Example: User profile update ────────────────────────

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: emailSchema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ─── Blog ─────────────────────────────────────────────────

export const AVATAR_PRESETS = [
  "avatar-cat",
  "avatar-dog",
  "avatar-fox",
  "avatar-owl",
  "avatar-bear",
  "avatar-rabbit",
  "avatar-panda",
  "avatar-koala",
] as const;

export type AvatarPreset = (typeof AVATAR_PRESETS)[number];

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.string().url().optional(),
  published: z.boolean().default(false),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.partial();

export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000),
  authorName: z.string().min(1, "Name is required").max(50),
  authorAvatar: z.enum(AVATAR_PRESETS),
  postId: z.string().min(1),
  parentId: z.string().optional(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export const postFiltersSchema = z.object({
  search: z.string().optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  day: z.coerce.number().int().min(1).max(31).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ─── Server Action helper ────────────────────────────────

export type ActionResult<T = void> = { success: true; data: T } | { success: false; error: string };

export function createActionResult<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function createActionError(error: string): ActionResult<never> {
  return { success: false, error };
}
