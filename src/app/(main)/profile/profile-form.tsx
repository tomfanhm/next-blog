"use client";

import { useActionState } from "react";

import { updateProfileAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ActionResult } from "@/lib/validators";

interface ProfileFormProps {
  userName: string;
}

export function ProfileForm({ userName }: ProfileFormProps) {
  async function handleSubmit(
    _prev: ActionResult | null,
    formData: FormData,
  ): Promise<ActionResult> {
    return updateProfileAction(formData);
  }

  const [state, action, isPending] = useActionState(handleSubmit, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Manage your display identity for comments</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={action} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Display Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your nickname"
              defaultValue={userName}
              required
            />
          </div>

          {state && !state.success && <p className="text-destructive text-sm">{state.error}</p>}

          {state?.success && <p className="text-sm text-green-600">Profile updated!</p>}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
