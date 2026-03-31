import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LoginForm } from "@/components/auth/login-form";
import { OAuthButtonsPreview } from "@/components/auth/oauth-buttons-preview";

const meta = {
  title: "Pages/Login",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function LoginPage() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center p-8">
      <LoginForm
        oauthButtons={<OAuthButtonsPreview />}
        footer={
          <p className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{" "}
            <span className="text-foreground cursor-pointer font-medium hover:underline">
              Register
            </span>
          </p>
        }
      />
    </main>
  );
}

export const Desktop: Story = {
  render: () => <LoginPage />,
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: () => <LoginPage />,
};
