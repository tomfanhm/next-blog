"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { AvatarPicker } from "@/components/blog/avatar-picker";
import { BottomNav } from "@/components/blog/bottom-nav";
import { BlogHeader } from "@/components/blog/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AvatarPreset } from "@/lib/validators";

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

function ProfileContent({ showMobileNav }: { showMobileNav?: boolean }) {
  const [selected, setSelected] = useState<AvatarPreset>("avatar-cat");

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <BlogHeader />
      <div className={`mx-auto w-full max-w-md px-4 py-8 ${showMobileNav ? "pb-20" : ""}`}>
        {showMobileNav ? (
          // Mobile: flat layout without Card wrapper
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-xl font-bold">User Profile</h1>
              <p className="text-muted-foreground text-sm">
                Manage your display identity for comments
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                Display Name
              </label>
              <Input id="displayName" defaultValue="Jane Doe" />
            </div>

            <AvatarPicker selected={selected} onSelect={setSelected} />

            <Button className="w-full">Save Changes</Button>
          </div>
        ) : (
          // Desktop: Card wrapper
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your display identity for comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="displayNameDesktop" className="text-sm font-medium">
                    Display Name
                  </label>
                  <Input id="displayNameDesktop" placeholder="Enter your nickname" />
                </div>

                <AvatarPicker selected={selected} onSelect={setSelected} />

                <Button className="w-full">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        )}
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
