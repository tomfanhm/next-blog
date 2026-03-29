"use client";

import { AvatarPicker } from "@/components/avatar-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfileFormProps {
  defaultName: string;
  defaultAvatar: string;
}

export function ProfileForm({ defaultName, defaultAvatar }: ProfileFormProps) {
  return (
    <div className="border-border bg-card w-full max-w-[480px] rounded-xl border p-8 shadow-sm">
      <div className="flex flex-col gap-1">
        <h1 className="text-foreground text-[22px] font-semibold">User Profile</h1>
        <p className="text-muted-foreground text-sm">Manage your display identity for comments</p>
      </div>

      <form className="mt-8 flex flex-col gap-8">
        {/* Display Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-medium">Display Name</label>
          <Input name="name" placeholder="Enter your nickname" defaultValue={defaultName} />
        </div>

        {/* Avatar Picker */}
        <AvatarPicker name="avatar" defaultValue={defaultAvatar} />

        {/* Save */}
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
