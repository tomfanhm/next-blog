import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { OAuthButtonsPreview } from "@/components/auth/oauth-buttons-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const meta = {
  title: "Pages/Register",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function RegisterPage() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-2xl font-bold">Next Blog</h1>
            <p className="text-muted-foreground text-sm">Create your account</p>
          </div>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                Display Name
              </label>
              <Input id="displayName" type="text" placeholder="Enter your name" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input id="password" type="password" placeholder="Create a password" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <Input id="confirmPassword" type="password" placeholder="Confirm your password" />
            </div>

            <Button type="button" className="w-full">
              Create Account
            </Button>
          </form>

          <OAuthButtonsPreview />

          <p className="text-muted-foreground text-center text-sm">
            Already have an account?{" "}
            <span className="text-foreground cursor-pointer font-medium hover:underline">
              Sign in
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}

export const Desktop: Story = {
  render: () => <RegisterPage />,
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: () => <RegisterPage />,
};
