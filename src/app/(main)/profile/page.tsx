"use client";

import { useState } from "react";

import { AvatarPicker } from "@/components/blog/avatar-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AvatarPreset } from "@/lib/validators";

export default function ProfilePage() {
  // TODO: Load from session / database
  const [displayName, setDisplayName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarPreset>("avatar-cat");

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Manage your display identity for comments</CardDescription>
        </CardHeader>

        <CardContent>
          {/* TODO: Wire to updateProfile server action */}
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                Display Name
              </label>
              <Input
                id="displayName"
                placeholder="Enter your nickname"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                }}
              />
            </div>

            <AvatarPicker selected={selectedAvatar} onSelect={setSelectedAvatar} />

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
