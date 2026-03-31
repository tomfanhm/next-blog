import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { OAuthButtonsPreview } from "@/components/auth/oauth-buttons-preview";
import { RegisterForm } from "@/components/auth/register-form";

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
      <RegisterForm
        oauthButtons={<OAuthButtonsPreview />}
        footer={
          <p className="text-muted-foreground text-center text-sm">
            Already have an account?{" "}
            <span className="text-foreground cursor-pointer font-medium hover:underline">
              Sign in
            </span>
          </p>
        }
      />
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
