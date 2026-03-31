"use client";

import { useActionState, useState } from "react";

import { AvatarPicker } from "@/components/blog/avatar-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionResult, AvatarPreset } from "@/lib/validators";

interface ProfileFormProps {
  userName: string;
  onSubmit: (formData: FormData) => Promise<ActionResult>;
}

export function ProfileForm({ userName, onSubmit }: ProfileFormProps) {
  const [selected, setSelected] = useState<AvatarPreset>("avatar-cat");

  async function handleSubmit(
    _prev: ActionResult | null,
    formData: FormData,
  ): Promise<ActionResult> {
    return onSubmit(formData);
  }

  const [state, action, isPending] = useActionState(handleSubmit, null);

  const formContent = (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Display Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your nickname"
          defaultValue={userName}
          required
        />
      </div>

      <AvatarPicker selected={selected} onSelect={setSelected} />

      <div aria-live="polite">
        {state && !state.success && <p className="text-destructive text-sm">{state.error}</p>}
        {state?.success && <p className="text-success text-sm">Profile updated!</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );

  return (
    <>
      {/* Mobile: flat layout without Card */}
      <div className="flex flex-col gap-6 md:hidden">
        <div>
          <h1 className="text-xl font-bold">User Profile</h1>
          <p className="text-muted-foreground text-sm">Manage your display identity for comments</p>
        </div>
        {formContent}
      </div>

      {/* Desktop: Card wrapper */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Manage your display identity for comments</CardDescription>
          </CardHeader>
          <CardContent>{formContent}</CardContent>
        </Card>
      </div>
    </>
  );
}
