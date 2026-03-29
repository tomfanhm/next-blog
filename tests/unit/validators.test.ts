import { describe, expect, it } from "vitest";

import {
  createActionError,
  createActionResult,
  emailSchema,
  paginationSchema,
  updateProfileSchema,
} from "@/lib/validators";

describe("emailSchema", () => {
  it("accepts a valid email", () => {
    expect(emailSchema.safeParse("user@example.com").success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(emailSchema.safeParse("not-an-email").success).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(emailSchema.safeParse("").success).toBe(false);
  });
});

describe("paginationSchema", () => {
  it("provides defaults when no input given", () => {
    const result = paginationSchema.parse({});
    expect(result).toEqual({ page: 1, limit: 20 });
  });

  it("coerces string values to numbers", () => {
    const result = paginationSchema.parse({ page: "3", limit: "50" });
    expect(result).toEqual({ page: 3, limit: 50 });
  });

  it("rejects limit above 100", () => {
    expect(paginationSchema.safeParse({ limit: 200 }).success).toBe(false);
  });
});

describe("updateProfileSchema", () => {
  it("accepts valid profile data", () => {
    const result = updateProfileSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = updateProfileSchema.safeParse({
      name: "",
      email: "jane@example.com",
    });
    expect(result.success).toBe(false);
  });
});

describe("action result helpers", () => {
  it("creates a success result", () => {
    const result = createActionResult({ id: "1" });
    expect(result).toEqual({ success: true, data: { id: "1" } });
  });

  it("creates an error result", () => {
    const result = createActionError("Something went wrong");
    expect(result).toEqual({ success: false, error: "Something went wrong" });
  });
});
