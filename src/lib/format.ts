/**
 * Shared formatting and text utilities.
 */

/**
 * Format a date for display.
 * @param date  The date to format.
 * @param style "long" → "March 31, 2026", "short" → "Mar 31, 2026"
 */
export function formatDate(date: Date, style: "long" | "short" = "long"): string {
  return date.toLocaleDateString("en-US", {
    month: style,
    day: "numeric",
    year: "numeric",
  });
}

/** Relative time string, e.g. "just now", "5m ago", "3h ago", "2d ago". */
export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${String(minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${String(hours)}h ago`;
  const days = Math.floor(hours / 24);
  return `${String(days)}d ago`;
}

/** Strip markdown syntax and truncate to a plain-text excerpt. */
export function excerpt(content: string, maxLength = 160): string {
  const plain = content.replace(/[#*`>\-\[\]()!]/g, "").trim();
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trimEnd() + "…";
}

/** Generate a URL-safe slug from a title string. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
