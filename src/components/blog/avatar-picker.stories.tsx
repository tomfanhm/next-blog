"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import type { AvatarPreset } from "@/lib/validators";

import { AvatarPicker } from "./avatar-picker";

const meta = {
  title: "Blog/AvatarPicker",
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function AvatarPickerControlled() {
  const [selected, setSelected] = useState<AvatarPreset>("avatar-cat");
  return <AvatarPicker selected={selected} onSelect={setSelected} />;
}

export const Default: Story = {
  render: () => <AvatarPickerControlled />,
};
