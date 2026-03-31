import Link from "next/link";

import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Sign Up" };

export default function SignUpPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-bold">Next Blog</h1>
          <p className="text-muted-foreground text-sm">Create your account</p>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" type="text" placeholder="Enter your name" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Create a password" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="Confirm your password" />
          </div>

          <Button type="button" className="w-full">
            Create Account
          </Button>
        </form>

        <OAuthButtons />

        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-foreground font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
