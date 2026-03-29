import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AvatarPicker } from "./avatar-picker";

const meta: Meta<typeof AvatarPicker> = {
  title: "Components/AvatarPicker",
  component: AvatarPicker,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AvatarPicker>;

export const Default: Story = {
  args: {
    name: "avatar",
  },
};

export const WithPreselected: Story = {
  args: {
    name: "avatar",
    defaultValue: "avatar-fox",
  },
};
