import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Post",
  description: "Create a new blog post.",
};

export default function NewPostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
