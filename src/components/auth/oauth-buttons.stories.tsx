import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { OAuthButtonsPreview } from "./oauth-buttons-preview";

const meta = {
  title: "Auth/OAuthButtons",
  component: OAuthButtonsPreview,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OAuthButtonsPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
