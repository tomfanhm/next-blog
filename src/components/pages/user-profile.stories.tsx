"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BottomNav } from "@/components/blog/bottom-nav";
import { BlogHeader } from "@/components/blog/header";
import { ProfileForm } from "@/components/blog/profile-form";

const meta = {
  title: "Pages/UserProfile",
  parameters: {
    layout: "fullscreen",
    nextjs: {
      navigation: { pathname: "/profile" },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function mockSubmit() {
  return Promise.resolve({ success: true as const, data: undefined });
}

function ProfileContent({ showMobileNav }: { showMobileNav?: boolean }) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <BlogHeader />
      <div className={`mx-auto w-full max-w-md px-4 py-8 ${showMobileNav ? "pb-20" : ""}`}>
        <ProfileForm userName="Jane Doe" onSubmit={mockSubmit} />
      </div>
      {showMobileNav && <BottomNav />}
    </div>
  );
}

export const Desktop: Story = {
  render: () => <ProfileContent />,
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: () => <ProfileContent showMobileNav />,
};
