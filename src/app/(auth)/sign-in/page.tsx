import Link from "next/link";

import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Sign In" };

export default function SignInPage() {
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

          <Button type="button" className="w-full">
            Login
          </Button>
        </form>

        <OAuthButtons />

        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-foreground font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
