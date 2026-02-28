import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "../src/components/Select";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "changed" },
    error: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const mockOptions = [
  {
    id: 1,
    name: "React",
    icon: "⚛️",
    desc: "A JavaScript library for building UIs",
  },
  {
    id: 2,
    name: "Vue",
    icon: "🟢",
    desc: "The Progressive JavaScript Framework",
  },
  {
    id: 3,
    name: "Angular",
    icon: "🔴",
    desc: "The modern web developer's platform",
  },
  {
    id: 4,
    name: "Svelte",
    icon: "🔥",
    desc: "Cybernetically enhanced web apps",
  },
  {
    id: 5,
    name: "Solid",
    icon: "🧊",
    desc: "Simple and performant reactivity",
  },
];

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.multiple ? [] : null);

    return (
      <div className="p-8 min-h-[400px]">
        <Select
          {...args}
          value={value}
          onChange={setValue}
          options={mockOptions}
        />
      </div>
    );
  },
  args: {
    label: "Select Elements",
    name: "frameworks",
    withSearch: true,
    multiple: true,
    outlined: false,
    usePortal: true,
    required: false,
    disabled: false,
    containerClassName: "max-w-md",
  },
};

export const ErrorState: Story = {
  render: (args) => {
    const [value, setValue] = useState(null);
    return (
      <div className="p-8">
        <Select
          {...args}
          value={value}
          onChange={setValue}
          options={mockOptions}
        />
      </div>
    );
  },
  args: {
    label: "Favorite Framework",
    required: true,
    error: "Please select a framework to continue.",
  },
};

export const DisabledState: Story = {
  render: (args) => {
    const [value, setValue] = useState([mockOptions[0], mockOptions[1]]);
    return (
      <div className="p-8">
        <Select
          {...args}
          value={value}
          onChange={setValue}
          options={mockOptions}
        />
      </div>
    );
  },
  args: {
    label: "Archived Selection",
    multiple: true,
    disabled: true,
  },
};

export const CustomRendering: Story = {
  render: (args) => {
    const [value, setValue] = useState(null);
    return (
      <div className="p-8 min-h-[400px]">
        <Select
          {...args}
          value={value}
          onChange={setValue}
          options={mockOptions}
          renderOption={(option, isSelected) => (
            <div className="flex flex-col w-full py-1">
              <div className="flex items-center gap-2 font-medium">
                <span className="text-lg leading-none">{option.icon}</span>
                <span
                  className={isSelected ? "text-teal-900" : "text-gray-900"}
                >
                  {option.name}
                </span>
              </div>
              <span className="text-xs text-gray-500 ml-7 leading-tight">
                {option.desc}
              </span>
            </div>
          )}
        />
      </div>
    );
  },
  args: {
    label: "Choose Technology (Custom Render)",
    withSearch: true,
  },
};

export const ZIndexPortalTest: Story = {
  render: (args) => {
    const [value, setValue] = useState(null);
    return (
      <div className="p-8 relative h-[300px] w-full overflow-hidden border-2 border-dashed border-gray-300 bg-white">
        <p className="mb-4 text-sm text-gray-500">
          This container has <code>overflow-hidden</code>. If{" "}
          <code>usePortal</code> is false, the menu will be cut off. There is
          also a high z-index element below.
        </p>

        <Select
          {...args}
          value={value}
          onChange={setValue}
          options={mockOptions}
        />

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-red-100 border-t-2 border-red-300 z-[1500] text-red-800 font-bold text-center shadow-lg">
          Z-Index 1500 Obstacle
        </div>
      </div>
    );
  },
  args: {
    label: "Portal Test Select",
    usePortal: true,
  },
};
