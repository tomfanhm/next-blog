import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DateSidebar } from "./date-sidebar";

const meta = {
  title: "Blog/DateSidebar",
  component: DateSidebar,
  parameters: {
    layout: "centered",
    viewport: { defaultViewport: "responsive" },
  },
  decorators: [
    (Story) => (
      <div className="w-48">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dateGroups: [
      { year: 2024, months: ["March", "February", "January"] },
      { year: 2023, months: ["December", "November", "October"] },
      { year: 2022, months: ["June", "March"] },
    ],
  },
};

export const SingleYear: Story = {
  args: {
    dateGroups: [{ year: 2024, months: ["March", "February", "January"] }],
  },
};
