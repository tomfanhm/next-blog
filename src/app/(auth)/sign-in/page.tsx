import { Globe, SquareTerminal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signIn } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Next Blog account.",
};

export default function SignInPage() {
  return (
    <Card className="w-full max-w-sm">
      {/* Header */}
      <CardHeader className="items-center gap-2 pb-0">
        <Link href="/" className="text-foreground text-2xl font-semibold hover:opacity-80">
          Next Blog
        </Link>
        <p className="text-muted-foreground text-sm">Sign in to your account</p>
      </CardHeader>

      {/* Email & Password Fields */}
      <CardContent className="flex flex-col gap-5 px-8 pt-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-medium">Email</label>
          <Input type="email" placeholder="your@email.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-sm font-medium">Password</label>
          <Input type="password" placeholder="Enter your password" />
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="flex flex-col gap-4 px-8 pb-6">
        <form
          className="w-full"
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
        >
          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>

        {/* Divider */}
        <div className="flex w-full items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">or continue with</span>
          <Separator className="flex-1" />
        </div>

        {/* OAuth Buttons */}
        <div className="flex w-full gap-3">
          <form
            className="flex-1"
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/dashboard" });
            }}
          >
            <Button variant="outline" className="w-full gap-2" type="submit">
              <SquareTerminal className="h-4 w-4" />
              GitHub
            </Button>
          </form>
          <form
            className="flex-1"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <Button variant="outline" className="w-full gap-2" type="submit">
              <Globe className="h-4 w-4" />
              Google
            </Button>
          </form>
        </div>

        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-foreground hover:underline">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
