import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DateSidebar } from "./date-sidebar";

const meta: Meta<typeof DateSidebar> = {
  title: "Components/DateSidebar",
  component: DateSidebar,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        searchParams: { year: "2026", month: "3" },
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: "100vh" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DateSidebar>;

export const Default: Story = {
  args: {
    years: [
      { year: 2026, months: ["January", "February", "March"] },
      { year: 2025, months: ["September", "October", "November", "December"] },
      { year: 2024, months: ["June", "July"] },
    ],
  },
};

export const SingleYear: Story = {
  args: {
    years: [
      {
        year: 2026,
        months: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    years: [],
  },
};
