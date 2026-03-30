import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Globe, SquareTerminal } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

function RegisterPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center gap-2 pb-0">
          <h1 className="text-foreground text-2xl font-semibold">Next Blog</h1>
          <p className="text-muted-foreground text-sm">Create your account</p>
        </CardHeader>

        <CardContent className="flex flex-col gap-5 px-8 pt-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground text-sm font-medium">Display Name</label>
            <Input placeholder="Enter your name" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground text-sm font-medium">Email</label>
            <Input type="email" placeholder="your@email.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground text-sm font-medium">Password</label>
            <Input type="password" placeholder="Create a password" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-foreground text-sm font-medium">Confirm Password</label>
            <Input type="password" placeholder="Confirm your password" />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 px-8 pb-6">
          <Button className="w-full">Create Account</Button>

          <div className="flex w-full items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-xs">or continue with</span>
            <Separator className="flex-1" />
          </div>

          <div className="flex w-full gap-3">
            <Button variant="outline" className="flex-1 gap-2">
              <SquareTerminal className="h-4 w-4" />
              GitHub
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <Globe className="h-4 w-4" />
              Google
            </Button>
          </div>

          <p className="text-muted-foreground text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

const meta: Meta = {
  title: "Pages/Register",
  component: RegisterPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
