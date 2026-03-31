import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  oauthButtons: ReactNode;
  footer: ReactNode;
}

export function LoginForm({ oauthButtons, footer }: LoginFormProps) {
  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-bold">Next Blog</h1>
          <p className="text-muted-foreground text-sm">Sign in to your account</p>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        {oauthButtons}

        {footer}
      </div>
    </div>
  );
}
