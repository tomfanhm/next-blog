import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AvatarPicker } from "@/components/avatar-picker";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function UserProfilePage() {
  return (
    <div className="bg-background text-foreground flex h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-10 py-10">
        <div className="border-border bg-card w-full max-w-[480px] rounded-xl border p-8 shadow-sm">
          <div className="flex flex-col gap-1">
            <h1 className="text-foreground text-[22px] font-semibold">User Profile</h1>
            <p className="text-muted-foreground text-sm">
              Manage your display identity for comments
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-8">
            <div className="flex flex-col gap-1.5">
              <label className="text-foreground text-sm font-medium">Display Name</label>
              <Input defaultValue="Enter your nickname" />
            </div>

            <AvatarPicker name="avatar" defaultValue="avatar-cat" />

            <Button className="w-full">Save Changes</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

const meta: Meta = {
  title: "Pages/User Profile",
  component: UserProfilePage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
